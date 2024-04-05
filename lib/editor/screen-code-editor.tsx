'use client'
import {useAIState} from "ai/rsc";
import React from "react";
import {AI} from "@/lib/chat/actions";
import WebEditor from "@/lib/editor/web-editor";
 
export type CodeEditorProps = {
    html: string,
    css: string,
    js: string
}




export function ScreenCodeEditor ( {id}:{id:string} ) {
    const [{artifacts}, updateState] = useAIState<typeof AI>();
    const update = (changeset:( current:Partial<CodeEditorProps>)=>CodeEditorProps) => {
        updateState(({artifacts, ...aiState}) => (
            {
                ...aiState,
                artifacts: {
                    ...artifacts,
                    [id]: changeset(artifacts[id] || {})
                }
            })
        )
    }
    return   <WebEditor
            onChange={update}
            data={artifacts[id]} 
        />
}