import 'server-only'

import {createStreamableUI, createStreamableValue} from "ai/rsc";
import React, {ReactNode} from "react";
import {BotCard, BotMessage, SpinnerMessage} from "@/components/stocks/message";
import {getMutableAIState} from "ai/rsc";
import {nanoid} from "@/lib/utils";
import {
    Flex,
    TextField,
    Text,
    Card,
    Popover,
    Button,
    Grid,
    DataList,
    Skeleton,
    Box
} from "@radix-ui/themes";
import {AI} from "@/lib/chat/actions";
import {type Fields} from "@/lib/screen";
import {CodeBlock} from "@/components/ui/codeblock";

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
    return <DataList.Item key={id}>
        <Text as="span" size="2" mb="1" weight="bold">
            {title}
        </Text>
        <Card size="1">
            {cards.stream.value}
        </Card>
    </DataList.Item>;
}


const spinner =(message:string)=> <Card size="1"><BotCard>{message} <SpinnerMessage  /><Skeleton /></BotCard></Card>
function mock <T>(data:T, timeout:number=4000) {
    return ()=> new Promise<T>((resolve) => setTimeout(() => resolve(data), timeout));
}
 

async function screenCollection(cards: CardsCollection):Promise<CardsCollection> {
    const {data: {screens}} = await cards.card({
        preparing: spinner("Getting screens..."),
        prepare: mock({screens: cardsCollection(createStreamableUI())}),
        done: ({screens}) => <Card>
            <Text as="span" size="3" mb="1" weight="bold">
                Screens
            </Text>
            <DataList.Root>
                {screens.stream.value}
            </DataList.Root>
        </Card>
    }) 
    return screens;
}

async function addScreen(screens: CardsCollection) {
    const {data: {cards: screen1}} = await screens.card({
        preparing: spinner("Getting screen..."),
        prepare: mock({id: "register-screen", title: "Register", cards: cardsCollection(createStreamableUI())}),
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
    const textStream = createStreamableValue('generating...');
    const ui = createStreamableUI(<SpinnerMessage/>);
    const streamChat= createStreamableUI(<Box flexGrow={{ initial: "0", lg: "1" }} >
        <BotMessage content={textStream.value} />
    </Box>)
    const streamCards= createStreamableUI()
    streamCards.done(<Box flexGrow={{ initial: "0", lg: "3" }} >
        <Flex direction="row" gap="1" overflow={"scroll"}>
        {cards.stream.value}
        </Flex>
    </Box>)
    

    ui.done(
        <Flex direction="row" gap="1" overflow={"scroll"}>
            {streamCards.value}
            {streamChat.value}
        </Flex>);

     // We need to wrap this in an async IIFE to avoid blocking. Without it, the UI wouldn't render
    // while the fetch or LLM call are in progress.
    (async () => {

        // textStream.update("Setting up Info...");
        await cards.card({
            preparing: spinner("Setting up Info..."),
            prepare: mock({name: "Registration Flow", industry: "E-Commerce", description: content}),
            done: ({name, industry, description}) => <Card size="1">
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

        // textStream.update("Getting screens...");

        const screens = await screenCollection(cards); 
        const screen1 = await addScreen(screens); 
        await screen1.card({
            preparing: spinner("Setting up Meta Data..."),
            prepare: mock({name: "register-screen", type: "Registration"}),
            done: ({name, type}) => <Card size="1">
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
            prepare: mock({theme: "dark", layout: "vertical"}),
            done: ({theme, layout}) => <Card size="1">
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
            done: ({fields}) => <Card size="3">
                <Text as="div" size="3" mb="1" weight="bold">
                    Fields
                </Text>
                
                <CodeBlock language={"json"} value={JSON.stringify(fields)}/>

            </Card>
        }) 
        await screen1.card({
            preparing: spinner("Setting up HTML..."),
            prepare: mock({src: "https://custom-screen-set.deno.dev/screens/Custom-ProgressiveRegistration"}),
            done: ({src}) => <Card size="3" style={{height: "300px"}}>
                <iframe src={src} height={"100%"} width={"100%"}/>
            </Card>
        }) 
        screen1.stream.done();
        screens.stream.done();
        cards.stream.done();

    })().then(r => console.log("done add screen set")).catch(e => console.error("error add screen set", e));

    return {
        id: nanoid(),
        display: ui.value
    };
}