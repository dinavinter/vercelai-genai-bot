import {
    AnyEventObject,
    AnyMachineSnapshot,
    AnyStateNode,
    fromObservable, isMachineSnapshot,
    ObservableActorLogic, Observer, Subscribable, toObserver,
    TransitionDefinition
} from "xstate";
import {DynamicStructuredTool, StructuredToolInterface} from "@langchain/core/tools";
import {z, ZodSchema} from "zod";
import {RunnableSequence} from "@langchain/core/runnables";
import {InputValues} from "@langchain/core/memory";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {BaseChatModel} from "@langchain/core/dist/language_models/chat_models";
import {AgentExecutor, createOpenAIToolsAgent} from "langchain/agents";
import {pull} from "langchain/hub";

export type LangChainAgentSettings< TPrompt extends ChatPromptTemplate>  ={
    model: BaseChatModel;
    promptTemplate: TPrompt
    
} 

export function fromEventChoiceStream<
    RunInput extends InputValues,
    TPrompt extends ChatPromptTemplate<RunInput>,
    TOutput extends AnyEventObject = AnyEventObject
>({model,promptTemplate}: LangChainAgentSettings <TPrompt> ) {
   
    return fromObservable<TOutput, RunInput>(({input, system, self}) => {
        const observers = new Set<Observer<any>>();
        const parentSnapshot = self._parent?.getSnapshot();

        if (parentSnapshot || !isMachineSnapshot(parentSnapshot)) {

            const transitions = getAllTransitions(self._parent!.getSnapshot());


            const sendEvent = (event: any) => {
                observers.forEach((observer) => {
                    observer.next?.(event);
                });
                // @ts-ignore
                system._relay(self, self._parent, event);
            }

            (async () => {
                const tools = toTools( transitions, sendEvent);

                let agent = await createOpenAIToolsAgent({
                    llm: model,
                    tools: tools,
                    prompt: ChatPromptTemplate.fromMessages([await pull<ChatPromptTemplate>("hwchase17/openai-tools-agent"), promptTemplate]),
                });

                const agentExecutor = new AgentExecutor({
                    agent: agent,
                    tools,
                    verbose: false,
                    returnIntermediateSteps: true,
                    handleParsingErrors: true,
                });

                const stream = await agentExecutor.stream({input: 'use the tools to accomplish the user request, you can use the multiple tools, dont stop until task accomplish', ...input});

                for await (const part of stream) {
                    observers.forEach((observer) => {
                        observer.next?.(part);
                    });
                }
            })();
        }

        return {
            subscribe: (...args: any) => {
                const observer = toObserver(...(args as any));
                observers.add(observer);

                return {
                    unsubscribe: () => {
                        observers.delete(observer);
                    },
                };
            },
        };

    })
}
function fromObservableChain<TInput, TOutput>(runnable: RunnableSequence<TInput, TOutput>): ObservableActorLogic<TOutput, TInput> {
    return fromObservable(function ({input, system, self}): Subscribable<TOutput> {
        const observers = new Set<Observer<any>>();

        (async () => {
            const stream = await runnable.stream(input);

            for await (const part of stream) {
                observers.forEach((observer) => {
                    observer.next?.(part);
                });
            }
        })();

        return {
            subscribe: (...args: any) => {
                const observer = toObserver(...(args as any));
                observers.add(observer);

                return {
                    unsubscribe: () => {
                        observers.delete(observer);
                    },
                };
            },
        };
    }) satisfies ObservableActorLogic<TOutput, TInput>
}
export function getAllTransitions(state: AnyMachineSnapshot) {
    const nodes = state._nodes;
    return (nodes as AnyStateNode[])
        .map((node) => [...(node as AnyStateNode).transitions.values()])
        .flat(2);
}


function toTools<TSentEvent extends AnyEventObject = AnyEventObject>(
    transitions: TransitionDefinition<any, TSentEvent>[],
    action: (event: TSentEvent) => void) {

    return transitions
         .map(transitionDetails)
        .map(toAgentTool)

 

    function transitionDetails({eventType, description, meta}: TransitionDefinition<any, TSentEvent>) {
        const schema = meta?.schema as ZodSchema || z.object({})
        return {
            name: eventType.replace(/\./g, '_'),
            description: description ?? schema?.description ?? `use this to send an event with the type ${eventType}`,
            eventType: eventType,
            schema: schema
        }
    }


    function toAgentTool({name, description, eventType, schema}: {
        name: string,
        description: string,
        eventType: TSentEvent["type"],
        schema: ZodSchema
    }): StructuredToolInterface {

        //is it better to define a zod schema from the first place?
        return new DynamicStructuredTool({
            func(input: z.infer<typeof schema>): Promise<string> {
                return new Promise((resolve, reject) => {
                    action({type: eventType, ...input});
                    resolve("success");
                })
            },
            name: name,
            description: description,
            schema: schema as any,

        })
    }

 


}

