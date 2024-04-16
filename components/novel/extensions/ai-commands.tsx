import {continueWithAi} from "@/components/novel/extensions/suggestions";
import {useEditor} from "novel";
import {options} from "@/components/novel/generative/ai-selector-commands";
import {Button} from "@/components/novel/ui/button";
import {getPrevText} from "@/components/novel/utils/utils";
import {StepForward} from "lucide-react";
import React, {Fragment, useState} from "react";
import Magic from "@/components/novel/ui/icons/magic";
 import * as Popover from '@radix-ui/react-popover'
import {Editor} from "@tiptap/core";
import {
    CommandSeparator,
    Command,
    CommandGroup,
    CommandInput, 
    CommandList,
    CommandDialog
} from "@/components/novel/ui/command";
import {CommandItem} from "cmdk";

const suggestionItems = [
    continueWithAi
]

function complete(value: string, param2: { body: { option: string } }) {
    console.log('complete', value, param2)

}

interface AISelectorCommandsProps {
    onSelect: (value: string, option: string) => void;
}

 
export function AICommands(onSelect : (text: any, value: string)=>void = ((text, value) => {})) {

    const [open, onOpenChange] = useState(false);
    const {editor} = useEditor() as { editor: Editor };
    // Toggle the menu when ⌘K is pressed
    React.useEffect(() => {
        const down = (e: { key: string; metaKey: any; ctrlKey: any; preventDefault: () => void; }) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onOpenChange((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])
    return <>

        <Button
            className="gap-1 rounded-none text-purple-500"
            variant="ghost"
            onClick={() => onOpenChange(true)}
            size="sm"
        >
            <Magic className="h-5 w-5"/>
            Edit 
        </Button>

        <CommandDialog open={open} onOpenChange={onOpenChange} defaultOpen={true} modal={false} >
            <Command   >
                <CommandInput placeholder={"Ask AI"}/>
                <CommandList>
                    <>
                        <CommandGroup heading="Edit or review selection">
                            {options.map((option) => (
                                <CommandItem
                                    onSelect={(value) => {
                                        const slice = editor.state.selection.content();
                                        const text = editor.storage.markdown.serializer.serialize(
                                            slice.content,
                                        );
                                        onSelect(text, option.value);
                                    }}
                                    className="flex gap-2 px-4"
                                    key={option.value}
                                    value={option.value}
                                >
                                    <option.icon className="h-4 w-4 text-purple-500"/>
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator/>
                        <CommandGroup heading="Use AI to do more">
                            <CommandItem
                                onClick={() => {
                                    const text = getPrevText(editor, {chars: 5000});
                                    onSelect(text, "continue");
                                }}
                                value="continue"
                                className="gap-2 px-4"
                            >
                                <StepForward className="h-4 w-4 text-purple-500"/>
                                Continue writing
                            </CommandItem>
                        </CommandGroup>
                    </>
                </CommandList>
            </Command>
        </CommandDialog>


    </>;
}
 

function setOpen(arg0: (open: any) => boolean) {
    throw new Error("Function not implemented.");
}
