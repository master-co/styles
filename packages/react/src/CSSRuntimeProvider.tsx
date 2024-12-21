'use client'

import type { Config } from '@master/css'
import { RuntimeCSS } from '@master/css-runtime'
import React, { useEffect, useLayoutEffect, createContext, useContext, useRef } from 'react'

export const RuntimeCSSContext = createContext<RuntimeCSS | undefined>(undefined)
export const useRuntimeCSS = () => useContext(RuntimeCSSContext)
const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function CSSRuntimeProvider({ children, config, root }: {
    children: React.ReactNode,
    config?: Config | Promise<any>,
    root?: Document | ShadowRoot
}) {
    const runtimeCSS = useRef<RuntimeCSS>(undefined)

    useIsomorphicEffect(() => {
        const controller = new AbortController()
        const initialize = async () => {
            const configModule = await config
            if (controller.signal.aborted) return
            const resolvedConfig = configModule?.config || configModule?.default || configModule
            const currentRoot = root ?? document
            const existingCSSRuntime = (globalThis as any).runtimeCSSs.find((eachCSS: RuntimeCSS) => eachCSS.root === currentRoot)
            if (existingCSSRuntime) {
                runtimeCSS.current = existingCSSRuntime
            } else {
                runtimeCSS.current = new RuntimeCSS(root, resolvedConfig).observe()
                console.log(runtimeCSS.current.style.sheet?.cssRules.length)
            }
        }
        initialize()
        return () => {
            controller.abort()
            runtimeCSS?.current?.destroy()
        }
    }, [config, root, runtimeCSS])

    useEffect(() => {
        const controller = new AbortController()
        const initialize = async () => {
            const configModule = await config
            if (controller.signal.aborted || !runtimeCSS.current) return
            const resolvedConfig = configModule?.config || configModule?.default || configModule
            runtimeCSS.current.refresh(resolvedConfig)
        }
        initialize()
        return () => {
            controller.abort()
        }
    }, [config])

    return <RuntimeCSSContext.Provider value={runtimeCSS.current}>{children}</RuntimeCSSContext.Provider>
}