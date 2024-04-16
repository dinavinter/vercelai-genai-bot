"use client";
import React, { useEffect, useState } from "react";
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { defaultExtensions } from "./extensions";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { ColorSelector } from "./selectors/color-selector";

import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { uploadFn } from "./image-upload";
import { Separator } from "../ui/separator";
import HtmlComponent from './extensions/html-component'
import type {Placement} from "@popperjs/core/lib/enums";
// import GenerativeMenuSwitch from "./generative/generative-menu-switch";

const extensions = [...defaultExtensions, slashCommand, HtmlComponent];

interface EditorProp {
  initialValue?: JSONContent;
  onChange: (value: JSONContent) => void;
}
 
const Editor = ({ initialValue, onChange }: EditorProp) => {
  const [openNode, setOpenNode] = useState(false);
    const [openColor, setOpenColor] = useState(false);
    const [openLink, setOpenLink] = useState(false);
    const [openAI, setOpenAI] = useState(false);
    
    const css = `
    .prose {
      line-height: 1.6;
    }
      ProseMirror-selectednode {
        background-color: #f0f0f0;
      }
      node-screen {
        display: block;
        padding: 8px;
        border: 1px solid #f0f0f0;
        margin: 8px 0;
        box-shadow: 70px black;
      }`

    return (
    <EditorRoot>
       <style>{css}</style>
      <EditorContent
        className="border p-4 rounded-xl"
        {...(initialValue && { initialContent: initialValue })}
        extensions={extensions}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full `,
          },
          handleClickOn(editor, pos, node, nodePos,event, direct) {
              console.log("handleClickOn", node)
         
            }
        }}
    
        onUpdate={({ editor }) => {
          onChange(editor.getJSON());

        }}
        slotAfter={<ImageResizer />}
        injectCSS={true}
        autofocus={"start"}
        enableCoreExtensions={true}
        onSelectionUpdate={(selection) => {console.log("onSelectionUpdate", selection)}}
        onTransaction={(transaction) => {console.log("onTransaction", transaction)}}
      >
          
        <EditorCommand   style={{position:"sticky"}} >
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
 
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                key={item.title}
                forceMount={true}
                
                 
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}

             
          </EditorCommandList>
            
        </EditorCommand>

        <EditorBubble
          tippyOptions={{
            placement: "top",
            sticky:  "reference",
              popperOptions: {
                  placement:  "top", 
              },
              followCursor: "horizontal",
              showOnCreate: true,
              hideOnClick: false,
              inlinePositioning: false,
              appendTo: document.body,
              zIndex: 1,
              animateFill: true,
               
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
          pluginKey={""}>
          <Separator orientation="vertical" />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
           <Separator orientation="vertical" />
          <TextButtons />
         </EditorBubble>
          {/*<GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>*/}
          {/*    <Separator orientation="vertical" />*/}
          {/*    <NodeSelector open={openNode} onOpenChange={setOpenNode} />*/}
          {/*    <Separator orientation="vertical" />*/}
          
          {/*    <LinkSelector open={openLink} onOpenChange={setOpenLink} />*/}
          {/*    <Separator orientation="vertical" />*/}
          {/*    <TextButtons />*/}
          {/*    <Separator orientation="vertical" />*/}
          {/*    <ColorSelector open={openColor} onOpenChange={setOpenColor} />*/}
          {/*</GenerativeMenuSwitch>*/}
      </EditorContent>
    </EditorRoot>
  );
};

export default Editor;
