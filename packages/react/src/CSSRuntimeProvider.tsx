'use client'

import type { Config } from '@master/css'
import { RuntimeCSS } from '@master/css-runtime'
import React, { useEffect, useLayoutEffect, createContext, useContext, useRef, useCallback } from 'react'

export const RuntimeCSSContext = createContext<RuntimeCSS | undefined>(undefined)
export const useRuntimeCSS = () => useContext(RuntimeCSSContext)
const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function CSSRuntimeProvider({ children, config, root }: {
    children: React.ReactNode,
    config?: Config | Promise<any>,
    root?: Document | ShadowRoot
}) {
    const runtimeCSS = useRef<RuntimeCSS>(undefined)
    const initialize = useCallback(async (signal: AbortSignal) => {
        const configModule = await config
        if (signal.aborted) return
        const resolvedConfig = configModule?.config || configModule?.default || configModule
        const currentRoot = root ?? document
        const existingCSSRuntime = (globalThis as any).runtimeCSSs.find((eachCSS: RuntimeCSS) => eachCSS.root === currentRoot)
        if (existingCSSRuntime) {
            runtimeCSS.current = existingCSSRuntime
        } else {
            runtimeCSS.current = new RuntimeCSS(root, resolvedConfig).observe()
        }
    }, [config, root])

    useIsomorphicEffect(() => {
        const controller = new AbortController()
        initialize(controller.signal)
        return () => {
            controller.abort()
            runtimeCSS?.current?.destroy()
        }
    }, [initialize])

    return <RuntimeCSSContext.Provider value={runtimeCSS.current}>{children}</RuntimeCSSContext.Provider>
}