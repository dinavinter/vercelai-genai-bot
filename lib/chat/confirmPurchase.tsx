import {createStreamableUI, getMutableAIState} from "ai/rsc/dist";
import {spinner, SystemMessage} from "@/components/stocks";
import {formatNumber, nanoid, runAsyncFnWithoutBlocking, sleep} from "@/lib/utils";
import * as React from "react";
import {AI} from "@/lib/chat/actions";
// async function submitUserMessage(content: string) {
//   'use server'
//
//   const aiState = getMutableAIState<typeof AI>()
//   const service =  createActor(machine,{
//     input: content,
//     snapshot: aiState.get()?.snapshot,
//     inspect: {
//       next(state:any) {
//         if (state.type === '@xstate.snapshot') {
//           aiState.update({
//             ...aiState.get(),
//             snapshot: state.getPersistedSnapshot(),
//             messages: [
//               ...aiState.get().messages,
//               {
//                 id: nanoid(),
//                 role: 'user',
//                 content
//               }
//             ]
//           }) 
//         }
//         console.log('next', state);
//
//       },
//       error(state:any) {
//         console.error('error', state);
//       }
//
//     }
//   })
//
//   aiState.update({
//     ...aiState.get(),
//     snapshot: service.getSnapshot(),
//     messages: [
//       ...aiState.get().messages,
//       {
//         id: nanoid(),
//         role: 'user',
//         content
//       }
//     ]
//   })
//
//   let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
//   let textNode: undefined | React.ReactNode
//
//  
//   const ui = render({
//     model: 'gpt-3.5-turbo',
//     provider: openai,
//     initial: <SpinnerMessage/>,
//     messages: [
//       {
//         role: 'system',
//         content: `You are a helpful AI assistant. helping gigya customers with generate custom screen sets,  use generate_screen_set tool for generating the screen, only then use  show_screen for rendering, chat with the user to get the parameters you need fot the tools  . `
//       },
//       ...aiState.get().messages.map((message: any) => ({
//         role: message.role,
//         content: message.content,
//         name: message.name
//       }))
//     ],
//  
//     text: ({content, done, delta}) => {
//       if (!textStream) {
//         textStream = createStreamableValue('')
//         textNode = <BotMessage content={textStream.value}/>
//       }
//
//       if (done) {
//         textStream.done()
//         aiState.done({
//           ...aiState.get(),
//           messages: [
//             ...aiState.get().messages,
//             {
//               id: nanoid(),
//               role: 'assistant',
//               content
//             }
//           ]
//         })
//       } else {
//         textStream.update(delta)
//       }
//
//       return textNode
//     },
//
//     functions: {
//       show_screen_set_draft: {
//         description: 'generate a custom screen set for gigya customers',
//         parameters: z.object({
//           title: z.string().describe('Suggested title of the screen set'),
//           industry: z.string().describe('The industry of the screen set'),
//           flow: z.string().describe('The flow of the screen set; for example, sign up, login, etc.'),
//          
//         }) ,
//        
//         render: async function* ({ title, industry, flow }) {
//             yield (
//                 <BotCard>
//                 <StocksSkeleton />
//                 </BotCard>
//             )
//    
//          
//    
//             await sleep(1000)
//    
//             aiState.done({
//                 ...aiState.get(),
//                 messages: [
//                 ...aiState.get().messages,
//                 {
//                     id: nanoid(),
//                     role: 'function',
//                     name: 'generate_screen_set',
//                     content: JSON.stringify({ title, industry, flow })
//                 }
//                 ]
//             })
//    
//             return (
//                 <BotCard>
//                     <p>Screen Set Generated</p>
//                 </BotCard>
//             )
//             }
//       },
//       show_screen: {
//         description:
//           'show the gigya custom screen set by using the tools. Use this if the user wants to render the screen.',
//         parameters: z.object({
//           name: z.string().describe('The generated unique name of the screen'),
//           html: z.string().describe('The HTML content of the screen'),
//           css: z.string().describe('The CSS content of the screen'),
//           js: z.string().describe('The JS content of the screen'),
//          
//         }), 
//         render: async function* ({ html,css, js,name }) {
//                  
//           yield (
//             <BotCard>
//               <StockSkeleton />
//             </BotCard>
//           )
//
//           const response = await fetch (`https://custom-screen-set.deno.dev/screens/${name}`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({html, css, js}),
//           })
//
//           await sleep(1000)
//
//           aiState.done({
//             ...aiState.get(),
//             messages: [
//               ...aiState.get().messages,
//               {
//                 id: nanoid(),
//                 role: 'function',
//                 name: 'showScreen',
//                 content: JSON.stringify({ html, css, js,name })
//               }
//             ]
//           })
//
//           return (
//               <BotCard>
//                 <iframe src={response.headers.get('LOCATION') || `https://custom-screen-set.deno.dev/screens/${name}`} />
//               </BotCard>
//
//           )
//         }
//       } 
//      }
//   })
//
//   return {
//     id: nanoid(),
//     display: ui
//   }
// }
async function confirmPurchase(symbol: string, price: number, amount: number) {
    'use server'

    const aiState = getMutableAIState<typeof AI>()

    const purchasing = createStreamableUI(
        <div className="inline-flex items-start gap-1 md:items-center">
            {spinner}
            <p className="mb-2">
                Purchasing {amount} ${symbol}...
            </p>
        </div>
    )

    const systemMessage = createStreamableUI(null)

    runAsyncFnWithoutBlocking(async () => {
        await sleep(1000)

        purchasing.update(
            <div className="inline-flex items-start gap-1 md:items-center">
                {spinner}
                <p className="mb-2">
                    Purchasing {amount} ${symbol}... working on it...
                </p>
            </div>
        )

        await sleep(1000)

        purchasing.done(
            <div>
                <p className="mb-2">
                    You have successfully purchased {amount} ${symbol}. Total cost:{' '}
                    {formatNumber(amount * price)}
                </p>
            </div>
        )

        systemMessage.done(
            <SystemMessage>
                You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
                {formatNumber(amount * price)}.
            </SystemMessage>
        )

        aiState.done({
            ...aiState.get(),
            messages: [
                ...aiState.get().messages.slice(0, -1),
                {
                    id: nanoid(),
                    role: 'function',
                    name: 'showStockPurchase',
                    content: JSON.stringify({
                        symbol,
                        price,
                        defaultAmount: amount,
                        status: 'completed'
                    })
                },
                {
                    id: nanoid(),
                    role: 'system',
                    content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
                        amount * price
                    }]`
                }
            ]
        })
    })

    return {
        purchasingUI: purchasing.value,
        newMessage: {
            id: nanoid(),
            display: systemMessage.value
        }
    }
}