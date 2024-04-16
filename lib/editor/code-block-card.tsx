import {HTMLPreviewProps, Preview} from "@/lib/editor/preview";
import {Box, Card, Flex} from "@radix-ui/themes";
import {MessageCodeFrame} from "@/components/messages/message-codeframe";
import React, {FC} from "react";

const mock_css = `.gigya-screen-set {
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

export const HTMLCodeBlock:FC< HTMLPreviewProps & {
    onChange?: (value: HTMLPreviewProps) => void
}>= React.forwardRef( ({html, css, js, onChange,...props}, ref)=> {

    const onfocus=()=>{
        console.log('focused')
    }
    return <Flex direction={"row"}   gridColumn={"1"} style={{ cursor: 'pointer' }} onFocus={onfocus}>
        <style>
            
        </style>
        <Card size={"2"} m={"6"} style={{
            transformStyle: 'preserve-3d',
             width: '35%',
            objectFit: 'contain',
            objectPosition: 'center',

        }}>
            <MessageCodeFrame {...props} ref={ref} onChange={onChange} language={"html"} className={'language-html'} >
                {html || `<div ></div>`}
            </MessageCodeFrame>
        </Card>
        <Box ml={"-15%"} mt={"1%"} p={"1%"}   style={{
            zIndex: 2,
            width: '10%', 
            backdropFilter: 'blur(1.5px)', 
         }}>
            <Preview html={html} css={css || mock_css} js={js}/>
        </Box>
    </Flex>;
})