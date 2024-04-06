import {
  BanIcon,
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
} from "lucide-react";
import { createSuggestionItems } from "novel/extensions";
import { Command, renderItems } from "novel/extensions";
import { uploadFn } from "./image-upload";
import {IconPlus} from "@/components/ui/icons";

export const suggestionItems = createSuggestionItems([
  {
    title: "Send Feedback",
    description: "Let us know how we can improve.",
    icon: <MessageSquarePlus size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      window.open("/feedback", "_blank");
    },
  },
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run();
    },
  },
  {
    title: "Screen",
    description: "Add screen.",
    searchTerms: ["screen", "add", "new","step"],
    icon: <IconPlus size={18} />,
    command: ({ editor, range }) => {

      // editor.
      //     chain()
      //       .focus()
      //       .deleteRange(range)
      //       .splitBlock()
      //     .run();
      
      editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent( { 
                type: "screen",
                attrs: { id: "example-screen" },
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
              } )
           
          .run()


      // editor
      //     .chain()
      //     .focus()
      //     .deleteRange(range)
      //     .splitBlock()
      //     .toggleNode("screen", {
      //       id: "example-screen",
      //      
      //       children: `<div id="example-screen"  data-width="auto"  data-caption="'Update Your Profile'" class="gigya-screen v2 portrait">
      //           <form class="gigya-complete-registration-form" id="example-screen">
      //               <!-- Here goes the input fields -->
      //                   <input type="text" name="address" class="gigya-input-text" placeholder="Address" required="required">
      //                   <input type="submit" value="Complete Registration" class="gigya-input-submit">
      //           </form>
      //       </div>`
      //     }).setContent("example-screen")
      //       .run();
    },
  } ,
   
  {
    title: "Field Set",
    description: "Add field set.",
    searchTerms: ["field"],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Field",
    description: "Add a field.",
    searchTerms: ["ordered"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Import Screen",
    description: "Import screen.",
    searchTerms: ["import"],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run(),
  },
   
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // upload image
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          uploadFn(file, editor.view, pos);
        }
      };
      input.click();
    },
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
