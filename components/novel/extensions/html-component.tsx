import {NodeViewContent, NodeViewRendererProps, NodeViewWrapper, ReactNodeViewRenderer} from '@tiptap/react'
import React from 'react'
import {mergeAttributes, Node} from '@tiptap/core'
import {CodeBlockOptions} from '@tiptap/extension-code-block'
import {HTMLCodeBlock} from "@/lib/editor/code-block-card";
import {MessageCodeFrame} from "@/components/messages/message-codeframe";
import {NodeViewWrapperProps} from "@tiptap/react/src/NodeViewWrapper";

const  EditorHTML:React.FC<NodeViewRendererProps> = React.forwardRef(({node,editor, ...props}, ref) =>  {
         const source = node.textContent;
         
         return (
             
             <NodeViewWrapper className="react-component-with-content">
                 {/*<NodeViewContent className="content"  /> */}
                 <HTMLCodeBlock html={source} {...node.attrs} {...props} /> 
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
    
})


declare module '@tiptap/core' {

    interface Commands<ReturnType> {
        screen: {
            setScreen: (attributes:any) => ReturnType,
            toggleScreen: (attributes:any) => ReturnType,
         }

    }
}

export interface HtmlNodeOptions extends CodeBlockOptions {
    name: string
}
export const ScreenNode= Node.create<HtmlNodeOptions>({
    name: 'screen',
    content: 'text*',
    group: 'block list',
    // isolating: true,
    // code: true,
    // atom: true,
    // defining: true,
    inclusive: true, 
    exitable: true,
    selectable: true,
    // dragable: true,

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
        const code =()=><code>code</code>
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



export default ScreenNode.configure({
    
    

});