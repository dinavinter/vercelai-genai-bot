'use server'
import 'server-only'
import {createAI} from 'ai/rsc'
import OpenAI from 'openai'

import {BotCard, BotMessage} from '@/components/stocks'
import {Events} from '@/components/stocks/events'
import {Stocks} from '@/components/stocks/stocks'
import {nanoid} from '@/lib/utils'
import {UserMessage} from '@/components/stocks/message'
import {Chat} from '@/lib/types'
import * as React from 'react'
import {submitUserMessage} from "@/lib/chat/screen-set";
import {Examples} from "@/components/examples";
import {screenArtifactExample} from "@/lib/chat/screen-artifact-example";


// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || ''
// })



export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[],
  artifacts: {
    [key:string]:{
    html: string
    css: string
    js: string 
  }}
}

export type UIState = {
  artifacts:{
    [key:string]: {
    id: string
    display: React.ReactNode
  }}
  ,messages: {
  id: string
  display: React.ReactNode
}[]
}
export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage:submitUserMessage,
    
  },
  
  initialUIState: {
    artifacts: {
        'responsive-registration': {
            id: 'responsive-registration',
            display:  <div>responsive-registration</div>
        }
    },
    messages: [{
    id: nanoid(),
    display: <Examples />
  }]},
  initialAIState: { 
      chatId: nanoid(),
      messages: [ ] , 
      artifacts: {
      'responsive-registration': screenArtifactExample
    }}
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
