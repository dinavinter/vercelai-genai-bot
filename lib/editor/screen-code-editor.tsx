'use client'
import {useAIState} from "ai/rsc";
import React from "react";
import {AI} from "@/lib/chat/actions";
import WebEditor from "@/lib/editor/web-editor";
import  Novel from "@/components/novel/advanced-editor";
import type {JSONContent} from "novel";

export type CodeEditorProps = {
    html: string,
    css: string,
    js: string
}


export function ScreenNovelEditor ( {id}:{id:string} ) {
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

    function onChange(content:JSONContent) {
        update((current) => ({
            ...current,
            html: content.html,
            css: content.css,
            js: content.js
        }))
        
    }
     

    return   <Novel
        onChange={onChange}
        initialValue={{
            type: "doc",
            content: Object.entries(artifacts).map(([id, {html, css, js}]) => { 
                return {
                    type: "htmlComponent",
                    attrs: {id},
                    content: [ 
                        {
                            type: "text",
                            text: html 
                        } 
                        
                    ]
                }
            })
        }}
    />
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