import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  render,
  createStreamableValue
} from 'ai/rsc'
import OpenAI from 'openai'

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock,
  Purchase
} from '@/components/stocks'

import { z } from 'zod'
import { EventsSkeleton } from '@/components/stocks/events-skeleton'
import { Events } from '@/components/stocks/events'
import { StocksSkeleton } from '@/components/stocks/stocks-skeleton'
import { Stocks } from '@/components/stocks/stocks'
import { StockSkeleton } from '@/components/stocks/stock-skeleton'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat } from '@/lib/types'
import { auth } from '@/auth'
import { ReactNode } from 'react'
import {machine, ScreenSetGenMachine} from "@/lib/chat/screen-set-gen";
import {createActor, SnapshotFrom} from "xstate";
import {submitUserMessageScreenSet} from "@/lib/chat/screen-set-service";
import {submitUserMessage} from "@/lib/chat/screen-set";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

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

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[],
  snapshot?:SnapshotFrom<ScreenSetGenMachine>
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage:submitUserMessage,
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
// export {AI} from './screen-set'
export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function' ? (
          message.name === 'listStocks' ? (
            <BotCard>
              <Stocks props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showStockPrice' ? (
            <BotCard>
              <Stock props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showStockPurchase' ? (
            <BotCard>
              <Purchase props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'getEvents' ? (
            <BotCard>
              <Events props={JSON.parse(message.content)} />
            </BotCard>
          ) : null
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
