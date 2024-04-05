'use client'
import React from "react";
import {useAIState} from "ai/rsc";
import {AI} from "@/lib/chat/actions";

export type HTMLPreviewProps = {
    html: string,
    css: string,
    js: string
}

export function ScreenSetPreview({id}:{id:string}){
    const [{artifacts}] = useAIState<typeof AI>();
    console.log(artifacts);
    return <Preview {...artifacts[id]} />
}
export function Preview({html, css, js}:HTMLPreviewProps) {
    const srcDoc = `
        <body>${html}</body>
        <style>${css}</style>
        <script>${js}</script>
    `;
    return <iframe
        title="output"
        srcDoc={srcDoc}
        width="100%"
        height="100%"
    />
}