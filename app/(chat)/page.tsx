import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '../actions'
import React from "react";
import {Theme} from "@radix-ui/themes";

export const metadata = {
  title: 'Next.js AI Chatbot'
}

export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  return (
      <Theme> 
      <AI initialAIState={{ chatId: id, messages: [], artifacts:[] }}>
            <Chat  id={id} session={session} missingKeys={missingKeys} />
        </AI>
    </Theme>
  )
}
