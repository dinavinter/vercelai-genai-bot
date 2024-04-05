import { Editor } from "@monaco-editor/react";
import style from "./editor.module.css";
import { useState } from "react";

   type HTMLPreviewProps = {
    html?: string,
    css?: string,
    js?: string
}

export type WebEditorProps = {
    onChange: (values: any) => any;
    data: HTMLPreviewProps
};
export default function WebEditor({ onChange, data }:WebEditorProps) {
    const { html, css, js } = data || { html: "", css: "", js: "" }
    const srcDoc = `
        <body>${html}</body>
        <style>${css}</style>
        <script>${js}</script>
    `;

    const handleEditorDidMount = (value: any, event: any) => {
        fileName === "index.html"
            ? onChange((values: HTMLPreviewProps)=>{
                return {...values,html:value}
            })
            : fileName === "style.css"
                ? onChange((values:HTMLPreviewProps)=>{
                    return {...values,css:value}
                })
                : onChange((values:HTMLPreviewProps)=>{
                    return {...values,js:value}
                })
    };

    const files = {
        "script.js": {
            name: "script.js",
            language: "javascript",
            value: data?.js,
        },
        "style.css": {
            name: "style.css",
            language: "css",
            value: data?.css,
        },
        "index.html": {
            name: "index.html",
            language: "html",
            value: data?.html,
        },
    };
    console.log(files);
    const [fileName, setFileName] = useState("index.html" as keyof typeof files);
    const file = files[fileName];

    return (
        <div>
            <div className={style.btnWrapper}>
                {Object.keys(files).map((key) => {
                    return (
                        <button
                            key={key}
                            disabled={fileName === key}
                            onClick={() => setFileName(key as keyof typeof files)}
                            className={style.btn}
                        >
                            {key}
                        </button>
                    );
                })}
                            </div>
            <div className={style.editor}>
                <Editor
                    width="100%"
                    height="100%"
                    theme="vs-dark"
                    onChange={handleEditorDidMount}
                    path={file.name}
                    defaultValue={file.value}
                    defaultLanguage={file.language}
                    options={{
                        fontSize: 18,
                        minimap: {
                            enabled: false,
                            
                        },
                        
                        formatOnPaste: true,
                        formatOnType: true,
                        autoIndent: "brackets",
                        autoClosingBrackets: "always",
                        autoClosingQuotes: "languageDefined",
                        selectOnLineNumbers: true,
                        roundedSelection: false,
                        cursorStyle: 'line',
                        automaticLayout: true,
                        wordWrap: "on",
                        scrollbar: {
                            vertical: "auto",
                            horizontal: "auto",
                        },
                        selectionClipboard: true,
                        quickSuggestions: {
                            other: true,
                            comments: false,
                            strings: false,
                        },
                        
                    }}
                />
            </div>
        </div>
    );
}