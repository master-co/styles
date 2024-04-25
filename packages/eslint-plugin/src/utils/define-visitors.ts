import { TSESTree } from '@typescript-eslint/utils'
import type { RuleContext, RuleListener } from '@typescript-eslint/utils/ts-eslint'
import { Settings } from '../settings'

export default function defineVisitors({ context, settings }: { context: RuleContext<any, any[]>, settings: Settings }, visitNode: (node: TSESTree.Node, args?: any) => void): RuleListener {
    const classAttributeRegex = new RegExp(`^(?:${settings.classAttributes.join('|')})$`)
    const classFunctionsRegex = new RegExp(`^(?:${settings.classFunctions.join('|')})`)
    const classDeclarationsRegex = new RegExp(`^(?:${settings.classDeclarations.join('|')})$`)
    const isFnNode = (node) => {
        let calleeName = ''
        const calleeNode = node.callee || node.tag
        if (calleeNode.type === 'Identifier') {
            calleeName = calleeNode.name
        }
        if (calleeNode.type === 'MemberExpression') {
            calleeName = `${calleeNode.object.name}.${calleeNode.property.name}`
        }
        return classFunctionsRegex.test(calleeName)
    }
    const CallExpression = function (node) {
        if (!isFnNode(node)) {
            return
        }
        node.arguments.forEach((arg) => {
            visitNode(node, arg)
        })
    }
    const scriptVisitor: RuleListener = {
        CallExpression,
        JSXAttribute: function (node: any) {
            if (!node.name || !classAttributeRegex.test(node.name.name)) return
            if (node.value && node.value.type === 'Literal') {
                visitNode(node)
            } else if (node.value && node.value.type === 'JSXExpressionContainer') {
                visitNode(node, node.value.expression)
            }
        },
        SvelteAttribute: function (node: any) {
            if (!node.key?.name || !classAttributeRegex.test(node.key.name)) return
            for (const eachValue of node.value) {
                visitNode(node, eachValue)
            }
        },
        TextAttribute: function (node: any) {
            if (!node.name || !classAttributeRegex.test(node.name)) return
            visitNode(node)
        },
        TaggedTemplateExpression: function (node) {
            if (isFnNode(node)) {
                visitNode(node, node.quasi)
                return
            }
        },
        VariableDeclaration: function (node) {
            node.declarations.forEach((decl) => {
                if (decl.id.type === 'Identifier' && classDeclarationsRegex.test(decl.id.name)) {
                    visitNode(node, decl.init)
                }
            })
        },
        ObjectExpression: function (node) {
            node.properties.forEach((prop) => {
                if (prop.type === 'Property' && prop.key.type === 'Identifier' && classDeclarationsRegex.test(prop.key.name)) {
                    visitNode(node, prop.value)
                }
            })
        },
    }
    const templateBodyVisitor: RuleListener = {
        CallExpression,
        VAttribute: function (node: any) {
            if (node.value && node.value.type === 'VLiteral') {
                visitNode(node)
            } else if (node.value && node.value.type === 'VExpressionContainer' && node.value.expression?.type === 'ArrayExpression') {
                node.value.expression.elements.forEach((arg) => {
                    visitNode(node, arg)
                })
            } else if (node.value && node.value.type === 'VExpressionContainer' && node.value.expression?.type === 'ObjectExpression') {
                node.value.expression.properties.forEach((prop) => {
                    visitNode(node, prop)
                })
            }
        },
    }

    // @ts-expect-error defineTemplateBodyVisitor
    if (context.sourceCode.parserServices == null || context.sourceCode.parserServices.defineTemplateBodyVisitor == null) {
        return scriptVisitor
    } else {
        // @ts-expect-error defineTemplateBodyVisitor
        return context.sourceCode.parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor)
    }
}