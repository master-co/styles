'use client'

import type { Config } from '@master/css'
import { RuntimeCSS } from '@master/css-runtime'
import React, { useEffect, useLayoutEffect, createContext, useContext, useRef, useCallback } from 'react'

export const RuntimeCSSContext = createContext<RuntimeCSS | undefined>(undefined)
export const useRuntimeCSS = () => useContext(RuntimeCSSContext)
const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function CSSRuntimeProvider(props: {
    children: React.ReactNode,
    config?: Config | Promise<any>,
    root?: Document | ShadowRoot
}) {
    const runtimeCSS = useRef<RuntimeCSS>(undefined)

    const resolveConfig = useCallback(async () => {
        const configModule = await props.config
        return configModule?.config || configModule?.default || configModule
    }, [props.config])

    const initialize = useCallback(async (signal: AbortSignal) => {
        const resolvedConfig = await resolveConfig()
        if (signal.aborted) return
        runtimeCSS.current = new RuntimeCSS(props.root ?? document, resolvedConfig).observe()
    }, [props.root, resolveConfig])

    /** onMounted */
    useIsomorphicEffect(() => {
        const controller = new AbortController()
        initialize(controller.signal)
        return () => {
            controller.abort()
            runtimeCSS.current?.destroy()
            runtimeCSS.current = undefined
        }
    }, [])

    /** on config change */
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const resolvedConfig = await resolveConfig()
            if (controller.signal.aborted) return
            if (runtimeCSS.current) {
                runtimeCSS.current.refresh(resolvedConfig)
            }
        })()
        return () => {
            controller.abort()
        }
    }, [props.config, resolveConfig])

    /** on root change */
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            if (controller.signal.aborted) return
            if (runtimeCSS.current) {
                runtimeCSS.current.destroy()
                runtimeCSS.current = undefined
                initialize(controller.signal)
            }
        })()
        return () => {
            controller.abort()
        }
    }, [initialize, props.root])

    return <RuntimeCSSContext.Provider value={runtimeCSS.current}>{props.children}</RuntimeCSSContext.Provider>
}