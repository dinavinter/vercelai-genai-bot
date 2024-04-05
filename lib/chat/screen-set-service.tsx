import 'server-only'

import {createStreamableUI} from "ai/rsc";
import React from "react";
import {BotCard, BotMessage, SpinnerMessage} from "@/components/stocks/message";
import {createAI, createStreamableValue, getAIState, getMutableAIState} from "ai/rsc";
import {
    ActorRef,
    ActorRefFrom,
    ContextFrom,
    createActor,
    fromCallback, fromObservable,
    fromPromise,
    MachineContext,
    MachineSnapshot, ObservableSnapshot
} from "xstate";
import {machine, ScreenSetGenMachine} from "@/lib/chat/screen-set-gen";
import {nanoid} from "@/lib/utils";
import {AI, AIState, getUIStateFromAIState, UIState} from "@/lib/chat/actions";
import {ChatOpenAI} from "@langchain/openai";import {fromEventChoiceStream} from "@/lib/chat/langchain";
import {ChatPromptTemplate, PromptTemplate} from "@langchain/core/prompts";
import {auth} from "@/auth";
import {Chat} from "@/lib/types";
import {saveChat} from "@/app/actions";
import Textarea from "react-textarea-autosize";


// We need to wrap this in an async IIFE to avoid blocking. Without it, the UI wouldn't render
async function Spinner() {
    'use server'
    return <SpinnerMessage/>;
}

/*
export const AI = createAI<AIState, UIState>({
    actions: {
        submitUserMessage:submitUserMessageScreenSet
    },
    initialUIState: [],
    initialAIState: { chatId: nanoid(), messages: [] },
    unstable_onGetUIState: async () => {
        'use server'

        const session = await auth()

        if (session && session.user) {
            const aiState = getAIState()

            if (aiState) {
                const uiState = getUIStateFromAIState(aiState)
                return uiState
            }
        } else {
            return
        }
    },
    unstable_onSetAIState: async ({ state, done }) => {
        'use server'

        const session = await auth()

        if (session && session.user) {
            const { chatId, messages } = state

            const createdAt = new Date()
            const userId = session.user.id as string
            const path = `/chat/${chatId}`
            const title = messages[0].content.substring(0, 100)


            const chat: Chat = {
                id: chatId,
                title,
                userId,
                createdAt,
                messages,
                path
            }

            await saveChat(chat)
        } else {
            return
        }
    }
})
*/

export async function submitUserMessageScreenSet(content: string) {
    'use server'
    let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
    if (!textStream) { 
        textStream = createStreamableValue('')
     }
    const ui = createStreamableUI(<SpinnerMessage />);

    // ui.update(<BotMessage content={textStream.value}/>)
    const aiState = getMutableAIState<typeof AI>()

    async function getAskUserQuestion(_context, event:any) {
        'use server';
        console.log('askUserQuestion', JSON.stringify( event))
        ui.append(   <BotMessage content={(event as any).quastion}/>)
        
        
    }

    const service = createActor(machine.provide({
        actions: {
            'askUserQuestion': getAskUserQuestion,
            'updated.bdds':  (context, event) => {
                    console.log('updated.bdds', JSON.stringify({context, event}))
                   ui.append(<BotCard >
                        <BotMessage content={'updated.bdds'}/>
                        <BotMessage content={JSON.stringify({context, event})}/>
                    </BotCard>)
                },
            'updated.spec':  (context, event) => {
                    console.log('updated.spec', JSON.stringify({context, event}))
                    ui.append(<BotCard >
                        <Textarea>{JSON.stringify({event})}</Textarea>
                    </BotCard>)
                }
            

        },
        actors:{
            llm: fromEventChoiceStream({
                model: new ChatOpenAI(),
                promptTemplate:  ChatPromptTemplate.fromTemplate(`{prompt} {context}`) 
            })
        }
    }), {
        input: {
            messages: [
                ...aiState.get()?.messages, 
                {
                    id: nanoid(),
                    role: 'user',
                    content
                }]
        },
        snapshot: aiState.get()?.snapshot,
        inspect: {
            next(state: any) {
                'use server'
                if (state.type === '@xstate.snapshot') {
                    aiState.update({
                        ...aiState.get(),
                        snapshot: service.getSnapshot(),
                        messages:  service.getSnapshot().context.messages
                    })
                }
                console.log('next', JSON.stringify({state}, null, 2))

            },
            error(state: any) {
                console.error('error', state);
            }

        }
    })
    service.subscribe((state) => {
        console.log('state', JSON.stringify(state, null, 2))
    })
 
    console.log('service', JSON.stringify(service.getSnapshot().context.messages, null, 2))
    aiState.update({
        ...aiState.get(),
        snapshot: service.getSnapshot(),
        messages: service.getSnapshot().context.messages
        
    })


    service.subscribe((state) => {
        // if (state.matches('xstate.done')) {
        //     textNode = <ScreenSetChat data={state.context}/>
        // }
        
        ui.update( <BotMessage content={state.context.messages[state.context.messages.length - 1].content}/>)
        
        aiState.update({
            ...aiState.get(),
            snapshot: service.getSnapshot(),
            messages: service.getSnapshot().context.messages

        })
        console.log('state', JSON.stringify(state, null, 2))
     });

    // while the fetch or LLM call are in progress.
    (async () => {


        // Show a spinner as the history chart for now.
        // We won't be updating this again so we use `ui.done()` instead of `ui.update()`.
        const historyChart = createStreamableUI(<Spinner/>);
        ui.done(<StockCard historyChart={historyChart.value} price={price}/>);

        // Getting the history data and then update that part of the UI.
        const historyData = await fetch('https://my-stock-data-api.com');
        historyChart.done(<ScreenSetChat data={historyData}/>);
    })();
    service.start();
    service.send({type:'start'})
    return {
        id: nanoid(),
        display: ui.value
    };
}