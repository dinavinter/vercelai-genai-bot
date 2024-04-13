'use client'

import {useAIState} from "ai/rsc";
import {AI} from "@/lib/chat/actions";
import type {JSONContent} from "novel";
import Novel from "@/components/novel/advanced-editor";
import React from "react";
import {CodeEditorProps} from "@/lib/editor/screen-code-editor";

export function NovelIde({id}: { id: string }) {
    const [{artifacts}, updateState] = useAIState<typeof AI>();
    const update = (changeset: (current: Partial<CodeEditorProps>) => CodeEditorProps) => {
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

    function onChange(content: JSONContent) {
        update((current) => ({
            ...current,
            html: content.html,
            css: content.css,
            js: content.js
        }))

    }

    console.log(artifacts);

    return <Novel
        onChange={onChange}
        initialValue={{
            type: "doc",
            content: Object.entries(artifacts).map(([id, {html, css, js}]) => {
                console.log('screen-novel-editor', {id, html, css, js});
                return {
                    type: "screen",
                    attrs: {html, css, js, id, lang: "html", language: "html"},
                    html, css, js, id,
                    content: [ 
                        {
                            type: "text",
                            text: html,
                            marks: [
                                {
                                    type: "html"
                                }
                            ]
                        },
                        {
                            type: "text",
                            text: css,
                            marks: [
                                {
                                    type: "style"
                                }
                            ]
                        }
                    ].filter(({text}) => text)
                }
            })
        }}

    />
}