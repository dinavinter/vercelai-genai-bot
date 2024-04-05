import * as React from 'react'

import {shareChat} from '@/app/actions'
import {Button} from '@/components/ui/button'
import {PromptForm} from '@/components/prompt-form'
import {ButtonScrollToBottom} from '@/components/button-scroll-to-bottom'
import {IconShare} from '@/components/ui/icons'
import {FooterText} from '@/components/footer'
import {ChatShareDialog} from '@/components/chat-share-dialog'
import {useActions, useAIState, useUIState} from 'ai/rsc'
import type {AI, AIState} from '@/lib/chat/actions'
import {Examples} from "@/components/examples";
import {ChatList} from "@/components/chat-list";
import { auth } from '@/auth'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

function shareTrigger(messages: {
  id: string;
  display: React.ReactNode
}[], id: string | undefined, title: string | undefined, setShareDialogOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void, shareDialogOpen: boolean, aiState:AIState) {
  return <>
    {messages?.length >= 2 ? (
        <div className="flex h-12 items-center justify-center">
          <div className="flex space-x-2">
            {id && title ? (
                <>
                  <Button
                      variant="outline"
                      onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2"/>
                    Share
                  </Button>
                  <ChatShareDialog
                      open={shareDialogOpen}
                      onOpenChange={setShareDialogOpen}
                      onCopy={() => setShareDialogOpen(false)}
                      shareChat={shareChat}
                      chat={{
                        id,
                        title,
                        messages: aiState.messages
                      }}
                  />
                </>
            ) : null}
          </div>
        </div>
    ) : null}
  </>;
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages] = useUIState<typeof AI>()
     
  return (
    <div
        className="fixed bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[800px]">
      <ButtonScrollToBottom
          isAtBottom={isAtBottom}
          scrollToBottom={scrollToBottom}
      />
      <ChatList messages={messages} isShared={false}    />


      <div className="mx-auto sm:max-w-2xl sm:px-4">

        {/*{shareTrigger(messages, id, title, setShareDialogOpen, shareDialogOpen, aiState)}*/}

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm input={input} setInput={setInput}/>
          <FooterText className="hidden sm:block"/>
        </div>
      </div>
    </div>
  )
}
