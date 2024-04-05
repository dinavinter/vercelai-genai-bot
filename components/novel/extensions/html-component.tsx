import {NodeViewContent, NodeViewRendererProps, NodeViewWrapper} from '@tiptap/react'
import React from 'react'
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import {ScreenCodeEditor} from "@/lib/editor/screen-code-editor";
import WebEditor, {WebEditorProps} from "@/lib/editor/web-editor";
import {Editor} from "@monaco-editor/react";
import style from "@/lib/editor/editor.module.css";




const  Component =(node:NodeViewRendererProps) => {
    function update() {

    }
    console.log(node)
    console.table(node)
    const content = node.node.content.firstChild?.text || "";
    const {id} = node.extension.config ; 
    return (
        <NodeViewWrapper className="react-component-with-content">
            <span className="label" >{id}</span>
            <div className={style.editor}>
    
                <Editor
                    onChange={update}
                    value={content}
                    height={"100%"}
                    width={"100%"}
                    language={"html"}
                    
                />
            </div>
            {/*<ScreenCodeEditor  id={"responsive-registration"}/>*/}
            {/*<NodeViewContent className="content" />*/}
        </NodeViewWrapper>
    )
}



export default Node.create({
    name: 'htmlComponent',

    group: 'block',

    content: 'inline*',
    

    parseHTML() {
        return [
            {
                tag: 'html-component',
                attrs: {
                    language: "html",
                }
            },
        ]
    },

    addKeyboardShortcuts() {
        return {
            
        }
    },

    renderHTML({ HTMLAttributes }) {
        
        return ['html-component',  mergeAttributes(HTMLAttributes), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component, {
            contentDOMElementTag: 'main',
            
        })
    },
})
