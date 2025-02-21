'use client'

import type { editor } from 'monaco-editor'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { snackbar } from 'internal/utils/snackbar'
import dedent from 'ts-dedent'
import { IconBrandCss3, IconChevronDown, IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons-react'
import Tabs, { Tab } from 'internal/components/Tabs'
import useRewritedPathname from 'internal/uses/rewrited-pathname'
import { useSearchParams } from 'next/navigation'
import LanguageButton from 'internal/components/LanguageButton'
import previewHandlerScriptText from './previewHandler.js?text'
import ThemeButton from 'internal/components/ThemeButton'
import { getScriptHTML } from './getScriptHTML'
import { getStyleHTML } from './getStyleHTML'
import { beautifyCSS } from 'internal/utils/beautify-css'
import templates from './templates'
import Resizable from 'internal/components/Resizable'
import { getLinkHTML } from './getLinkHTML'
import { useThemeMode } from '@master/theme-mode.react'
import Header from 'internal/components/Header'
import HeaderNav from 'internal/components/HeaderNav'
import i18n from 'internal/common/i18n.config.mjs'
import { variables } from '@master/css'
import config from '~/site/master.css'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Link from 'internal/components/Link'
import Editor, { loader, type Monaco } from '@monaco-editor/react'
import DocMenuButton from 'internal/components/DocMenuButton'
import { useLocale } from 'internal/contexts/locale'
import { useTranslation } from 'internal/contexts/i18n'
import HeaderContent from 'internal/components/HeaderContent'
import { useApp } from '~/internal/contexts/app'

const ShareButton = dynamic(() => import('./components/ShareButton'))

// import { Registry } from 'monaco-textmate'
// import { wireTmGrammars } from 'monaco-editor-textmate'

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    readOnly: false,
    minimap: {
        enabled: false,
    },
    padding: {
        top: 20,
        bottom: 20,
    },
    scrollBeyondLastLine: false,
    wrappingStrategy: 'advanced',
    overviewRulerLanes: 0,
    lineHeight: 22,
    letterSpacing: -0.1,
    fontSize: 14,
    fontFamily: (config.variables as any)['font-family'].mono.join(','),
    fontLigatures: true
}

const editorHTMLOptions: any = {
    format: {
        wrapLineLength: 0
    }
}

export default function Play(props: any) {
    const $ = useTranslation()
    const app = useApp()
    const locale = useLocale()
    const router = useRouter()
    const themeMode = useThemeMode()
    const searchParams = useSearchParams()
    const pathname = useRewritedPathname()
    const versionSelectRef = useRef<HTMLSelectElement>(null)
    const monacoProvidersRef = useRef<any>([])
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const monacoRef = useRef<Monaco | null>(null)
    const previewIframeRef = useRef<HTMLIFrameElement>(null)
    const prevVersionRef = useRef(props.shareItem?.version ?? process.env.NEXT_PUBLIC_VERSION)
    const [shareId, setShareId] = useState(props.shareId ?? '')
    const [sharing, setSharing] = useState(false)
    const [version, setVersion] = useState(props.shareItem?.version ?? process.env.NEXT_PUBLIC_VERSION)
    const [generatedCSSText, setGeneratedCSSText] = useState('')
    const [generatedCSSSize, setGeneratedCSSSize] = useState('0KB')
    const template = useMemo(() => templates.find((eachTemplate) => eachTemplate.version === version), [version])
    const [previewErrorEvent, setPreviewErrorEvent] = useState<any>()
    const layout = useMemo(() => searchParams?.get('layout'), [searchParams])
    const preview = useMemo(() => searchParams?.get('preview'), [searchParams])
    const shareItem: PlayShare = useMemo(() => props.shareItem || template, [props.shareItem, template])
    const tab = useMemo(() => searchParams?.get('tab') || shareItem.files[0].title, [searchParams, shareItem.files])

    const getSearchPath = useCallback((name?: string, value?: any) => {
        const urlSearchParams = new URLSearchParams(searchParams?.toString())
        if (name)
            if (!value) {
                urlSearchParams.delete(name)
            } else {
                urlSearchParams.set(name, value)
            }
        const searchParamsStr = urlSearchParams.toString()
        return pathname + (searchParamsStr ? '?' + searchParamsStr : '')
    }, [pathname, searchParams])

    const generateDatabaseShareItem = useCallback((target: any) => ({
        files: target.files,
        dependencies: template?.dependencies,
        version
    }), [template?.dependencies, version])

    const [strignifiedPrevShareItem, setStrignifiedPrevShareItem] = useState(JSON.stringify(generateDatabaseShareItem(shareItem)))
    const [shareable, setShareable] = useState(false)
    const sharePathname = useMemo(() => {
        if (typeof window === 'undefined') {
            return ''
        }
        return `${locale === i18n.defaultLocale ? '' : `/${locale}`}/play/${shareId}${window.location.search}`
    }, [locale, shareId])

    useEffect(() => {
        if (prevVersionRef.current !== version) {
            prevVersionRef.current = version
            setStrignifiedPrevShareItem(JSON.stringify(generateDatabaseShareItem(shareItem)))
            setShareable(false)
        }
    }, [generateDatabaseShareItem, shareItem, version])

    const validateShareable = useCallback(() => {
        const databaseShareItem = generateDatabaseShareItem(shareItem)
        const strignifiedDatabaseShareItem = JSON.stringify(databaseShareItem)
        setShareable(strignifiedDatabaseShareItem !== strignifiedPrevShareItem)
    }, [generateDatabaseShareItem, shareItem, strignifiedPrevShareItem])

    /**
     * 避免切換到更大視口時仍停留在僅小視口支援的 Preview 或 Generated CSS 瀏覽模式
     */
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= variables.screen.md) {
                if (tab === 'Preview' || tab === 'Generated CSS') {
                    router.push(getSearchPath('tab', shareItem.files[0].title))
                }
            } else {
                router.push(getSearchPath('preview', ''))
            }
        }
        window.addEventListener('resize', onResize, { passive: true })
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [tab, shareItem.files, router, getSearchPath])

    /**
     * 需避免即時編輯 HTML, Config 或切換 Theme 時更新 previewHTML，否則 Preview 將重載並造成視覺閃爍
     */
    const previewHTML = useMemo(() => {
        let headInnerHTML = ''
        let bodyInnerHTML = ''

        const appendFile = (eachFile: PlayShareFile) => {
            if (!eachFile) {
                eachFile = template?.files.find(({ title }: any) => title === eachFile.title) as PlayShareFile
            }
            const content = eachFile.content
            if (!content) {
                return
            }
            switch (eachFile.language) {
                case 'html':
                    bodyInnerHTML += content
                    return
                case 'javascript':
                    let eachScriptHTML = getScriptHTML({ ...eachFile, text: content })
                    if (eachFile.name === 'master.css.js') {
                        eachScriptHTML = eachScriptHTML
                            .replace(/(export default|export const config =)/, 'window.masterCSSConfig =')
                    }
                    headInnerHTML += eachScriptHTML
                    break
                case 'css':
                    headInnerHTML += getStyleHTML({ ...eachFile, text: content })
                    break
            }
        }

        shareItem.files
            .filter((eachFile) => eachFile.priority === 'low')
            .filter((eachFile) => appendFile(eachFile))

        shareItem?.links?.forEach((link) => {
            headInnerHTML += getLinkHTML(link)
        })

        shareItem?.dependencies?.styles
            ?.forEach((style) => {
                headInnerHTML += getStyleHTML(style)
            })

        shareItem?.dependencies?.scripts
            ?.forEach((script) => {
                headInnerHTML += getScriptHTML(script)
            })

        shareItem.files
            .filter((eachFile) => eachFile.priority !== 'low')
            .filter((eachFile) => appendFile(eachFile))

        return dedent`<html>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Inter:wght@100..900&family=Noto+Sans+TC:wght@100..900&display=swap" rel="stylesheet" />
                <script>${previewHandlerScriptText}</script>
                <style>body { font-family: Inter, Noto Sans TC, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" }</style>
                ${headInnerHTML}
            </head>
            <body>${bodyInnerHTML}</body>
        </html>`
    }, [shareItem, template?.files])

    const tabFile: { id: string, language: string, content: string, readOnly: boolean, name: string, title: string } = useMemo(() => {
        switch (tab) {
            // mobile
            case 'Generated CSS':
                return {
                    id: 'GeneratedCSS',
                    title: 'Generated CSS',
                    name: 'master.css',
                    language: 'css',
                    content: generatedCSSText,
                    readOnly: true
                }
            // mobile
            case 'Preview':
                return shareItem.files[0]
            default:
                return shareItem.files.find((eachTab: any) => eachTab.title === tab) as any
        }
    }, [tab, generatedCSSText, shareItem.files])

    const hotUpdatePreviewByFile = useDebouncedCallback(() => {
        if (editorRef.current) {
            tabFile.content = editorRef.current?.getValue()
            validateShareable()
        }

        previewIframeRef?.current?.contentWindow?.postMessage({
            id: tabFile.id,
            language: tabFile.language,
            name: tabFile.name,
            title: tabFile.title,
            content: tabFile.content
        }, window.location.origin)

        setTimeout(() => {
            setPreviewErrorEvent(null)
        })
    }, 250)

    // dispose monaco providers
    useEffect(() => {
        const providers = monacoProvidersRef.current
        loader.config({
            paths: {
                vs: window.location.origin + '/monaco-editor/vs',
            }
        })
        return () => {
            providers.forEach((provider: any) => {
                provider.dispose()
            })
            editorRef.current?.dispose()
        }
    }, [])

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            const { type, content } = event.data
            if (event.origin !== document.location.origin) {
                return
            }
            switch (type) {
                case 'cssUpdate':
                    const cssText = content ? beautifyCSS(content) : ''
                    setGeneratedCSSSize(Math.round(new TextEncoder().encode(content).length / 1024 * 100) / 100 + 'KB')
                    setGeneratedCSSText(cssText)
                    break
                case 'error':
                    setPreviewErrorEvent(event.data)
                    break
            }
        }
        const initialErrorEvent = (window as any).__SANDBOX_INITIAL_ERROR_EVENT
        if (initialErrorEvent) {
            setPreviewErrorEvent(initialErrorEvent)
            delete (window as any).__SANDBOX_INITIAL_ERROR_EVENT
        }
        window.addEventListener('message', onMessage)
        return () => {
            window.removeEventListener('message', onMessage)
        }
    }, [shareable])

    useEffect(() => {
        const onUnload = (event: any) => {
            event.preventDefault()
            event.returnValue = true
        }
        if (shareable) {
            window.addEventListener('beforeunload', onUnload)
        } else {
            window.removeEventListener('beforeunload', onUnload)
        }
        return () => {
            window.removeEventListener('beforeunload', onUnload)
        }
    }, [shareable])

    const copyShareLink = useCallback(async (newSharePathname?: string) => {
        snackbar('Share link copied!')
        await navigator.clipboard.writeText(window.location.origin + (newSharePathname || sharePathname))
    }, [sharePathname])

    const share = useCallback(async (writeShareItem: any) => {
        if (!shareable) {
            return
        }
        setSharing(true)
        const databaseShareItem = generateDatabaseShareItem(shareItem)
        const newShareId = await writeShareItem({
            ...databaseShareItem,
            createdAt: new Date().toISOString()
        })
        const newSharePathname = `${locale === i18n.defaultLocale ? '' : `/${locale}`}/play/${newShareId}${window.location.search}`
        setShareId(newShareId)
        setStrignifiedPrevShareItem(JSON.stringify(databaseShareItem))
        setShareable(false)
        setSharing(false)
        copyShareLink(newSharePathname)
        router.push(newSharePathname)
    }, [copyShareLink, generateDatabaseShareItem, locale, router, shareItem, shareable])

    const responsive = useMemo(() => {
        return preview === 'responsive'
            // 避免在 @<md 時觸發響應式預覽
            && tab !== 'Preview'
    }, [tab, preview])

    // change version
    const onVersionSelectChange = (event: any) => {
        if (shareable) {
            if (!window.confirm('Are you sure you want to discard the current changes?')) {
                event.preventDefault()
                return
            }
        }
        setVersion(event.target.value)
    }

    const editorOnMount = async (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
        // TODO: 須確認是否可由 @monaco-editor/react 的相關 API 改寫，不要用 monaco-editor
        const { languages } = await import('monaco-editor')
        editorRef.current = editor
        monacoRef.current = monaco

        languages.html.htmlDefaults.setOptions(editorHTMLOptions)

        // const {
        //     CompletionItemProvider,
        //     ColorPresentationProvider,
        //     DocumentColorsProvider,
        //     HoverItemProvider
        // } = await import('./master-css-monaco')

        // monacoProvidersRef.current.replace(languages.registerCompletionItemProvider('html', {
        //     provideCompletionItems: function (model, position) {
        //         return CompletionItemProvider(model, position, 'html')
        //     },
        //     triggerCharacters: [':', '@', '~'],
        // }))

        // monacoProvidersRef.current.replace(languages.registerCompletionItemProvider('javascript', {
        //     provideCompletionItems: function (model, position) {
        //         return CompletionItemProvider(model, position, 'javascript')
        //     },
        //     triggerCharacters: [':', '@', '~'],
        // }))

        // monacoProvidersRef.current.replace(languages.registerHoverProvider('html', {
        //     provideHover: function (model, position) {
        //         var result = HoverItemProvider(position, model)
        //         if (result != null) {
        //             return result
        //         }
        //     },
        // }))

        // monacoProvidersRef.current.replace(languages.registerColorProvider('html', {
        //     provideColorPresentations(model, colorInfo) {
        //         return ColorPresentationProvider(model, colorInfo)
        //     },

        //     provideDocumentColors(model, token) {
        //         return DocumentColorsProvider(model)
        //     },
        // }))

        // monacoProvidersRef.current.replace(languages.registerColorProvider('javascript', {
        //     provideColorPresentations(model, colorInfo) {
        //         return ColorPresentationProvider(model, colorInfo)
        //     },

        //     provideDocumentColors(model, token) {
        //         return DocumentColorsProvider(model)
        //     },
        // }))

        // languages.register({ id: 'master-css' })
        // languages.register({ id: 'master-css-injection-class' })

        // const registry = new Registry({
        //     getGrammarDefinition: async (scopeName) => {
        //         switch (scopeName) {
        //             case 'source.master-css':
        //                 return {
        //                     format: 'json',
        //                     content: await (await fetch('/tmLanguage/master-css.tmLanguage.json')).text(),
        //                 }
        //             case 'source.master-css.injection-class':
        //                 return {
        //                     format: 'json',
        //                     content: await (await fetch('/tmLanguage/master-css.injection-class.tmLanguage.json')).text(),
        //                 }
        //             case 'source.master-css.injection-js':
        //                 return {
        //                     format: 'json',
        //                     content: await (await fetch('/tmLanguage/master-css.injection-js.tmLanguage.json')).text(),
        //                 }
        //             case 'source.master-css.injection-string':
        //                 return {
        //                     format: 'json',
        //                     content: await (await fetch('/tmLanguage/master-css.injection-string.tmLanguage.json')).text(),
        //                 }
        //             default:
        //                 return null
        //         }
        //     },
        //     getInjections(scopeName: ScopeName): string[] | undefined {
        //         switch (scopeName) {
        //             case 'source.master-css.injection-class':
        //                 return [
        //                     "source",
        //                     "text"
        //                 ]
        //             case 'source.master-css.injection-js':
        //                 return [
        //                     "source.js",
        //                     "source.ts"
        //                 ]
        //             case 'source.master-css.injection-string':
        //                 return [
        //                     "source.js",
        //                     "source.ts"
        //                 ]
        //             default:
        //                 return undefined
        //         }
        //         const grammar = grammars[scopeName];
        //         return grammar ? grammar.injections : undefined;
        //     },
        // })
        // const grammars = new Map()
        // grammars.set('master-css', 'source.master-css')
        // await wireTmGrammars(monaco, registry, grammars, editor)
        // const grammar = await registry.loadGrammar(languages.get(languageId))

        // languages.setTokensProvider(languageId, {
        //     getInitialState: () => new TokenizerState(INITIAL),
        //     tokenize: (line: string, state: TokenizerState) => {
        //         const res = grammar.tokenizeLine(line, state.ruleStack)
        //         return {
        //             endState: new TokenizerState(res.ruleStack),
        //             tokens: res.tokens.map(token => ({
        //                 ...token,
        //                 // TODO: At the moment, monaco-editor doesn't seem to accept array of scopes
        //                 scopes: editor ? TMToMonacoToken(editor, token.scopes) : token.scopes[token.scopes.length - 1]
        //             })),
        //         }
        //     }
        // })

        previewIframeRef?.current?.contentWindow?.postMessage({ type: 'editorReady' }, window.location.origin)
    }

    const width = useMemo(() => (!layout || layout === '2') ? '50%' : '100%', [layout])
    const height = useMemo(() => (!layout || layout === '2') ? '100%' : '50%', [layout])
    return (
        <div className="abs flex full flex:col">
            <Header fixed={false}>
                <HeaderContent>
                    <Link href={'/'}>
                        {<app.Logotype height="19" />}
                    </Link>
                    <label className='app-header-nav rel font:medium gap:5 ml:auto ml:30@md'>
                        v{version}
                        <select ref={versionSelectRef} name="version" defaultValue={version}
                            className="abs full cursor:pointer inset:0 opacity:0"
                            onChange={onVersionSelectChange}>
                            {templates.map(({ version: eachVersion }) => (
                                <option value={eachVersion} key={eachVersion} disabled={props.shareItem && version !== eachVersion}>
                                    v{eachVersion}
                                </option>
                            ))}
                            {/* {
                            shareItem?.version && !templates.find((eachTemplate) => eachTemplate.version === version)
                            && <option value={shareItem.version} disabled>
                                v{shareItem?.version}
                            </option>
                        } */}
                        </select>
                        <IconChevronDown className="mr:-3 size:1em stroke:1.5" />
                    </label>
                    {app.navs?.map(({ fullName, Icon, ...eachLink }: any, index) =>
                        <HeaderNav className={clsx('hidden@<md', index === app.navs.length - 1 && 'mr:auto')} key={eachLink.name} {...eachLink} onClick={(event: any) => {
                            if (shareable) {
                                if (!window.confirm('Are you sure to go to another page and discard current changes?')) {
                                    event.preventDefault()
                                    return
                                }
                            }
                        }}>
                            {$(eachLink.name)}
                        </HeaderNav>
                    )}
                    {(shareId && !shareable) &&
                        <button className="app-header-icon hidden@<md mx:12" onClick={() => copyShareLink()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M9 15l6 -6"></path>
                                <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path>
                                <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path>
                            </svg>
                            <span className="font:12 ml:10 tracking:0">
                                {shareId}
                            </span>
                        </button>}
                    {/* share button */}
                    {shareable && <ShareButton className={clsx('hidden@<md', sharing ? 'app-header-nav' : 'app-header-icon')} disabled={sharing} onClick={share}>
                        {sharing && <span className="ml:10">{$('Sharing ...')}</span>}
                    </ShareButton>}
                    {(shareId || shareable) && <div className='hidden@<md bg:frame-light h:1em mx:4x w:1'></div>}
                    <Link className="app-header-icon hidden@<md" href={getSearchPath('layout', layout ? '' : '2')}>
                        <svg className={clsx({ 'stroke:accent': !layout || layout === '2' })} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path className={clsx(
                                '~transform|.2s',
                                (!layout || layout === '2') ? 'fill:accent/.15' : 'fill:text-lightest/.2',
                                { 'translate(12,4)': !layout }
                            )} stroke="none" d="M1,0H8A0,0,0,0,1,8,0V16a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V1A1,1,0,0,1,1,0Z" transform='translate(4 4)' />
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                            <path d="M12 4l0 16"></path>
                        </svg>
                    </Link>
                    <Link className="app-header-icon hidden@<md" href={getSearchPath('layout', layout === '3' ? '4' : '3')}>
                        <svg className={clsx({ 'stroke:accent': layout === '3' || layout === '4' }, 'rotate(90)')} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path className={clsx(
                                '~transform|.2s',
                                (layout === '3' || layout === '4') ? 'fill:accent/.15' : 'fill:text-lightest/.2',
                                { 'translate(12,4)': layout === '3' }
                            )} stroke="none" d="M1,0H8A0,0,0,0,1,8,0V16a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V1A1,1,0,0,1,1,0Z" transform='translate(4 4)' />
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                            <path d="M12 4l0 16"></path>
                        </svg>
                    </Link>
                    <Link className="app-header-icon hidden@<md" href={getSearchPath('layout', '5')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={clsx(layout === '5' && 'stroke:accent')} width="22" height="22" strokeWidth="1.2" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                            <path d="M4 9l16 0"></path>
                            <rect className={layout === '5' ? 'fill:accent/.15' : 'fill:text-lightest/.2'} width="16" height="11" stroke='none' transform="translate(4 9)" />
                        </svg>
                    </Link>
                    <span className='hidden'>{layout}</span>
                    <div className='hidden@<md bg:frame-light h:1em mx:4x w:1'></div>
                    {/* preview: desktop */}
                    <Link className="app-header-icon hidden@<md" href={getSearchPath('preview', '')}>
                        <IconDeviceDesktop width="22" height="22" className={clsx(
                            'stroke:1.3 stroke:current',
                            !preview ? 'fill:accent/.15 stroke:accent' : 'fill:text-lightest/.2'
                        )} />
                    </Link>
                    {/* preview: responsive */}
                    <Link className="app-header-icon hidden@<md" href={getSearchPath('preview', 'responsive')}>
                        <IconDeviceMobile width="22" height="22" className={clsx(
                            'stroke:1.3 stroke:current',
                            responsive ? 'fill:accent/.15 stroke:accent' : 'fill:text-lightest/.2'
                        )} />
                    </Link>
                    {/* preview: css */}
                    <Link className="app-header-icon hidden@<md" href={getSearchPath('preview', 'css')}>
                        <IconBrandCss3 width="22" height="22" className={clsx(
                            'stroke:1.3 stroke:current',
                            preview === 'css' ? 'fill:accent/.15 stroke:accent' : 'fill:text-lightest/.2'
                        )} />
                    </Link>
                    <span className='hidden'>{preview}</span>
                    <div className='hidden@<md bg:frame-light h:1em mx:4x w:1'></div>
                    <LanguageButton className="app-header-icon hidden@<md" locale={locale} />
                    <ThemeButton className="app-header-icon hidden@<md mr:-12"
                        onChange={(theme: string) => {
                            previewIframeRef?.current?.contentWindow?.postMessage({
                                theme
                            }, window.location.origin)
                        }}
                    />
                    <DocMenuButton className="app-header-icon hidden@md mr:-12" />
                </HeaderContent>
            </Header >
            <div
                className={clsx(
                    'flex full bg:transparent_:is(.monaco-editor,.monaco-editor-background,.monaco-editor_.margin) flex:1 flex:col!@<sm overflow:hidden',
                    {
                        'flex:row': !layout,
                        'flex:row-reverse': layout === '2',
                        'flex:col': layout === '3' || layout === '5',
                        'flex:col-reverse': layout === '4'
                    }
                )}
            >
                <Resizable
                    overlay={false}
                    originX={layout === '2' ? 'right' : 'left'}
                    originY={layout === '3' ? 'top' : 'bottom'}
                    handlerStyle="hidden"
                    showHandler={[layout === '4', !layout, layout === '3', layout === '2']}
                    className={clsx(
                        layout === '5' && 'hidden!@md',
                        {
                            'full!@<md': tab !== 'Preview',
                            'br:1|lightest': !layout,
                            'bl:1|lightest': layout === '2',
                            'bb:1|lightest': layout === '3',
                            'bt:1|lightest': layout === '4'
                        }
                    )}
                    width={tab === 'Preview' ? '' : width}
                    height={tab === 'Preview' ? '' : height}
                    showHeight={true}
                >
                    <Tabs className="flex:0|0|auto" contentClassName="px:30">
                        {shareItem.files.map((file, index) => (
                            <Tab href={getSearchPath('tab', index === 0 ? '' : file.title)} size="sm" key={file.id} active={tab === file.title}>
                                {file.title || ''}
                            </Tab>
                        ))}
                        {/* mobile couldn't support tab active */}
                        <Tab href={getSearchPath('tab', 'Generated CSS')} size="sm" className="hidden@md" active={tab === 'Generated CSS'}>
                            Generated CSS
                        </Tab>
                        <Tab href={getSearchPath('tab', 'Preview')} className="hidden@sm" size="sm" active={tab === 'Preview'}>
                            Preview
                        </Tab>
                    </Tabs>
                    {/* fix render issue */}
                    <span className='hidden'>{tab}</span>
                    <div className='full min-h:0'>
                        <Editor
                            className={clsx(
                                { 'hidden!': tab === 'Preview' }
                            )}
                            height="100%"
                            width="100%"
                            theme={'vs-' + themeMode.value}
                            defaultValue={tabFile.content}
                            defaultLanguage={tabFile.language}
                            path={tabFile.id}
                            options={{
                                ...editorOptions,
                                readOnly: tabFile.readOnly
                            }}
                            onMount={editorOnMount}
                            onChange={hotUpdatePreviewByFile}
                        />
                    </div>
                </Resizable>
                <div className={clsx('rel bg:canvas flex:1|1|auto overflow:hidden', {
                    'flex jc:center p:32': responsive,
                    'pt:64': responsive && layout !== '3',
                    'pb:64': responsive && layout === '3',
                    'hidden@<md': tab !== 'Preview'
                })}>
                    <Resizable
                        ruleClassName={'abs'}
                        showRuler={responsive && 'always'}
                        rulerPlacement={layout === '3' ? 'bottom' : 'top'}
                        width={responsive ? '490px' : null}
                        height={responsive ? '680px' : null}
                        overlay={false}
                        originX={'center'}
                        showHandler={responsive ? [false, true, true] : false}
                        className={clsx(
                            'full',
                            {
                                'max-w:100% max-h:100% outline:1|lightest': responsive
                            }
                        )}
                        showHeight={true}
                    >
                        <iframe
                            title="Preview"
                            ref={previewIframeRef}
                            className={clsx('demo', { hidden: preview === 'css' })}
                            style={{ width: '100%', height: '100%', borderRadius: 0, margin: 0, padding: 0, border: 0 }}
                            sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-same-origin allow-pointer-lock allow-top-navigation allow-modals"
                            srcDoc={previewHTML}
                        />
                        <div className={clsx('flex flex:col h:full', { 'hidden!': preview !== 'css' })}>
                            <div className='flex align-items:center bb:1|lightest flex:0|0|auto font:12 h:48 justify-content:space-between px:30'>
                                <div>Generated CSS</div>
                                <div className="fg:light">{generatedCSSSize}</div>
                            </div>
                            <Editor
                                height="100%"
                                width="100%"
                                theme={'vs-' + themeMode.value}
                                defaultValue={generatedCSSText}
                                value={generatedCSSText}
                                language="css"
                                options={{
                                    ...editorOptions,
                                    readOnly: true
                                }}
                            />
                        </div>
                        {previewErrorEvent &&
                            <div className="abs full bg:red-95@dark bg:red-5@light fg:red inset:0 p:12x">
                                <h2 className="font:20">Error at line {previewErrorEvent.lineno === 1 ? 1 : previewErrorEvent.lineno - 1}</h2>
                                <div className="bg:black/.2@dark bg:red-90@light font:14 font:medium my:20 p:15|20 r:5">
                                    {previewErrorEvent.message}
                                </div>
                                <div className="font:12">{previewErrorEvent.datetime.toLocaleTimeString()} {previewErrorEvent.datetime.toDateString()}, {previewErrorEvent.filename}</div>
                            </div>
                        }
                    </Resizable>
                </div>
            </div>
        </div >
    )
}

export interface PlayShare {
    files: PlayShareFile[]
    dependencies: PlayShareDependencies
    version: string
    links: string[]
    createdAt: number
}

export interface PlayShareFile {
    title?: string
    name?: string
    language?: 'html' | 'javascript' | 'css' | 'plaintext'
    path?: string
    content?: string
    priority?: 'low'
    id?: string
}

export interface PlayShareDependencies {
    styles: any[]
    scripts: any[]
}
