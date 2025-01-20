import { MasterCSS, config as defaultConfig, Rule, SyntaxLayer } from '@master/css'
import { type Config, SyntaxRule } from '@master/css'

import './types/global'

export class RuntimeCSS extends MasterCSS {
    readonly host: Element
    readonly observing = false
    readonly progressive = false
    readonly container: HTMLElement | ShadowRoot
    observer?: MutationObserver | null
    constructor(
        public root: Document | ShadowRoot = document,
        public customConfig: Config = defaultConfig
    ) {
        super(customConfig)
        const existingRuntimeCSS = (globalThis as any).runtimeCSSs.find((eachCSS: RuntimeCSS) => eachCSS.root === this.root)
        if (existingRuntimeCSS) throw new Error('Cannot create multiple RuntimeCSS instances for the same root element.')
        const rootConstructorName = this.root?.constructor.name
        if (rootConstructorName === 'HTMLDocument' || rootConstructorName === 'Document') {
            // @ts-ignore
            (this.root as Document).defaultView.globalThis.runtimeCSS = this
            this.container = (this.root as Document).head
            this.host = (this.root as Document).documentElement
        } else {
            this.container = this.root as RuntimeCSS['container']
            this.host = (this.root as ShadowRoot).host
        }
        runtimeCSSs.push(this)
    }

    /**
     * Observe the DOM for changes and update the running stylesheet. (browser only)
     * @param options mutation observer options
     * @returns this
     */
    observe(options: MutationObserverInit = { subtree: true, childList: true }) {
        if (this.observing) return this
        if (this.root.styleSheets)
            for (const sheet of this.root.styleSheets) {
                const { ownerNode } = sheet
                if (ownerNode && (ownerNode as HTMLStyleElement).id === 'master') {
                    this.style = ownerNode as HTMLStyleElement
                    // @ts-ignore
                    this.progressive = true
                    break
                }
            }
        if (this.progressive) {
            this.hydrate(this.style!.sheet!.cssRules)
        } else {
            this.style = document.createElement('style')
            this.style.id = 'master'
            this.container.append(this.style)
            this.style.sheet!.insertRule(this.layerStatementRule.text)
            this.layerStatementRule.nodes[0].native = this.style!.sheet!.cssRules.item(0) as CSSLayerStatementRule
        }

        const handleClassList = (classList: DOMTokenList) => {
            classList.forEach((className) => {
                if (Object.prototype.hasOwnProperty.call(this.classesUsage, className)) {
                    this.classesUsage[className]++
                } else {
                    this.classesUsage[className] = 1
                    this.add(className)
                }
            })
        }

        handleClassList(this.host.classList)

        if (options.subtree) {
            /**
             * 待所有 DOM 結構完成解析後，開始繪製 Rule 樣式
             */
            ((this.root.constructor.name === 'HTMLDocument') ? this.host : this.container)
                .querySelectorAll('[class]')
                .forEach((element) => handleClassList(element.classList))
        }

        this.observer = new MutationObserver((mutationRecords) => {
            // console.time('css engine');
            const correctionOfClassName: Record<string, number> = {}
            const attributeMutationRecords: MutationRecord[] = []
            const updatedElements: Element[] = []
            const unchangedElements: Element[] = []

            /**
            * 取得所有深層後代的 class names
            */
            const handleClassNameDeeply = (element: Element, remove: boolean) => {
                if (remove) {
                    element.classList.forEach(removeClassName)
                } else {
                    element.classList.forEach(addClassName)
                }
                const children = element.children
                for (const eachChildren of children) {
                    if (eachChildren.classList && !updatedElements.includes(eachChildren)) {
                        updatedElements.push(eachChildren)
                        handleClassNameDeeply(eachChildren, remove)
                    }
                }
            }

            const addClassName = (className: string) => {
                if (Object.prototype.hasOwnProperty.call(correctionOfClassName, className)) {
                    correctionOfClassName[className]++
                } else {
                    correctionOfClassName[className] = 1
                }
            }

            const removeClassName = (className: string) => {
                if (Object.prototype.hasOwnProperty.call(correctionOfClassName, className)) {
                    correctionOfClassName[className]--
                } else if (Object.prototype.hasOwnProperty.call(this.classesUsage, className)) {
                    correctionOfClassName[className] = -1
                }
            }

            const handleNodes = (nodes: HTMLCollection, remove: boolean) => {
                for (const eachNode of nodes) {
                    if (eachNode.classList && !updatedElements.includes(eachNode) && !unchangedElements.includes(eachNode)) {
                        if (eachNode.isConnected !== remove) {
                            updatedElements.push(eachNode)
                            handleClassNameDeeply(eachNode, remove)
                        } else {
                            unchangedElements.push(eachNode)
                        }
                    }
                }
            }

            for (const mutationRecord of mutationRecords) {
                const { addedNodes, removedNodes, type, target } = mutationRecord
                if (type === 'attributes') {
                    /**
                     * 防止同樣的 MutationRecord 重複執行
                     * According to this history,
                     * MutationObserver was designed to work that way.
                     * Any call to setAttribute triggers a mutation,
                     * regardless of whether the value is being changed or set to the current value
                     */
                    if (attributeMutationRecords.find((eachAttributeMutationRecord) => eachAttributeMutationRecord.target === target)) {
                        continue
                    } else {
                        /**
                         * 第一個匹配到的 oldValue 一定是該批變動前的原始狀態值
                         */
                        attributeMutationRecords.push(mutationRecord)
                    }
                } else {
                    // 先判斷節點新增或移除
                    handleNodes(addedNodes as any, false)

                    // 忽略處理新元素的已刪除子節點
                    if (!target.isConnected || !updatedElements.includes(target as any)) {
                        handleNodes(removedNodes as any, true)
                    }
                }
            }

            if (!attributeMutationRecords.length && !Object.keys(correctionOfClassName).length) {
                // console.timeEnd('css engine');
                return
            }

            for (const { oldValue, target } of attributeMutationRecords) {
                /**
                 * 如果被操作的元素中包含了屬性變更的目標，
                 * 則將該目標從 existedAttributeMutationTargets 中移除，
                 * 以防止執行接下來的屬性變更處理
                 *
                 * 該批 mutationRecords 中，某個 target 同時有 attribute 及 childList 的變更，
                 * 則以 childList 節點插入及移除的 target.className 為主
                 */
                const updated = updatedElements.includes(target as Element)
                const classNames = (target as Element).classList
                const oldClassNames = oldValue ? oldValue.split(' ') : []
                if (updated) {
                    if (target.isConnected) {
                        continue
                    } else {
                        for (const oldClassName of oldClassNames) {
                            if (!classNames.contains(oldClassName)) {
                                removeClassName(oldClassName)
                            }
                        }
                    }
                } else if (target.isConnected) {
                    classNames.forEach((className) => {
                        if (!oldClassNames.includes(className)) {
                            addClassName(className)
                        }
                    })
                    for (const oldClassName of oldClassNames) {
                        if (!classNames.contains(oldClassName)) {
                            removeClassName(oldClassName)
                        }
                    }
                }
            }

            for (const className in correctionOfClassName) {
                const correction = correctionOfClassName[className]
                const count = (this.classesUsage[className] || 0) + correction
                if (count === 0) {
                    // remove
                    delete this.classesUsage[className]
                    /**
                     * class name 從 DOM tree 中被移除，
                     * 匹配並刪除對應的 rule
                     */
                    this.remove(className)
                } else {
                    if (!(Object.prototype.hasOwnProperty.call(this.classesUsage, className))) {
                        // add
                        /**
                         * 新 class name 被 connected 至 DOM tree，
                         * 匹配並創建對應的 Rule
                         */
                        this.add(className)
                    }

                    this.classesUsage[className] = count
                }
            }
        })

        this.observer.observe(this.root, {
            ...options,
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['class'],
        });

        (this.host as HTMLElement).style.removeProperty('display')
        // @ts-ignore
        this.observing = true
        return this
    }

    hydrate(nativeCSSRules: CSSRuleList) {
        const cssSyntaxLayerBlockRules: CSSLayerBlockRule[] = []
        for (let i = 0; i < nativeCSSRules.length; i++) {
            const eachNativeCSSRule = nativeCSSRules[i]
            if (eachNativeCSSRule.constructor.name === 'CSSLayerBlockRule') {
                const cssLayerBlockRule = eachNativeCSSRule as CSSLayerBlockRule
                if ((eachNativeCSSRule as CSSLayerBlockRule).name === 'theme') {
                    this.themeLayer.native = cssLayerBlockRule
                    let variableRule: Rule | undefined
                    let lastVariableName: string | undefined
                    for (let j = 0; j < cssLayerBlockRule.cssRules.length; j++) {
                        const cssRule = cssLayerBlockRule.cssRules[j]
                        const variableCSSRule = (cssRule.constructor.name === 'CSSMediaRule'
                            ? (cssRule as CSSMediaRule).cssRules[0]
                            : cssRule) as CSSStyleRule
                        const variableName = variableCSSRule.style[0].slice(2)
                        if (variableName !== lastVariableName) {
                            lastVariableName = variableName
                            variableRule = new Rule(variableName)
                            this.themeLayer.rules.push(variableRule)
                            this.themeLayer.usages[variableRule.name] = 0
                        }
                        variableRule?.nodes.push({
                            native: cssRule,
                            text: cssRule.cssText
                        })
                    }
                    if (this.themeLayer.rules.length) this.rules.push(this.themeLayer)
                } else {
                    cssSyntaxLayerBlockRules.push(cssLayerBlockRule)
                }
            } else if (eachNativeCSSRule.constructor.name === 'CSSLayerStatementRule') {
                this.layerStatementRule.nodes[0].native = eachNativeCSSRule as CSSLayerStatementRule
            } else if (eachNativeCSSRule.constructor.name === 'CSSKeyframesRule') {
                const keyframsRule = eachNativeCSSRule as CSSKeyframesRule
                const animationRule = new Rule(keyframsRule.name, [{
                    native: keyframsRule,
                    text: keyframsRule.cssText
                }])
                this.animationsNonLayer.rules.push(animationRule)
                this.rules.push(animationRule)
                this.animationsNonLayer.usages[animationRule.name] = 0
            }
        }

        for (const cssLayerBlockRule of cssSyntaxLayerBlockRules) {
            const handleSyntaxLayer = (layer: SyntaxLayer) => {
                layer.native = cssLayerBlockRule
                for (let j = 0; j < cssLayerBlockRule.cssRules.length; j++) {
                    const cssRule = cssLayerBlockRule.cssRules[j] as CSSStyleRule
                    const createSyntaxRule = (cssRule: CSSStyleRule): SyntaxRule | undefined => {
                        if (cssRule.selectorText) {
                            const syntaxRule = this.createFromSelectorText(cssRule.selectorText)[0]
                            if (syntaxRule) return syntaxRule
                        } else if (cssRule.cssRules) {
                            for (const eachCSSRule of cssRule.cssRules) {
                                const syntaxRule = createSyntaxRule(eachCSSRule as CSSStyleRule)
                                if (syntaxRule) return syntaxRule
                            }
                        }
                    }
                    const syntaxRule = createSyntaxRule(cssRule)
                    if (syntaxRule) {
                        layer.rules.push(syntaxRule)
                        layer.insertVariables(syntaxRule)
                        layer.insertAnimations(syntaxRule)
                        for (const eachNode of syntaxRule.nodes) {
                            if (!eachNode.native) eachNode.native = cssRule
                        }
                    } else {
                        cssLayerBlockRule.deleteRule?.(j--)
                        console.error(`Cannot recognize the CSS rule in the ${layer.name} layer. \`${cssRule.cssText}\` (https://rc.css.master.co/messages/hydration-errors)`)
                    }
                }
                for (const eachRule of layer.rules) {
                    for (let k = eachRule.nodes.length - 1; k >= 0; k--) {
                        if (!eachRule.nodes[k].native) {
                            eachRule.nodes.splice(k, 1)
                        }
                    }
                }
                if (layer.rules.length) this.rules.push(layer)
            }
            switch (cssLayerBlockRule.name) {
                case 'base':
                    handleSyntaxLayer(this.baseLayer)
                    break
                case 'preset':
                    handleSyntaxLayer(this.presetLayer)
                    break
                case 'components':
                    this.componentsLayer.native = cssLayerBlockRule
                    let stylePreText: string
                    const createSyntaxRules = (cssRule: any): SyntaxRule[] | undefined => {
                        if (cssRule.selectorText) {
                            const syntaxRules = this.createFromSelectorText(cssRule.selectorText)
                            if (syntaxRules.length) {
                                stylePreText = cssRule.selectorText + '{'
                                return syntaxRules
                            }
                        } else if (cssRule.cssRules) {
                            for (const eachCSSRule of cssRule.cssRules) {
                                const syntaxRules = this.createFromSelectorText((eachCSSRule as CSSStyleRule).selectorText)
                                if (syntaxRules) return syntaxRules
                            }
                        }
                    }
                    for (let j = 0; j < cssLayerBlockRule.cssRules.length; j++) {
                        const cssRule = cssLayerBlockRule.cssRules[j] as CSSStyleRule
                        const syntaxRules = createSyntaxRules(cssRule)
                        if (syntaxRules) {
                            let matched = false
                            for (const eachSyntaxRule of syntaxRules) {
                                for (const node of eachSyntaxRule.nodes) {
                                    if (!node.native && node.text.includes(stylePreText!)) {
                                        node.native = cssRule
                                        if (!this.componentsLayer.rules.includes(eachSyntaxRule)) {
                                            this.componentsLayer.rules.push(eachSyntaxRule)
                                            this.componentsLayer.insertVariables(eachSyntaxRule)
                                            this.componentsLayer.insertAnimations(eachSyntaxRule)
                                        }
                                        matched = true
                                        break
                                    }
                                }
                                if (matched)
                                    break
                            }
                        } else {
                            cssLayerBlockRule?.deleteRule?.(j--)
                            console.error(`Cannot recognize the CSS rule in the components layer. \`${cssRule.cssText}\` (https://rc.css.master.co/messages/hydration-errors)`)
                        }
                    }
                    for (const eachRule of this.componentsLayer.rules) {
                        for (let k = eachRule.nodes.length - 1; k >= 0; k--) {
                            if (!eachRule.nodes[k].native) {
                                eachRule.nodes.splice(k, 1)
                            }
                        }
                    }
                    if (this.componentsLayer.rules.length) this.rules.push(this.componentsLayer)
                    break
                case 'general':
                    handleSyntaxLayer(this.generalLayer)
                    break
            }
        }
    }

    disconnect() {
        if (!this.observing) return
        if (this.observer) {
            this.observer.disconnect()
            this.observer = null
        }
        // @ts-ignore
        this.observing = false
        this.reset()
        // @ts-expect-error
        this.classesUsage = {}
        if (!this.progressive) {
            this.style?.remove()
            this.style = null
        }
        return this
    }

    refresh(customConfig = this.customConfig) {
        if (!this.observing || !this.style!.sheet) return this
        for (let i = 1; i <= this.style!.sheet.cssRules.length - 1; i++) {
            this.style!.sheet.deleteRule(i)
        }
        super.refresh(customConfig)
        return this
    }

    destroy() {
        this.disconnect()
        runtimeCSSs.splice(runtimeCSSs.indexOf(this), 1)
        return this
    }
}

export const runtimeCSSs: RuntimeCSS[] = [];

(() => {
    globalThis.RuntimeCSS = RuntimeCSS
    globalThis.runtimeCSSs = runtimeCSSs
})()