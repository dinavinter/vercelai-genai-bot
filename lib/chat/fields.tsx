'use client';
import React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import {Cross2Icon, RowSpacingIcon} from "@radix-ui/react-icons";
import {Box, Card, Code, Container, Flex, Inset, ScrollArea, Text} from "@radix-ui/themes";
import type {Fields} from "@/lib/screen";
import {CodeBlock} from "@/components/ui/codeblock";
import {BotCard} from "@/components/stocks";
import {Button} from "@/components/ui/button";

export const FieldsCard = ({fields}:{fields:Fields}) => {
    const [open, setOpen] = React.useState(false);
    return ( 
            <BotCard showAvatar={false} > 
            
           <Card variant="ghost" >
               
            <Collapsible.Root className="CollapsibleRoot" open={open} onOpenChange={setOpen}> 
                <Collapsible.Trigger >
                    <Flex wrap={"wrap"} direction={"column"}> 
                        <Button size={"icon"} variant={"ghost"}  >
                            <Text weight={"bold"}>Fields</Text>
                        </Button>
                    <Flex wrap={"wrap"} direction={"row"}  gap={"1"}>
                        {open ? <Cross2Icon /> : fields.map((field, i) => (
                            <Box box-shadow={"-6"} > 
                                <Code  key={i} className="Text">{field.name};</Code>
                            </Box>    
                        ))}
                        
                    </Flex>
                    </Flex>
                </Collapsible.Trigger> 
            <Collapsible.Content>
                <Box  inset={"1"} pb={"1"} overflowY={"hidden"} overflowX={"visible"} >
                    <ScrollArea type="auto" scrollbars="vertical" style={{ height: 180 }}> 
                          <CodeBlock language={"JavaScript"} value={JSON.stringify(fields, null, 2)} />
                    </ScrollArea>
                </Box>
            </Collapsible.Content>
                
               </Collapsible.Root>
                </Card>
            </BotCard>
    );
};