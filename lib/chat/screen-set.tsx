import 'server-only'

import {createStreamableUI, createStreamableValue, getMutableAIState} from "ai/rsc";
import React, {ReactNode} from "react";
import {BotCard, BotMessage, SpinnerMessage} from "@/components/stocks/message";
import {nanoid, runAsyncFnWithoutBlocking} from "@/lib/utils";
import {
    Box,
    
    Card,
    Code,
    Container,
    DataList,
    Flex,
    Inset,
    Skeleton,
    Text,
    TextField,
    Theme
} from "@radix-ui/themes";
import {AI} from "@/lib/chat/actions";
import {type Fields} from "@/lib/screen";
import {CodeBlock} from "@/components/ui/codeblock";
import {FieldsCard} from './fields';
import Textarea from "react-textarea-autosize";
import {LayoutButton, LayoutToggleIcon, ThemeButton, ThemeToggle} from "@/components/theme-toggle";
import {LayoutIcon, ViewHorizontalIcon, ViewVerticalIcon} from "@radix-ui/react-icons";
import {IconMoon} from "@/components/ui/icons";
import { Button } from '@/components/ui/button'


type AsyncReturnType<T extends (...args: any) => any> =
    T extends (...args: any) => Promise<infer U> ? U :
        T extends (...args: any) => infer U ? U :
            any


type LazyCardProps<TPrepareData extends ()=>Promise<any> =()=>Promise<any>, T =AsyncReturnType<TPrepareData> > = {
    preparing:ReactNode,
    prepare: TPrepareData & (()=>Promise<T>),
    done:React.FC<T>
}

type StreamableUI = ReturnType<typeof createStreamableUI>;

type CardsCollection = ReturnType<typeof cardsCollection>;
function cardsCollection(cardsStream:StreamableUI) {
    async function card<TCard extends LazyCardProps>(args: TCard) {
        const stream = createStreamableUI(args.preparing);
        cardsStream.append(stream.value);
        const result = await args.prepare();
        stream.done(args.done(result));
        return {
            stream,
            data: result
        }
    }


    return {
        stream: cardsStream,
        card: card
    }
}

function ScreenItem({id, title, cards}:{id:string, title:string, cards:{stream:StreamableUI}}) {
    return <Container size="3" maxWidth={"30rem"} maxHeight={"60rem"} p={"4"} > 
        <BotCard showAvatar={true} >
            <Text as="span" size="2" mb="1" weight="bold">
                {title}
            </Text>
                <Flex direction="column" gap="2" wrap={"wrap"} p={"4"}> 
                    {cards.stream.value}
                </Flex>
    </BotCard>
    </Container>;
}


const spinner =(message:string)=> <Card size="1"><BotCard>{message} <SpinnerMessage  /><Skeleton /></BotCard></Card>
function mock <T>(data:T, timeout:number=600) {
    return ()=> new Promise<T>((resolve) => setTimeout(() => resolve(data), timeout));
}
 

async function screenCollection(cards: CardsCollection):Promise<CardsCollection> {
    const {data: {screens}} = await cards.card({
        preparing: spinner("Getting screens..."),
        prepare: mock({screens: cardsCollection(createStreamableUI())}),
        done: ({screens}) => <Box gridRow={"2/4"} >
            <BotMessage content={"Screens"}></BotMessage> 
            <DataList.Root>
                <Flex direction="column" gap="1" overflow={"clip"} wrap={"wrap"}>
                    {screens.stream.value}
                </Flex>
            </DataList.Root>
        </Box>
    }) 
    return screens;
}

async function addScreen(screens: CardsCollection) {
    const {data: {cards: screen1}} = await screens.card({
        preparing: spinner("Getting screen..."),
        prepare: mock({id: "register-screen", title: "Register Screen", cards: cardsCollection(createStreamableUI())}),
        done: ScreenItem
    }) as { data: { cards: CardsCollection } }
    return screen1;
}

export async function submitUserMessage(content: string) {
    'use server'


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


    const cards = cardsCollection(createStreamableUI());
    const textStream = createStreamableValue('');
    const ui = createStreamableUI(<SpinnerMessage/>);
    const streamChat= createStreamableUI(<Box flexGrow={{ initial: "0", lg: "1" }} >
        {textStream.value? <BotMessage content={textStream.value} /> : <SpinnerMessage/>}
    </Box>)
    const streamCards= createStreamableUI()
    streamCards.done(<Flex direction="row" gap="3" wrap={"wrap"} >
          {cards.stream.value}
        </Flex>
   )

    
    ui.done(
        <Flex direction="column" gap="2" overflow={"hidden"} wrap={"wrap"}>
            {streamCards.value}
            {/*<Section>{streamChat.value}</Section>*/}
        </Flex>);

     // We need to wrap this in an async IIFE to avoid blocking. Without it, the UI wouldn't render
    // while the fetch or LLM call are in progress.
    runAsyncFnWithoutBlocking (async () => {
     
        // textStream.update("Setting up Info...");
        await cards.card({
            preparing: spinner("Setting up Info..."),
            prepare: mock({name: "custom-ecommerce-screen-set", industry: "E-Commerce", description: content}),
            done: ({name, industry, description}) =>
                <BotCard showAvatar={true}>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Info
                    </Text>
                    <Card  > 
                        <DataList.Root> 
                            <DataList.Item> 
                               <DataList.Label>Name</DataList.Label>
                                <DataList.Value contentEditable>{name}</DataList.Value> 
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Industry</DataList.Label>
                                <DataList.Value contentEditable>{industry}</DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Use Case</DataList.Label>
                                <Text as="p">
                                    {description}   
                                </Text>
                                {/*<DataList.Value contentEditable>{description}</DataList.Value> */}
                            </DataList.Item>
                       </DataList.Root>
                    </Card> 
                </BotCard>
           
        })

        textStream.update("Getting screens...");

        // const screens = await screenCollection(cards); 
        const screen1 = await addScreen(cards); 
        
        // await cards.card({
        //     preparing: spinner("Screens..."),
        //     prepare: mock({}),
        //     done: () => <BotCard  >
        //         <BotMessage content={"Screens"}></BotMessage> 
        //     </BotCard>
        // })
        await screen1.card({
            preparing: spinner("Setting screen..."),
            prepare: mock({name: "register-screen", type: "Registration"}),
            done: ({name, type}) => 
                <BotCard showAvatar={false}>
                    <Text as="div" size="2" mb="1" >  
                        <Code variant={"solid"}>id: {name}</Code> 
                    </Text>
                    <Text as="div" size="2" mb="1" >
                        <Code variant={"solid"}>type: {type}</Code>
                    </Text>
            </BotCard>
        }) 
         await screen1.card({
            preparing: spinner("Setting up UI Data..."),
            prepare: mock({theme: "dark", layout: "vertical"}),
            done: ({theme, layout}) =>  <BotCard showAvatar={false}>
                <Flex direction="row" gap="2" wrap={"wrap"} >
                <Text as="div" size="1" mb="1" >
                    <Code variant={"outline"}>them:<ThemeButton initial={theme} /></Code> 
                </Text>
                <Text as="div" size="1" mb="1" >
                    <Code variant={"outline"}>layout:<LayoutButton initial={layout} /></Code>
                </Text> 
                </Flex>
            </BotCard> 
        }) 
        await screen1.card({
            preparing: spinner("Setting up Fields..."),
            prepare: mock<{fields:Fields}>({fields: [
                    {
                        tag: "input",
                        slot: "root-field-set",
                        type: "text",
                        name: "name",
                        placeholder: "Your name",
                        autocomplete: "name",
                        "data-required": true,
                        "data-valid-checkmark": false,
                    },
                    {
                        tag: "input",
                        slot: "root-field-set",
                        type: "email",
                        name: "email",
                        placeholder: "Your email",
                        autocomplete: "email",
                        "data-required": true,
                        "data-valid-checkmark": false,
                    },
                    {
                        tag: "input",
                        slot: "root-field-set",
                        type: "password",
                        name: "password",
                        placeholder: "Your password",
                        autocomplete: "new-password",
                        "data-required": true,
                        "data-valid-checkmark": false
                    }
                ]}),
            done: ({fields}) => 
                <FieldsCard fields={fields}/> 
        })

        screen1.stream.done();
      
        await cards.card({
            preparing: spinner("Setting up HTML..."),
            prepare: mock({src: "https://custom-screen-set.deno.dev/screens/Custom-ProgressiveRegistration"}),
            done: ({src}) => <Card size="3" style={{height: "300px"}}>
                <iframe src={src} height={"100%"} width={"100%"}/>
            </Card>
        }) 
        // screen1.stream.done();
        // screens.stream.done();
        cards.stream.done();

    })

    return {
        id: nanoid(),
        display: ui.value
    };
}