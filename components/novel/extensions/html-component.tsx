import {
    Mark,
    markInputRule,
    markPasteRule,
    NodeViewContent,
    NodeViewRendererProps,
    NodeViewWrapper
} from '@tiptap/react'
import React, {useState} from 'react'
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import {ScreenCodeEditor} from "@/lib/editor/screen-code-editor";
import WebEditor, {WebEditorProps} from "@/lib/editor/web-editor";
import {Editor} from "@monaco-editor/react";
import style from "@/lib/editor/editor.module.css";
import CodeBlock, { CodeBlockOptions } from '@tiptap/extension-code-block'
import Code ,{CodeOptions} from "@tiptap/extension-code";
import Text  from '@tiptap/extension-text'
import {BotCard} from "@/components/stocks";
import {Box, Card, Flex, Grid} from "@radix-ui/themes";
import {Highlighter} from "lucide-react";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {MessageCodeBlock} from "@/components/messages/message-codeblock";
import {
    coy,
    oneDark,
    oneLight,
    shadesOfPurple,
    tomorrow,
    twilight,
    vs
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import {MessageCodeFrame} from "@/components/messages/message-codeframe";
import {Preview} from "@/lib/editor/preview";

const css=`.gigya-screen-set {
                                font-family: Arial, sans-serif;
                                color: #333;
                            }
                            
                        .gigya-input-text, .gigya-input-password {
                            width: 100%;
                            padding: 10px;
                            margin: 8px 0;
                            display: inline-block;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            box-sizing: border-box;
                        }
                        
                        .gigya-input-submit {
                            width: 100%;
                            background-color: #6C63FF;
                            /* Purple theme */
                            color: white;
                            padding: 14px 20px;
                            margin: 8px 0;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                        
                        .gigya-input-submit:hover {
                            background-color: #5a52e0;
                            /* Darker shade for hover */
                        }
                        
                        .input {
                            margin-bottom: 10px;
                        }`
const  EditorHTML =({node,editor}:NodeViewRendererProps) => {
      //style={coy} 
        return ( <NodeViewWrapper  className="react-component-with-content" >
            <Flex direction={"row"} className="overlay" gridColumn={"0"}   >
                <Card size={"2"} m={"6"}  style={{
                    transformStyle: 'preserve-3d',
                    width: '50%',
                    objectFit: 'contain',
                    objectPosition: 'center',

                }} >
                     <MessageCodeFrame  language={"html"} className={'language-html'}   >
                        {node.textContent}
                    </MessageCodeFrame>
                </Card>
                  <Box  ml={"-15%"} mt={"2%"} p={"2%"} style={{
                      zIndex:2,
                      backdropFilter: 'blur(1.5px)',
                  }}  >
                      <Preview   html={node.textContent} css={css} />

                  </Box>
            </Flex>
    </NodeViewWrapper>  )

   /*
    <NodeViewWrapper className="react-component-with-content" >
   
            <div className={style.editor}>
             <Editor
                    onChange={update}
                    value={node.editor.getHTML()}
                    height={"100%"}
                    width={"100%"}
                    language={"html"}
                    {...node.node.attrs}
                />
            </div>
            {node.editor.getHTML()}
            <ScreenCodeEditor  id={"responsive-registration"}/>
            <NodeViewContent className="content"  />
        </NodeViewWrapper>
    */
    
}


export interface HtmlNodeOptions extends CodeBlockOptions {
    name: string
}
export const ScreenNode= Node.create<HtmlNodeOptions>({
    name: 'screen',
    content: 'text*',
    group: 'block', 
    onUpdate: ():void => {
        console.log('onUpdate', this);
    },

    addAttributes() {
        return {
           language:"html",
            lang:"html",
            'data-language': "html",
           class: 'language-html',
        }
    },
    renderHTML({ node, HTMLAttributes }) {
        return [
            'pre',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: 'language-html',
            }), 
            0
        ]
    },


    parseHTML( ) {
        return [
            {
                tag: 'code',
                style: 'display: block',
                contentElement: 'code',
                preserveWhitespace: 'full',
                
            },
        ]
    },
    addNodeView() {
        return ReactNodeViewRenderer(EditorHTML )
    },

    addCommands() {
        return {
            setScreen: attributes => ({ commands }) => {
                return commands.setNode(this.name, attributes)
            }, 
            toggleScreen: attributes => ({ commands }) => {
                return commands.toggleNode(this.name, 'paragraph', attributes)
            },
          
        }
    }
})

declare module '@tiptap/core' {

    interface Commands<ReturnType> {
        html: {
            setScreen: (attributes:any) => ReturnType,
            toggleScreen: (attributes:any) => ReturnType,
            
            
            /**
             * Set a code mark
             */
            setHtml: () => ReturnType,
            /**
             * Toggle inline code
             */
            toggleHtml: () => ReturnType,
            /**
             * Unset a code mark
             */
            unsetHtml: () => ReturnType,
        }
        style: {
            /**
             * Set a code mark
             */
            setStyle: () => ReturnType,
            /**
             * Toggle inline code
             */
            toggleStyle: () => ReturnType,
            /**
             * Unset a code mark
             */
            unsetStyle: () => ReturnType,
        }
    }
}


export const inputRegex = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))$/
export const pasteRegex = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))/g
export interface HtmlOptions {
    HTMLAttributes: Record<string, any>,
}


export const HtmlNodeMark =Mark.create<HtmlOptions >({
    name: 'html',
    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    excludes: '_',

    code: true,

    exitable: true,

    parseHTML() {
        return [
            { tag: 'code' },
        ]
    },

    renderHTML({ HTMLAttributes, mark }) {
        console.log('HtmlNodeMark.renderHTML',mark.toJSON(), mark, HTMLAttributes);
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },

    addCommands() {
        return {
            setHtml: () => ({ commands }) => {
                return commands.setMark(this.name)
            },
            toggleHtml: () => ({ commands }) => {
                return commands.toggleMark(this.name)
            },
            unsetHtml: () => ({ commands }) => {
                return commands.unsetMark(this.name)
            },
        } 
    }, 

    addKeyboardShortcuts() {
        return {
            'Mod-e': () => this.editor.commands.toggleHtml(),
        }
    },

    addInputRules() {
        return [
            markInputRule({
                find: inputRegex,
                type: this.type,
            }),
        ]
    },

    addPasteRules() {
        return [
            markPasteRule({
                find: pasteRegex,
                type: this.type,
            }),
        ]
    } 
})


export const cssInputRegex = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))$/
export const cssPasteRegex = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))/g

export interface StyleOptions extends CodeOptions{
}
export const StyleNode= Mark.create<StyleOptions>({
    name: 'style',
    
    inclusive: true,
    code: true,
    excludes: '_',
    exitable: true,

    parseHTML() {
        console.log('StyleNode.parseHTML', this);
        return [
            {
                tag: 'style' ,
                preserveWhitespace: 'full',
                contentElement: 'style',
                contentAttribute: 'css',
                

            }
        ]
    },
    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },
    
    renderHTML({ mark, HTMLAttributes }) {
        console.log("renderHTML.renderHTML", mark, HTMLAttributes);
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),0]
        
    },

  
    
   
    addCommands() {
        return {
            setStyle: () => ({ commands }) => {
                return commands.setMark(this.name)
            },
            toggleStyle: () => ({ commands }) => {
                return commands.toggleMark(this.name)
            },
            unsetStyle: () => ({ commands }) => {
                return commands.unsetMark(this.name)
            },
        }
    },
    // addInputRules() {
    //     return [
    //         markInputRule({
    //             find: cssInputRegex,
    //             type: this.type,
    //         }),
    //     ]
    // },
    // addPasteRules() {
    //     return [
    //         markPasteRule({
    //             find: cssPasteRegex,
    //             type: this.type,
    //         }),
    //     ]
    // },
     

    addKeyboardShortcuts() {
        return {

        }
    }, 
})


export default ScreenNode.configure({
    
    

});