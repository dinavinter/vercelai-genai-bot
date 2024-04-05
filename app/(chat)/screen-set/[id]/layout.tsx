import React from "react";
import {AI} from "@/lib/chat/actions";
interface ChatLayoutProps {
    children: React.ReactNode
}
export default async function ChatLayout({ children }: ChatLayoutProps) {
    // className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden"

    return (
        <AI>
         {children}
        </AI>
    )
}