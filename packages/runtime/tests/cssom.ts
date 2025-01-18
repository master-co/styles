import cssom from 'cssom'
import * as csstree from 'css-tree'

export function parseCSS(cssText: string) {
    // Parse the entire CSS using csstree for outer structure
    const ast = csstree.parse(cssText)
    // Extract CSSLayerStatementRule, CSSLayerBlockRule, and KeyframesRule
    const cssRules: {
        cssText?: string;
        constructor: { name: string };
        name?: string;
        cssRules?: cssom.CSSRule[]
    }[] = []
    let layerStatementRule
    const layerBlockRules: any = {}
    const keyframesRules: any = {}
    csstree.walk(ast, {
        visit: 'Atrule',
        enter(node) {
            if (node.name === 'layer') {
                if (node.block === null) {
                    layerStatementRule = {
                        constructor: {
                            name: 'CSSLayerStatementRule'
                        },
                        cssText: csstree.generate(node)
                    }
                    cssRules.push(layerStatementRule)
                } else {
                    // Handle CSSLayerBlockRule with cssom for inner content
                    const layerName = csstree.generate(node.prelude!)
                    const layerContent = csstree.generate(node.block).slice(1, -1)
                    const parsedLayerContent = cssom.parse(layerContent)
                    layerBlockRules[layerName] = {
                        constructor: {
                            name: 'CSSLayerBlockRule'
                        },
                        name: layerName,
                        cssRules: parsedLayerContent.cssRules
                    }
                    cssRules.push(layerBlockRules[layerName])
                }
            } else if (node.name === 'keyframes') {
                const keyframesRule = cssom.parse(csstree.generate(node)).cssRules[0] as cssom.CSSKeyframesRule
                keyframesRules[keyframesRule.name] = keyframesRule
                cssRules.push(keyframesRule)
            }
        }
    })
    return {
        cssRules,
        layerStatementRule,
        layerBlockRules,
        keyframesRules
    }
}