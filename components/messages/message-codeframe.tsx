import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import React, {CSSProperties, FC, memo} from "react"
import {createElement, Prism as SyntaxHighlighter, SyntaxHighlighterProps} from "react-syntax-highlighter"
import {coy, oneDark} from "react-syntax-highlighter/dist/cjs/styles/prism"
import {IconCopy, IconCheck, IconDownload} from "@/components/ui/icons";
import {Card} from "@radix-ui/themes";
import {docco} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { AutoSizer, List } from 'react-virtualized';
import {ListRowRenderer} from "react-virtualized/dist/es/List";
  

function logNode(node: rendererNode, index: number, key: string, style: React.CSSProperties) {
    if (node.children?.flatMap(n => n.properties?.className).includes("attr-name")) {
        console.log(`add new row ${node.properties?.className}`, {
            attrI: node.children?.indexOf(node.children?.filter(n => n.properties?.className?.includes("attr-name"))[0]),
            index,
            key,
            style,
            attr: node.children?.filter(n => n.properties?.className?.includes("attr-name")),
            children: node.children?.length,
            node

        });
    }
}

function rowRenderer({ rows, stylesheet, useInlineStyles }: rendererProps):ListRowRenderer {
  return ({ index, key, style }) => {
      const node=rows[index];
      // logNode(node, index, key, style);

      const attributes= node.children?.filter(n=>n.properties?.className?.includes("attr-name")).map(n=>{
          const index=node.children?.indexOf(n)!;
          const sliced=node.children!.slice(index +1);
          const until=sliced.findIndex(n=>!n.properties?.className?.includes("attr-value")  );
           const nodes = [n, ...sliced?.slice(0,  until)] ;
           const name= n.children?.[0].value;
           const   value= nodes.map(n=>n.children?.[0].value).join(''); 
          const priority=   name === "class" ? 99 : name === "id" ? 2 :  name === "name" ? 0 :value.length;
           return {
              priority,
              value: nodes.map(n=>n.children?.[0].value).join(''), 
              name: name, 
              nodes: nodes
          } 
      }) || []; 
      //move calls attributes to the end
      const sorted= attributes.sort((a,b)=>    a.priority - b.priority);
      sorted.slice( 2).concat(sorted.filter(p=>p.value.length > 40))
        //   .forEach(attr=>{  
        //    node.children = removeItem(node.children!, attr.nodes)
        // })
    
      function removeItem<T>(arr: Array<T>, value: T[]): Array<T> {
          const index = arr.indexOf(value[0]);
          
          if (index > -1) {
              arr.splice(index, value.length   );
          }
          return arr;
      }

      style = attributes.map(a=>a.value).join().length > 40 ? {...style, filter:"", overflow:"hidden", textOverflow:"ellipsis" , maxWidth:"100%" , maxHeight:"100%"} : style;

      return createElement({
      node: node,
      stylesheet,
      style,
      useInlineStyles,
      key,
    });
  }
}

export default function virtualizedRenderer({ overscanRowCount = 0, rowHeight = 30 } = {}): (props: rendererProps) => React.ReactNode {
  return ({ rows, stylesheet, useInlineStyles }) => (
      <div style={{ height: '30rem' , width:"100%"}}>
          
        <AutoSizer   >
          {({  height, width }) => (
              <List
                  height={height}
                  width={width}
                  rowHeight={rowHeight}
                  rowRenderer={rowRenderer({ rows, stylesheet, useInlineStyles })}
                  rowCount={rows.length}
                  overscanRowCount={overscanRowCount}
              />
          )}
        </AutoSizer>
      </div>
  );
}
type MessageCodeBlockProps  =  SyntaxHighlighterProps 

interface languageMap {
  [key: string]: string | undefined
}

export const programmingLanguages: languageMap = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css",
  text: "text"
}

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXY3456789" // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return lowercase ? result.toLowerCase() : result
}

export const MessageCodeFrame: FC<MessageCodeBlockProps> = memo(
  React.forwardRef(({ language, children, ...props }, ref) => {
   
      const CustomPre = ({style, ...props}:React.HTMLProps<HTMLPreElement>) => <pre {...props} style={{ 
          ...style,
          maxHeight: '30rem',
          width: "100%" ,
          margin: 0 ,               
          fontSize: "14px",
          fontFamily: "var(--font-mono)",
          textOverflow:"ellipsis" ,
      }} />;
      const CustomCode = ({style, ...props}:React.HTMLProps<HTMLElement>) => <code {...props} style={{ ...style}} />;


      return (
      
             
          <SyntaxHighlighter
              CodeTag={CustomCode}
            language={language}
            style={coy}
            PreTag={CustomPre} 
             // wrapLines={true} 
             {...props}
          >
            {children}
          </SyntaxHighlighter>
     )
  }
))

MessageCodeFrame.displayName = "MessageCodeFrame"
