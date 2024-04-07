import React from "react";
import {ListRowRenderer} from "react-virtualized/dist/es/List";
import {createElement} from "react-syntax-highlighter";
import {AutoSizer, List} from "react-virtualized";

export default function virtualizedRenderer({
                                                overscanRowCount = 0,
                                                rowHeight = 30
                                            } = {}): (props: rendererProps) => React.ReactNode {


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

    function rowRenderer({rows, stylesheet, useInlineStyles}: rendererProps): ListRowRenderer {
        return ({index, key, style}) => {
            const node = rows[index];
            // logNode(node, index, key, style);

            const attributes = node.children?.filter(n => n.properties?.className?.includes("attr-name")).map(n => {
                const index = node.children?.indexOf(n)!;
                const sliced = node.children!.slice(index + 1);
                const until = sliced.findIndex(n => !n.properties?.className?.includes("attr-value"));
                const nodes = [n, ...sliced?.slice(0, until)];
                const name = n.children?.[0].value;
                const value = nodes.map(n => n.children?.[0].value).join('');
                const priority = name === "class" ? 99 : name === "id" ? 2 : name === "name" ? 0 : value.length;
                return {
                    priority,
                    value: nodes.map(n => n.children?.[0].value).join(''),
                    name: name,
                    nodes: nodes
                }
            }) || [];
            //move calls attributes to the end
            const sorted = attributes.sort((a, b) => a.priority - b.priority);
            sorted.slice(2).concat(sorted.filter(p => p.value.length > 40))
            //   .forEach(attr=>{  
            //    node.children = removeItem(node.children!, attr.nodes)
            // })

            function removeItem<T>(arr: Array<T>, value: T[]): Array<T> {
                const index = arr.indexOf(value[0]);

                if (index > -1) {
                    arr.splice(index, value.length);
                }
                return arr;
            }

            style = attributes.map(a => a.value).join().length > 40 ? {
                ...style,
                filter: "",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                maxHeight: "100%"
            } : style;

            return createElement({
                node: node,
                stylesheet,
                style,
                useInlineStyles,
                key,
            });
        }
    }

    return ({rows, stylesheet, useInlineStyles}) => (
        <div style={{height: '30rem', width: "100%"}}>

            <AutoSizer>
                {({height, width}) => (
                    <List
                        height={height}
                        width={width}
                        rowHeight={rowHeight}
                        rowRenderer={rowRenderer({rows, stylesheet, useInlineStyles})}
                        rowCount={rows.length}
                        overscanRowCount={overscanRowCount}
                    />
                )}
            </AutoSizer>
        </div>
    );
}