import 'server-only'

import {createStreamableUI} from "ai/rsc";
import React, {ReactNode} from "react";
import {BotCard, BotMessage, SpinnerMessage} from "@/components/stocks/message";
import {createAI, createStreamableValue, getAIState, getMutableAIState} from "ai/rsc";
import {nanoid} from "@/lib/utils";
import {ChatOpenAI} from "@langchain/openai";import {fromEventChoiceStream} from "@/lib/chat/langchain";
import {ChatPromptTemplate, PromptTemplate} from "@langchain/core/prompts";
import {auth} from "@/auth";
import {Chat} from "@/lib/types";
import {saveChat} from "@/app/actions";
import Textarea from "react-textarea-autosize";
import {Dialog} from "@/components/ui/dialog";
import {
    Flex,
    TextField,
    Text,
    Box,
    Card,
    Avatar,
    Popover,
    Button,
    Grid,
    DataList,
    Skeleton,
    Inset
} from "@radix-ui/themes";
import {AI} from "@/lib/chat/actions";

// We need to wrap this in an async IIFE to avoid blocking. Without it, the UI wouldn't render
async function Spinner() {
    'use server'
    return <SpinnerMessage/>;
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
    role: 'user' | 'assistant' | 'system' | 'function';
    content: string;
    id?: string;
    name?: string;
}[] = [];

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
    id: number;
    display: React.ReactNode;
}[] = [];



export const AI2 = createAI({
    actions: {
        submitUserMessage
    },
    // Each state can be any shape of object, but for chat applications
    // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
    initialUIState,
    initialAIState
});


async function meta( screenCards:ReturnType<typeof createStreamableUI>) {

    const screenCard= (stream:ReturnType<typeof createStreamableUI>) =>{
        screenCards.append(stream.value);
        return {
            ...stream,
            preparing(message:string){
                stream.append(<Card size="1">{message}... <SpinnerMessage  /><Skeleton /></Card>)
                return {
                    wait(timeout:number) {
                        return new Promise((resolve) => setTimeout(resolve, timeout));
                    }
                }
            }
        }
    }

    const meta = screenCard(createStreamableUI());
    await meta.preparing("Setting up Meta Data").wait(1000);
    meta.done(<Card size="1">
        <label>
            <Text as="div" size="2" mb="1" weight="bold">
                Screen Name
            </Text>
            <TextField.Root
                value="Register"
                placeholder="Screen Name"
            />
        </label>
        <label>
            <Text as="div" size="2" mb="1" weight="bold">
                Screen Type
            </Text>
            <TextField.Root
                defaultValue="Registration"
                placeholder="Screen Type"
            />
        </label>
        <label>
            <Text as="div" size="2" mb="1" weight="bold">
                Screen Description
            </Text>
            <TextField.Root
                defaultValue="Register to get started"
                placeholder="Screen Description"
            />

        </label>
    </Card>)
}

const spinner =(message:string)=> <Card size="1"><BotCard>{message} <SpinnerMessage  /><Skeleton /></BotCard></Card>
function mock <T>(data:T, timeout:number=1000) {
    return ()=> new Promise<T>((resolve) => setTimeout(() => resolve(data), timeout));
}

type AsyncReturnType<T extends (...args: any) => any> =
    T extends (...args: any) => Promise<infer U> ? U :
        T extends (...args: any) => infer U ? U :
            any

type LazyCardProps<prepareT extends ()=>Promise<any> =()=>Promise<any>, T =AsyncReturnType<prepareT> > = {
    preparing:ReactNode,
    prepare:prepareT & (()=>Promise<T>),
    done:(arg:T)=> ReactNode
}

 function cardsCollection(cardsStream:ReturnType<typeof createStreamableUI>) {
    return {stream: cardsStream, card:async (args:LazyCardProps):Promise<{
            stream:ReturnType<typeof createStreamableUI>,
            data:AsyncReturnType<typeof args.prepare>
        }>=> {
        const stream = createStreamableUI(args.preparing);
        cardsStream.append(stream.value);
        const result = await args.prepare();
        stream.done(args.done(result));
        return {
            stream,
            data:result
        }
    }}
}


export async function submitUserMessage(content: string) {
    'use server'
    // let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
    // if (!textStream) { 
    //     textStream = createStreamableValue('')
    //  }

    const aiState = getMutableAIState<typeof AI>();

    // Update the AI state with the new user message.
      aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })
      


    const cards =  cardsCollection(createStreamableUI());
    const ui = createStreamableUI(<SpinnerMessage />); 
   

        
    ui.done(
        <Flex  direction="column" gap="1" overflow={"scroll"}  >
            {cards.stream.value} 
        </Flex>);
     
    // while the fetch or LLM call are in progress.
    (async () => {
 
        await cards.card({
            preparing: spinner("Setting up Info..."),
            prepare: mock({name:"Registration Flow",industry:"E-Commerce",description:content}),
            done: ({name,industry,description}) => <Card size="1">
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Title
                    </Text>
                    <TextField.Root
                        value={name}
                        placeholder="E-Commerce"
                    />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Industry
                    </Text>
                    <TextField.Root
                        value={industry}
                        placeholder="E-Commerce"
                    />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Description
                    </Text>
                    <TextField.Root
                        value={description}
                        placeholder={description}
                    />
                </label>
            </Card>
        })
        
        const screens= cardsCollection(createStreamableUI(<Skeleton />));
        await cards.card({
            preparing: spinner("Getting screens..."),
            prepare: mock({screens: screens}),
            done: ({screens}) => <Card > 
                <Text as="span" size="3" mb="1" weight="bold">
                    Screens
                </Text> 
                <DataList.Root>
                    {screens.stream.value} 
                </DataList.Root>  
            </Card>})
        
        const screen1= cardsCollection(createStreamableUI(<Skeleton />));
        await screens.card({
            preparing: spinner("Getting screen..."),
            prepare: mock({id:"register-screen", title:"Register", cards: screen1}),
            done: ({id, title, cards}) =>  
                <DataList.Item key={id}>
                    <Text as="span" size="2" mb="1" weight="bold">
                        {title}
                    </Text>
                    <Card size="1">
                        {cards.stream.value}
                    </Card>
                </DataList.Item> 
             
        })
        
        await screen1.card({
            preparing: spinner("Setting up Meta Data..."), 
            prepare: mock({name:"register-screen",type:"Registration"}), 
            done: ({name,type}) => <Card size="1">
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Screen Name
                    </Text>
                    <TextField.Root
                        value={name}
                        placeholder="Screen Name"
                    />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Screen Type
                    </Text>
                    <TextField.Root
                        value={type}
                        placeholder="Flow"
                    />
                </label>
            </Card>
        })
        
        await screen1.card({
            preparing: spinner("Setting up UI Data..."),
            prepare: mock({theme: "dark",layout:"vertical"}),
            done: ({theme,layout}) => <Card size="1">
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Theme
                    </Text>
                    <TextField.Root
                        value={theme}
                        placeholder="Theme"
                    />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Layout
                    </Text>
                    <TextField.Root
                        value={layout}
                        placeholder="Layout"
                    />
                </label>
            </Card>
        }) 
        
        await screen1.card({
            preparing: spinner("Setting up Fields..."),
            prepare: mock({fields: ["Email", "First Name", "Last Name"]}),
            done: ({fields}) => <Card size="1">
                <Text as="div" size="3" mb="1" weight="bold">
                    Fields
                </Text>
                <Popover.Root>
                    <Popover.Trigger>
                        <Button variant="soft">{fields.join(", ")}...</Button>
                    </Popover.Trigger>
                    <Popover.Content >
                        <Grid>
                            <DataList.Root>
                                {fields.map((field:string) => (
                                    <DataList.Item key={field}>
                                        {field}
                                    </DataList.Item>
                                ))}
                            </DataList.Root>
                        </Grid>
                    </Popover.Content>
                </Popover.Root> 
            </Card>
        }) 
        
        await screen1.card({
            preparing: spinner("Setting up HTML..."),
            prepare: mock({src:"https://custom-screen-set.deno.dev/screens/Custom-ProgressiveRegistration"}),
            done: ({src}) => <Card size="3"  style={{height:"300px"}}>
                <iframe src={src} height={"100%"}   width={"100%"}/>
            </Card>
        })
        screen1.stream.done();
        screens.stream.done();
         cards.stream.done();
 
    })().then(r =>console.log("done add screen set")).catch(e => console.error("error add screen set", e));
 
    return {
        id: nanoid(),
        display: ui.value
    };
}