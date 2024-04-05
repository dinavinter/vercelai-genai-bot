'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import {Button, ButtonProps} from '@/components/ui/button'
import { IconMoon, IconSun } from '@/components/ui/icons'
import {ViewHorizontalIcon, ViewVerticalIcon} from "@radix-ui/react-icons";
import {Code, Text} from "@radix-ui/themes";
import {CodeProps} from "@radix-ui/themes/src/components/code";
import {CodeComponent} from "react-markdown/lib/ast-to-react";
import {extractProps} from "@radix-ui/themes/src/helpers";
import {codePropDefs} from "@radix-ui/themes/src/components/code.props";
import {marginPropDefs} from "@radix-ui/themes/src/props";
import {Slot} from "@radix-ui/react-slot";
import {forwardRef} from "react";
  
export function ThemeButton({initial, update}: {initial?: string, update?: (theme: string) => void}) {
    const [_, startTransition] = React.useTransition()
    const [theme, setTheme] = React.useState<string>(initial || "light")
    const updateTheme = (theme: string) => {
        setTheme(theme)
        if (update) {
            update(theme)
        }
    }
    return (
        <Button 
            variant="ghost"
            size="icon"
            onClick={() => {
                startTransition(() => {
                    updateTheme(theme === 'light' ? 'dark' : 'light')
                })
            }}
            style={{margin:0 , padding:0}}
            
        >
            {!theme ? null : theme === 'dark' ? (
                <IconMoon className="transition-all" />
            ) : (
                <IconSun className="transition-all" />
            )}
            {/*<span className="sr-only">Toggle theme</span>*/}
        </Button>
    )
}

type LayoutOption="vertical" | "horizontal"
export const LayoutToggleIcon_ =({layout,setLayout}:{layout:LayoutOption, setLayout: (layout:LayoutOption)=> void}):React.ReactNode=>
    layout === 'vertical' ?  <ViewVerticalIcon className="transform" cursor={"hand"} onClick={
        () => setLayout('horizontal')
    }/> : 
        <ViewHorizontalIcon className="transform" onClick={() => 
            () => setLayout('vertical')
        }/>

export const LayoutToggleIcon =React.forwardRef<React.ElementRef<"button"> , ButtonProps&{layout:LayoutOption}>(({layout:initial,...props}, forwardedRef)=> {
    const [layout, setLayout] = React.useState<LayoutOption>(initial)  
    return  <Button  variant="ghost"
                     {...props}
            ref={forwardedRef}
                     size="icon"  asChild>
       {layout === 'vertical' ? <ViewVerticalIcon fontSize={6} className="transition-all" cursor={"hand"} onClick={
            () => setLayout('horizontal')
        }/> :
        <ViewHorizontalIcon className="transition-all" fontSize={6} onClick={() =>
            () => setLayout('vertical')
        }/>}
    </Button>
})

export const LayoutButton = React.forwardRef<React.ElementRef<"code"> , CodeProps & {initial: LayoutOption, update?: ((direction: LayoutOption) => void)}>(( {initial, update, ...props } , forwardedRef) =>{
     const [_, startTransition] = React.useTransition()
    const [layout, setLayout] = React.useState<LayoutOption>(initial)
    const updateLayout = (layout: LayoutOption) => {
        setLayout(layout)
        if (update) {
            update(layout)
        }
    }
    
    return    <Button
        variant="ghost"
        size="icon">
        {layout === 'vertical' ? <ViewVerticalIcon  className="transition-all" cursor={"hand"} onClick={
                () => setLayout('horizontal')
            }/> :
            <ViewHorizontalIcon className="transition-all"  onClick={() =>
                () => setLayout('vertical')
            }/>}
    </Button>
        
    
})
    
export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [_, startTransition] = React.useTransition()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        startTransition(() => {
          setTheme(theme === 'light' ? 'dark' : 'light')
        })
      }}
    >
      {!theme ? null : theme === 'dark' ? (
        <IconMoon className="transition-all" />
      ) : (
        <IconSun className="transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

