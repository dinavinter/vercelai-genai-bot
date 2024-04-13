import {cn, nanoid} from '@/lib/utils'
import {Chat} from '@/components/chat'
import {AI} from '@/lib/chat/actions'
import React from "react";
import {Box, Card, Flex, Grid, Section, Theme} from "@radix-ui/themes";
import {ChatPageProps} from "@/app/(chat)/chat/[id]/page";
import {ScreenCodeEditor} from "@/lib/editor/screen-code-editor";
import {Preview, ScreenSetPreview} from "@/lib/editor/preview";
import {NovelIde} from "@/components/novel/novel-ide";


export default async function IndexPage({params: {id}}: ChatPageProps) {
    // const id = nanoid() 
    return (<Grid columns="4" gap="3" rows="2" width="auto">


            <Section gridColumn={"1"} gridColumnEnd={"5"}> 
               <ScreenCodeEditor id={id}/>
            </Section>

            <Box gridColumn={"5"} className={"modal"} >
                <ScreenSetPreview id={id} />
                {/*<iframe src={"https://custom-screen-set.deno.dev/screens/Custom-ProgressiveRegistration"} height={"100%"} width={"100%"}/>*/}
            </Box>


        </Grid>
    )
}
