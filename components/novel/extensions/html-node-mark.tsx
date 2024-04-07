import {Mark, markInputRule, markPasteRule} from "@tiptap/react";
import {mergeAttributes} from "@tiptap/core";

export const inputRegex = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))$/
export const pasteRegex = /(?:^|\s)(`(?!\s+`)((?:[^`]+))`(?!\s+`))/g

declare module '@tiptap/core' {

    interface Commands<ReturnType> {
        html: { 
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
         
    }
}

export interface HtmlOptions {
    HTMLAttributes: Record<string, any>,
}

export const HtmlNodeMark = Mark.create<HtmlOptions>({
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
            {tag: 'code'},
        ]
    },

    renderHTML({HTMLAttributes, mark}) {
        console.log('HtmlNodeMark.renderHTML', mark.toJSON(), mark, HTMLAttributes);
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },

    addCommands() {
        return {
            setHtml: () => ({commands}) => {
                return commands.setMark(this.name)
            },
            toggleHtml: () => ({commands}) => {
                return commands.toggleMark(this.name)
            },
            unsetHtml: () => ({commands}) => {
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