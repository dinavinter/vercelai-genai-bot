import React, {FC, memo} from "react"
import {Prism as SyntaxHighlighter, SyntaxHighlighterProps} from "react-syntax-highlighter"
import {coy} from "react-syntax-highlighter/dist/cjs/styles/prism"


type MessageCodeBlockProps  =  SyntaxHighlighterProps 

const StyledPre = ({style, ...props}:React.HTMLProps<HTMLPreElement>) => 
    <pre {...props} style={{
    ...style,
    maxHeight: '30rem',
    width: "100%" ,
    margin: 0 ,
    fontSize: "14px",
    fontFamily: "var(--font-mono)",
    textOverflow:"ellipsis" ,
}} />;

const StyledCode = ({style, ...props}:React.HTMLProps<HTMLElement>) => <code  {...props} style={{ ...style}} />;
 
export const MessageCodeFrame: FC<MessageCodeBlockProps> = memo(
  React.forwardRef(({ language, children, ...props }, ref) => {
     
      return ( 
          <SyntaxHighlighter
              
            CodeTag={StyledCode}
            language={language}
            style={coy}
            PreTag={StyledPre} 
             // wrapLines={true} 
             {...props}
          >
            {children}
          </SyntaxHighlighter>
     )
  }
))

MessageCodeFrame.displayName = "MessageCodeFrame"
