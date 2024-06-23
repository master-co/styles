import defineVisitors from '../utils/define-visitors'
import resolveContext from '../utils/resolve-context'
import findLoc from '../utils/find-loc'
import { parseNodeRecursive } from '../utils/parse-node-recursive'
import createRule from '../create-rule'
import settingsSchema from '../settings-schema'
import { validate } from '@master/css-validator'

export default createRule({
    name: 'syntax-error-checks',
    meta: {
        type: 'problem',
        docs: {
            description: 'Detect syntax errors early when writing classes',
            recommended: 'recommended'
        },
        messages: {
            invalidClass: '{{message}}',
            disallowUnknownClass: '{{message}}',
        },
        fixable: null,
        schema: [settingsSchema]
    },
    defaultOptions: [],
    create: function (context) {
        const { options, settings, css } = resolveContext(context)
        const visitNode = (node, arg = null) => {
            parseNodeRecursive(
                node,
                arg,
                (classNames, node) => {
                    const sourceCode = context.sourceCode
                    const sourceCodeLines = sourceCode.lines
                    const nodeStartLine = node.loc.start.line
                    const nodeStartColumn = node.loc.start.column
                    const nodeEndLine = node.loc.end.line
                    const nodeEndColumn = node.loc.end.column

                    for (const className of classNames) {
                        const { matched, errors } = validate(className, css)
                        if (errors.length > 0) {
                            for (const error of errors) {
                                if (matched) {
                                    context.report({
                                        loc: findLoc(className, sourceCodeLines, nodeStartLine, nodeStartColumn, nodeEndLine, nodeEndColumn),
                                        messageId: 'invalidClass',
                                        data: {
                                            message: error.message + '.',
                                        }
                                    })
                                } else if (options.disallowUnknownClass) {
                                    context.report({
                                        loc: findLoc(className, sourceCodeLines, nodeStartLine, nodeStartColumn, nodeEndLine, nodeEndColumn),
                                        messageId: 'disallowUnknownClass',
                                        data: {
                                            message: `"${className}" is not a valid or known class.`
                                        }
                                    })
                                }
                            }
                        }
                    }
                },
                false,
                false,
                settings.ignoredKeys,
                context
            )
        }
        return defineVisitors({ context, settings }, visitNode)
    },
})