import {CodeOptions} from "@tiptap/extension-code";
import {Mark} from "@tiptap/react";
import {mergeAttributes} from "@tiptap/core";

export const cssInputRegex = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))$/
export const cssPasteRegex = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))/g

export interface StyleOptions extends CodeOptions {
}

declare module '@tiptap/core' {

    interface Commands<ReturnType> {
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

export const StyleNode = Mark.create<StyleOptions>({
    name: 'style',
    code: true,
    excludes: '_',
    // defining: true,
    // inclusive: true, 
    // exitable: true,
    // selectable: true,
    // dragable: true,
    // isolating: true,    
    parseHTML() {
        console.log('StyleNode.parseHTML', this);
        return [
            {
                tag: 'style',
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

    renderHTML({mark, HTMLAttributes}) {
        console.log("renderHTML.renderHTML", mark, HTMLAttributes);
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]

    },


    addCommands() {
        return {
            setStyle: () => ({commands}) => {
                return commands.setMark(this.name)
            },
            toggleStyle: () => ({commands}) => {
                return commands.toggleMark(this.name)
            },
            unsetStyle: () => ({commands}) => {
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
        return {}
    },
})