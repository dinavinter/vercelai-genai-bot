
import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
 import React from "react";
import {Flex, Theme} from "@radix-ui/themes";
import {ChatPageProps} from "@/app/(chat)/chat/[id]/page";
import {ScreenCodeEditor} from "@/lib/editor/screen-code-editor";
import {Preview, ScreenSetPreview} from "@/lib/editor/preview";
 
 


export default async function IndexPage({ params:{id} }: ChatPageProps) {
    // const id = nanoid() 
    return (   <Flex>
                <ScreenCodeEditor id={id} />
                <ScreenSetPreview  id={id} />
              </Flex> 
    )
}
