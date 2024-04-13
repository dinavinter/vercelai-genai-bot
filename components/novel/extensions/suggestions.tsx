import {SuggestionItem} from "novel/dist/extensions";
import {IconPlus} from "@/components/ui/icons";
import {SelectorItem} from "@/components/novel/selectors/node-selector";
import {Code} from "lucide-react";

export const add: SuggestionItem = {
    title: "Screen",
    description: "Add screen.",
    searchTerms: ["screen", "add", "new", "step"],
    icon: <IconPlus size={18}/>,
    command: ({editor, range}) => {
        editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent({
                type: "screen",
                attrs: {id: "example-screen"},
                content: [
                    {
                        type: "text",
                        text: `<div id="example-screen"  data-width="auto"  data-caption="Update delivery details" class="gigya-screen v2 portrait">
              <form class="gigya-complete-registration-form" id="example-screen">
                 <!-- Here goes the input fields -->
                       <input type="text" name="address" class="gigya-input-text" placeholder="Address" required="required">
                       <input type="checkbox" name="communication.delivery_email" class="gigya-input-checkbox" value="email" checked="checked"> Send me delivery updates</input>
                       <input type="submit" value="Click here to order!" class="gigya-input-submit" />
               </form>
        </div>`,
                    },
                ],
            }) 
            .run()


    },
};


export const previewSuggestion: SuggestionItem = {
    title: "Preview",
    description: "Preview screen.",
    searchTerms: ["preview", "screen"],
    icon: <IconPlus size={18}/>,
    command: ({editor, range}) => {
        editor
            .chain()
            .focus()
            .insertContentAt(range, {
                type: "code",
                attrs: {language: "html"},
                content: [
                    {
                        type: "text",
                        text: `<pre>yo yo yo</pre>`
                    }
                ]
            })


    }
}

export const suggestions = {
    preview: previewSuggestion
}
 
export const selectors: SelectorItem[] =[ 
    {
        name: "Preview",
        icon: Code,
        command: (editor) =>
            editor.chain().focus().insertContent("preview").run(),
        isActive: (editor) => editor.isActive("screen"),
    
}]
    