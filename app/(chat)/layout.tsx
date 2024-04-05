import { SidebarDesktop } from '@/components/sidebar-desktop'
import React from "react";
import {Theme} from "@radix-ui/themes";

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
    // className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden"

    return ( 
        <div >
      <SidebarDesktop />
            <Theme> 
            {children}
            </Theme>
    </div>
  )
}
