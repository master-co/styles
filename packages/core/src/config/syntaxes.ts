import cssEscape from 'shared/utils/css-escape'
import type { SyntaxRule } from '../syntax-rule'
import SyntaxType from '../syntax-type'
import { BORDER_STYLE_VALUES, COLOR_VALUE_REGEX, IMAGE_VALUE_REGEX, NUMBER_VALUE_REGEX, VALUE_DELIMITERS } from '../common'
import autofillSolidStyle from '../utils/autofill-solid-style'
import { SyntaxDefinition } from '../syntax-rule'

const syntaxes = {
    group: {
        matcher: /^(?:.+?[*_>~+])?\{.+?\}/,
        syntaxType: SyntaxType.Shorthand,
        analyze(className: string) {
            let i = 0
            for (; i < className.length; i++) {
                if (className[i] === '{' && className[i - 1] !== '\\') {
                    break
                }
            }
            return [className.slice(i), className.slice(0, i)]
        },
        declare(value) {
            const declarations: any = {}
            const addProp = (propertyName: string) => {
                const indexOfColon = propertyName.indexOf(':')
                if (indexOfColon !== -1) {
                    const propName = propertyName.slice(0, indexOfColon)
                    declarations[propName] = propertyName.slice(indexOfColon + 1)
                }
            }
            const handleRule = (rule: SyntaxRule) => {
                const addProps = (cssText: string) => {
                    const cssProperties = cssText.slice(cssEscape(rule.name).length).match(/\{(.*)\}/)?.[1].split(';')
                    if (cssProperties)
                        for (const eachCssProperty of cssProperties) {
                            addProp(eachCssProperty)
                        }
                }

                for (const eachNative of rule.natives) {
                    addProps(eachNative.text)
                }

                // animation
                if (rule.animationNames) {
                    if (!this.animationNames) {
                        this.animationNames = []
                    }
                    for (const eachKeyframeName of rule.animationNames) {
                        if (!this.animationNames.includes(eachKeyframeName)) {
                            this.animationNames.push(eachKeyframeName)
                        }
                    }
                }

                // variable
                if (rule.variableNames) {
                    if (!this.variableNames) {
                        this.variableNames = []
                    }
                    for (const eachVariableName of rule.variableNames) {
                        if (!this.variableNames.includes(eachVariableName)) {
                            this.variableNames.push(eachVariableName)
                        }
                    }
                }
            }

            const names: string[] = []
            let currentName = ''
            const addName = () => {
                if (currentName) {
                    names.push(currentName.replace(/ /g, '|'))
                    currentName = ''
                }
            }

            let i = 1;
            (function analyze(end: string) {
                for (; i < value.length; i++) {
                    const char = value[i]

                    if (!end) {
                        if (char === ';') {
                            addName()
                            continue
                        }
                        if (char === '}') {
                            break
                        }
                    }

                    currentName += char

                    if (end === char) {
                        if (end === '\'' || end === '"') {
                            let count = 0
                            for (let j = currentName.length - 2; ; j--) {
                                if (currentName[j] !== '\\') {
                                    break
                                }
                                count++
                            }
                            if (count % 2) {
                                continue
                            }
                        }

                        break
                    } else if (char in VALUE_DELIMITERS && (end !== '\'' && end !== '"')) {
                        i++
                        analyze(VALUE_DELIMITERS[char as keyof typeof VALUE_DELIMITERS])
                    }
                }
            })('')

            addName()

            for (const eachName of names) {
                const syntaxes = this.css.generate(eachName, this.mode)
                if (syntaxes.length) {
                    for (const eachRule of syntaxes) {
                        handleRule(eachRule)
                    }
                } else {
                    addProp(eachName)
                }
            }

            return declarations
        }
    } as SyntaxDefinition,
    variable: {
        matcher: /^\$[\w-]+:/, // don't use 'rem' as default, because css variable is common API
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                ['--' + this.keyToken.slice(1, -1)]: value
            }
        }
    } as SyntaxDefinition,
    'font-size': {
        ambiguousKeys: ['font', 'f'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'font-weight': {
        ambiguousKeys: ['font', 'f'],
        ambiguousValues: ['bolder'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'font-family': {
        ambiguousKeys: ['font', 'f'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'font-smoothing': {
        ambiguousKeys: ['font', 'f'],
        ambiguousValues: ['antialiased', 'subpixel-antialiased'],
        syntaxType: SyntaxType.Native,
        declare(value) {
            switch (value) {
                case 'subpixel-antialiased':
                    return {
                        '-webkit-font-smoothing': 'auto',
                        '-moz-osx-font-smoothing': 'auto'
                    }
                case 'antialiased':
                    return {
                        '-webkit-font-smoothing': 'antialiased',
                        '-moz-osx-font-smoothing': 'grayscale'
                    }
            }
        }
    } as SyntaxDefinition,
    'font-style': {
        ambiguousKeys: ['font', 'f'],
        ambiguousValues: ['normal', 'italic', 'oblique'],
        syntaxType: SyntaxType.Native,
        unit: 'deg'
    } as SyntaxDefinition,
    'font-variant-numeric': {
        ambiguousKeys: ['font', 'f'],
        ambiguousValues: ['ordinal', 'slashed-zero', 'lining-nums', 'oldstyle-nums', 'proportional-nums', 'tabular-nums', 'diagonal-fractions', 'stacked-fractions'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'font-variant': {
        ambiguousKeys: ['font', 'f'],
        syntaxType: SyntaxType.NativeShorthand,
    },
    font: {
        subkey: 'f',
        syntaxType: SyntaxType.NativeShorthand,
        variables: [
            'font-family',
            'font-variant',
            'font-weight',
            'font-size',
            'font-style',
            'line-height'
        ]
    } as SyntaxDefinition,
    'font-feature-settings': {
        key: 'font-feature',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    color: {
        key: 'fg',
        syntaxType: SyntaxType.Native,
        variables: ['text']
    } as SyntaxDefinition,
    // margin
    'margin-left': {
        key: 'ml',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-right': {
        key: 'mr',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-top': {
        key: 'mt',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-bottom': {
        key: 'mb',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-x': {
        key: 'mx',
        subkey: 'margin-x',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'margin-left': value,
                'margin-right': value
            }
        },
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-y': {
        key: 'my',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'margin-top': value,
                'margin-bottom': value
            }
        },
        variables: ['spacing']
    } as SyntaxDefinition,
    margin: {
        key: 'm',
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // margin inline
    'margin-inline-start': {
        key: 'mis',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-inline-end': {
        key: 'mie',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-inline': {
        key: 'mi',
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // padding
    'padding-left': {
        key: 'pl',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-right': {
        key: 'pr',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-top': {
        key: 'pt',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-bottom': {
        key: 'pb',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-x': {
        key: 'px',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'padding-left': value,
                'padding-right': value
            }
        },
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-y': {
        key: 'py',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'padding-top': value,
                'padding-bottom': value
            }
        },
        variables: ['spacing']
    } as SyntaxDefinition,
    padding: {
        key: 'p',
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // padding inline
    'padding-inline-start': {
        key: 'pis',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-inline-end': {
        key: 'pie',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-inline': {
        key: 'pi',
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // flex
    'flex-basis': {
        ambiguousKeys: ['flex'],
        unit: 'rem',
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'flex-wrap': {
        ambiguousKeys: ['flex'],
        ambiguousValues: ['wrap', 'nowrap', 'wrap-reverse'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'flex-grow': {
        ambiguousKeys: ['flex'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'flex-shrink': {
        ambiguousKeys: ['flex'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'flex-direction': {
        ambiguousKeys: ['flex'],
        ambiguousValues: ['row', 'row-reverse', 'column', 'column-reverse'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    flex: {
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    display: {
        key: 'd',
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    width: {
        key: 'w',
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    height: {
        key: 'h',
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'min-width': {
        key: 'min-w',
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'min-height': {
        key: 'min-h',
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    size: {
        syntaxType: SyntaxType.Shorthand,
        unit: 'rem',
        declare(_value, valueComponents) {
            const length = valueComponents.length
            return {
                width: length === 1
                    ? valueComponents[0].text
                    : valueComponents[0].text,
                height: length === 1
                    ? valueComponents[0].text
                    : valueComponents[2].text
            }
        }
    } as SyntaxDefinition,
    'min-size': {
        key: 'min',
        syntaxType: SyntaxType.Shorthand,
        unit: 'rem',
        declare(_value, valueComponents) {
            const length = valueComponents.length
            return {
                'min-width': length === 1
                    ? valueComponents[0].text
                    : valueComponents[0].text,
                'min-height': length === 1
                    ? valueComponents[0].text
                    : valueComponents[2].text
            }
        }
    } as SyntaxDefinition,
    'max-size': {
        key: 'max',
        syntaxType: SyntaxType.Shorthand,
        unit: 'rem',
        declare(_value, valueComponents) {
            const length = valueComponents.length
            return {
                'max-width': length === 1
                    ? valueComponents[0].text
                    : valueComponents[0].text,
                'max-height': length === 1
                    ? valueComponents[0].text
                    : valueComponents[2].text
            }
        }
    } as SyntaxDefinition,
    'box-sizing': {
        ambiguousKeys: ['box'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'box-decoration-break': {
        key: 'box-decoration',
        syntaxType: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-box-decoration-break': value,
                'box-decoration-break': value,
            }
        }
    } as SyntaxDefinition,
    contain: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    content: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'counter-increment': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'counter-reset': {
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'letter-spacing': {
        key: 'tracking',
        subkey: 'ls',
        syntaxType: SyntaxType.Native,
        unit: 'em'
    } as SyntaxDefinition,
    'line-height': {
        key: 'leading',
        subkey: 'line-h',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'object-fit': {
        ambiguousKeys: ['object', 'obj'],
        ambiguousValues: ['contain', 'cover', 'fill', 'scale-down'],
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'object-position': {
        ambiguousKeys: ['object', 'obj'],
        ambiguousValues: ['top', 'bottom', 'right', 'left', 'center'],
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-align': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['justify', 'center', 'left', 'right', 'start', 'end'],
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-decoration-color': {
        ambiguousKeys: ['text-decoration'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.Native,
        variables: ['text']
    } as SyntaxDefinition,
    'text-decoration-style': {
        ambiguousKeys: ['text-decoration'],
        ambiguousValues: ['solid', 'double', 'dotted', 'dashed', 'wavy'],
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-decoration-thickness': {
        ambiguousKeys: ['text-decoration'],
        ambiguousValues: ['from-font', NUMBER_VALUE_REGEX],
        syntaxType: SyntaxType.Native,
        unit: 'em'
    } as SyntaxDefinition,
    'text-decoration-line': {
        ambiguousKeys: ['text-decoration'],
        ambiguousValues: ['underline', 'overline', 'line-through'],
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-decoration': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['underline', 'overline', 'line-through'],
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand,
        variables: ['text'],
        declare(value) {
            return {
                '-webkit-text-decoration': value,
                'text-decoration': value,
            }
        },
    } as SyntaxDefinition,
    'text-underline-offset': {
        ambiguousKeys: ['text-underline'],
        unit: 'rem',
        syntaxType: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    'text-underline-position': {
        ambiguousKeys: ['text-underline'],
        ambiguousValues: ['front-font', 'under', 'left', 'right'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'text-overflow': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['ellipsis', 'clip'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'text-orientation': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['mixed', 'upright', 'sideways-right', 'sideways', 'use-glyph-orientation'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'text-transform': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['uppercase', 'lowercase', 'capitalize'],
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-rendering': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['optimizeSpeed', 'optimizeLegibility', 'geometricPrecision'],
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-wrap': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['wrap', 'nowrap', 'balance', 'pretty'],
        syntaxType: SyntaxType.NativeShorthand,
    } as SyntaxDefinition,
    'text-indent': {
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'vertical-align': {
        key: 'v',
        subkey: 'vertical',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    columns: {
        key: 'cols',
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'white-space': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    top: {
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    bottom: {
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    left: {
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    right: {
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    inset: {
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    'max-height': {
        key: 'max-h',
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'max-width': {
        key: 'max-w',
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    opacity: {
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    visibility: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    clear: {
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    float: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    isolation: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'overflow-x': {
        syntaxType: SyntaxType.Native,
        declare(value) {
            return value === 'overlay'
                ? { 'overflow-x': ['auto', value] }
                : { 'overflow-x': value }
        }
    } as SyntaxDefinition,
    'overflow-y': {
        syntaxType: SyntaxType.Native,
        declare(value) {
            return value === 'overlay'
                ? { 'overflow-y': ['auto', value] }
                : { 'overflow-y': value }
        }
    } as SyntaxDefinition,
    overflow: {
        syntaxType: SyntaxType.NativeShorthand,
        declare(value) {
            return value === 'overlay'
                ? { overflow: ['auto', value] }
                : { overflow: value }
        }
    } as SyntaxDefinition,
    'overscroll-behavior-x': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'overscroll-behavior-y': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'overscroll-behavior': {
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'z-index': {
        key: 'z',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    position: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    cursor: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'pointer-events': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    resize: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'touch-action': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'word-break': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'word-spacing': {
        syntaxType: SyntaxType.Native,
        unit: 'em'
    } as SyntaxDefinition,
    'user-drag': {
        syntaxType: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-user-drag': value,
                'user-drag': value,
            }
        }
    } as SyntaxDefinition,
    'user-select': {
        syntaxType: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-user-select': value,
                'user-select': value,
            }
        }
    } as SyntaxDefinition,
    'text-shadow': {
        unit: 'rem',
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-size': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        declare(value) {
            const diff = .875
            return {
                'font-size': value,
                'line-height': `calc(${value} + ${diff}em)`
            }
        },
        syntaxType: SyntaxType.Shorthand
    } as SyntaxDefinition,
    'text-fill-color': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.Native,
        variables: ['text'],
        declare(value) {
            return {
                '-webkit-text-fill-color': value
            }
        }
    } as SyntaxDefinition,
    'text-stroke-width': {
        ambiguousKeys: ['text-stroke'],
        ambiguousValues: ['thin', 'medium', 'thick', NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-text-stroke-width': value
            }
        },
    } as SyntaxDefinition,
    'text-stroke-color': {
        ambiguousKeys: ['text-stroke'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-text-stroke-color': value
            }
        }
    } as SyntaxDefinition,
    'text-stroke': {
        unit: 'rem',
        syntaxType: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-text-stroke': value
            }
        }
    } as SyntaxDefinition,
    'text-truncate': {
        subkey: 'lines',
        declare(value) {
            return {
                display: '-webkit-box',
                '-webkit-box-orient': 'vertical',
                '-webkit-line-clamp': value,
                overflow: 'hidden',
                'overflow-wrap': 'break-word',
                'text-overflow': 'ellipsis',
            }
        },
        syntaxType: SyntaxType.Shorthand,
    } as SyntaxDefinition,
    'box-shadow': {
        key: 'shadow',
        subkey: 's',
        unit: 'rem',
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'table-layout': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'transform-box': {
        ambiguousKeys: ['transform'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'transform-style': {
        ambiguousKeys: ['transform'],
        ambiguousValues: ['flat', 'preserve-3d'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'transform-origin': {
        ambiguousKeys: ['transform'],
        ambiguousValues: ['top', 'bottom', 'right', 'left', 'center', NUMBER_VALUE_REGEX],
        unit: 'px',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    transform: {
        matcher: /^(?:translate|scale|skew|rotate|perspective|matrix)(?:3d|[XYZ])?\(/,
        syntaxType: SyntaxType.Native,
        analyze(className: string) {
            return [className.startsWith('transform') ? className.slice(10) : className]
        },
        unit: 'px',
        variables: ['spacing']
    } as SyntaxDefinition,
    'transition-property': {
        key: '~property',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'transition-timing-function': {
        key: '~easing',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'transition-duration': {
        key: '~duration',
        syntaxType: SyntaxType.Native,
        unit: 'ms'
    } as SyntaxDefinition,
    'transition-delay': {
        key: '~delay',
        syntaxType: SyntaxType.Native,
        unit: 'ms'
    } as SyntaxDefinition,
    transition: {
        sign: '~',
        analyze(className: string) {
            if (className.startsWith('~')) {
                return [className.slice(1)]
            } else {
                const indexOfColon = className.indexOf(':')
                this.keyToken = className.slice(0, indexOfColon + 1)
                return [className.slice(indexOfColon + 1)]
            }
        },
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'animation-delay': {
        key: '@delay',
        syntaxType: SyntaxType.Native,
        unit: 'ms'
    } as SyntaxDefinition,
    'animation-direction': {
        key: '@direction',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'animation-duration': {
        key: '@duration',
        syntaxType: SyntaxType.Native,
        unit: 'ms'
    } as SyntaxDefinition,
    'animation-fill-mode': {
        key: '@fill',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'animation-iteration-count': {
        key: '@iteration',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'animation-name': {
        key: '@name',
        syntaxType: SyntaxType.Native,
        includeAnimations: true
    } as SyntaxDefinition,
    'animation-play-state': {
        key: '@play',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'animation-timing-function': {
        key: '@easing',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    animation: {
        sign: '@',
        syntaxType: SyntaxType.NativeShorthand,
        includeAnimations: true,
        analyze(className: string) {
            if (className.startsWith('@')) {
                return [className.slice(1)]
            } else {
                const indexOfColon = className.indexOf(':')
                this.keyToken = className.slice(0, indexOfColon + 1)
                return [className.slice(indexOfColon + 1)]
            }
        }
    } as SyntaxDefinition,
    'border-collapse': {
        ambiguousKeys: ['b', 'border'],
        ambiguousValues: ['collapse', 'separate'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'border-spacing': {
        unit: 'rem',
        syntaxType: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    // border color
    'border-top-color': {
        ambiguousKeys: ['bt', 'border-top'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.Native,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-bottom-color': {
        ambiguousKeys: ['bb', 'border-bottom'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.Native,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-left-color': {
        ambiguousKeys: ['bl', 'border-left'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.Native,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-right-color': {
        ambiguousKeys: ['br', 'border-right'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.Native,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-x-color': {
        ambiguousKeys: ['bx', 'border-x'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.Shorthand,
        variables: ['frame'],
        declare(value) {
            return {
                'border-left-color': value,
                'border-right-color': value
            }
        }
    } as SyntaxDefinition,
    'border-y-color': {
        ambiguousKeys: ['by', 'border-y'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.Shorthand,
        variables: ['frame'],
        declare(value) {
            return {
                'border-top-color': value,
                'border-bottom-color': value
            }
        }
    } as SyntaxDefinition,
    'border-color': {
        ambiguousKeys: ['b', 'border'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.NativeShorthand,
        variables: ['frame'],
    } as SyntaxDefinition,
    // border radius
    'border-top-left-radius': {
        key: 'rtl',
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'border-top-right-radius': {
        key: 'rtr',
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'border-bottom-left-radius': {
        key: 'rbl',
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'border-bottom-right-radius': {
        key: 'rbr',
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'border-top-radius': {
        key: 'rt',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'border-top-left-radius': value,
                'border-top-right-radius': value
            }
        }
    } as SyntaxDefinition,
    'border-bottom-radius': {
        key: 'rb',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'border-bottom-left-radius': value,
                'border-bottom-right-radius': value
            }
        }
    } as SyntaxDefinition,
    'border-left-radius': {
        key: 'rl',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'border-top-left-radius': value,
                'border-bottom-left-radius': value
            }
        }
    } as SyntaxDefinition,
    'border-right-radius': {
        key: 'rr',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'border-top-right-radius': value,
                'border-bottom-right-radius': value
            }
        }
    } as SyntaxDefinition,
    'border-radius': {
        key: 'r',
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    // border style
    'border-top-style': {
        ambiguousKeys: ['bt', 'border-top'],
        ambiguousValues: BORDER_STYLE_VALUES,
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-bottom-style': {
        ambiguousKeys: ['bb', 'border-bottom'],
        ambiguousValues: BORDER_STYLE_VALUES,
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-left-style': {
        ambiguousKeys: ['bl', 'border-left'],
        ambiguousValues: BORDER_STYLE_VALUES,
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-right-style': {
        ambiguousKeys: ['br', 'border-right'],
        ambiguousValues: BORDER_STYLE_VALUES,
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-x-style': {
        ambiguousKeys: ['bx', 'border-x'],
        ambiguousValues: BORDER_STYLE_VALUES,
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'border-left-style': value,
                'border-right-style': value
            }
        }
    } as SyntaxDefinition,
    'border-y-style': {
        ambiguousKeys: ['by', 'border-y'],
        ambiguousValues: BORDER_STYLE_VALUES,
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'border-top-style': value,
                'border-bottom-style': value
            }
        }
    } as SyntaxDefinition,
    'border-style': {
        ambiguousKeys: ['b', 'border'],
        ambiguousValues: BORDER_STYLE_VALUES,
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    // border width
    'border-top-width': {
        ambiguousKeys: ['bt', 'border-top'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-bottom-width': {
        ambiguousKeys: ['bb', 'border-bottom'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-left-width': {
        ambiguousKeys: ['bl', 'border-left'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-right-width': {
        ambiguousKeys: ['br', 'border-right'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-x-width': {
        ambiguousKeys: ['bx', 'border-x'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'border-left-width': value,
                'border-right-width': value
            }
        }
    } as SyntaxDefinition,
    'border-y-width': {
        ambiguousKeys: ['by', 'border-y'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'border-top-width': value,
                'border-bottom-width': value
            }
        }
    } as SyntaxDefinition,
    'border-width': {
        ambiguousKeys: ['b', 'border'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    // border image
    'border-image-repeat': {
        ambiguousKeys: ['border-image'],
        ambiguousValues: ['stretch', 'repeat', 'round', 'space'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'border-image-slice': {
        ambiguousKeys: ['border-image'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'border-image-source': {
        ambiguousKeys: ['border-image'],
        ambiguousValues: [IMAGE_VALUE_REGEX],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'border-image-width': {
        ambiguousKeys: ['border-image'],
        ambiguousValues: ['auto', NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'border-image-outset': {
        ambiguousKeys: ['border-image'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'border-image': {
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    // border
    'border-top': {
        key: 'bt',
        syntaxType: SyntaxType.NativeShorthand,
        unit: 'rem',
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-bottom': {
        key: 'bb',
        syntaxType: SyntaxType.NativeShorthand,
        unit: 'rem',
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-left': {
        key: 'bl',
        syntaxType: SyntaxType.NativeShorthand,
        unit: 'rem',
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-right': {
        key: 'br',
        syntaxType: SyntaxType.NativeShorthand,
        unit: 'rem',
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-x': {
        key: 'bx',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
        declare(value) {
            return {
                'border-left': value,
                'border-right': value
            }
        }
    } as SyntaxDefinition,
    'border-y': {
        key: 'by',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
        declare(value) {
            return {
                'border-top': value,
                'border-bottom': value
            }
        }
    } as SyntaxDefinition,
    border: {
        key: 'b',
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand,
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
    } as SyntaxDefinition,
    'background-attachment': {
        ambiguousKeys: ['bg'],
        ambiguousValues: ['fixed', 'local', 'scroll'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'background-blend-mode': {
        key: 'bg-blend',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'background-color': {
        ambiguousKeys: ['bg'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'background-clip': {
        key: 'bg-clip',
        syntaxType: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-background-clip': value,
                'background-clip': value
            }
        }
    } as SyntaxDefinition,
    'background-origin': {
        key: 'bg-origin',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'background-position': {
        ambiguousKeys: ['bg'],
        ambiguousValues: ['top', 'bottom', 'right', 'left', 'center'],
        syntaxType: SyntaxType.Native,
        unit: 'px'
    } as SyntaxDefinition,
    'background-repeat': {
        ambiguousKeys: ['bg'],
        ambiguousValues: ['space', 'round', 'repeat', 'no-repeat', 'repeat-x', 'repeat-y'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'background-size': {
        ambiguousKeys: ['bg'],
        ambiguousValues: ['auto', 'cover', 'contain', NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'background-image': {
        ambiguousKeys: ['bg'],
        ambiguousValues: [IMAGE_VALUE_REGEX],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    background: {
        key: 'bg',
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    gradient: {
        matcher: /^gradient\(/,
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'background-image': 'linear-' + value
            }
        }
    } as SyntaxDefinition,
    'mix-blend-mode': {
        key: 'blend',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'backdrop-filter': {
        key: 'bd',
        syntaxType: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-backdrop-filter': value,
                'backdrop-filter': value,
            }
        }
    } as SyntaxDefinition,
    filter: {
        matcher: /^(?:blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|opacity|saturate|sepia)\(/,
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    fill: {
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    'stroke-dasharray': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'stroke-dashoffset': {
        syntaxType: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    'stroke-width': {
        ambiguousKeys: ['stroke'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    stroke: {
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    x: {
        syntaxType: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    y: {
        syntaxType: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    cx: {
        syntaxType: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    cy: {
        syntaxType: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    rx: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    ry: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-column-start': {
        key: 'grid-col-start',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-column-end': {
        key: 'grid-col-end',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-column-span': {
        key: 'grid-col-span',
        syntaxType: SyntaxType.Shorthand,
        transformValue(value) {
            return 'span' + ' ' + value + '/' + 'span' + ' ' + value
        },
        declare(value) {
            return {
                'grid-column': value
            }
        },
    } as SyntaxDefinition,
    'grid-column': {
        key: 'grid-col',
        syntaxType: SyntaxType.NativeShorthand,
    } as SyntaxDefinition,
    'grid-columns': {
        key: 'grid-cols',
        declare(value) {
            return {
                display: 'grid',
                'grid-template-columns': 'repeat'
                    + '(' + value
                    + ','
                    + 'minmax'
                    + '(' + 0 + ',' + 1 + 'fr' + '))',
            }
        },
        syntaxType: SyntaxType.Shorthand
    } as SyntaxDefinition,
    'grid-row-start': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-row-end': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-row-span': {
        syntaxType: SyntaxType.Shorthand,
        transformValue(value) {
            return 'span' + ' ' + value + '/' + 'span' + ' ' + value
        },
        declare(value) {
            return {
                'grid-row': value
            }
        }
    } as SyntaxDefinition,
    'grid-row': {
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'grid-rows': {
        declare(value) {
            return {
                display: 'grid',
                'grid-auto-flow': 'column',
                'grid-template-rows': 'repeat'
                    + '(' + value
                    + ','
                    + 'minmax'
                    + '(' + 0 + ',' + 1 + 'fr' + '))',
            }
        },
        syntaxType: SyntaxType.Shorthand
    } as SyntaxDefinition,
    'grid-auto-columns': {
        key: 'grid-auto-cols',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-auto-flow': {
        key: 'grid-flow',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-auto-rows': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-template-areas': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-template-columns': {
        key: 'grid-template-cols',
        syntaxType: SyntaxType.Native,
        unit: 'rem'
    } as SyntaxDefinition,
    'grid-template-rows': {
        syntaxType: SyntaxType.Native,
        unit: 'rem'
    } as SyntaxDefinition,
    'grid-template': {
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'grid-area': {
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    grid: {
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'column-gap': {
        key: 'gap-x',
        unit: 'rem',
        syntaxType: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    'row-gap': {
        key: 'gap-y',
        unit: 'rem',
        syntaxType: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    gap: {
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    order: {
        key: 'o',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'break-inside': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'break-before': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'break-after': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'aspect-ratio': {
        key: 'aspect',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'column-span': {
        key: 'col-span',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'align-content': {
        subkey: 'ac',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'align-items': {
        subkey: 'ai',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'align-self': {
        subkey: 'as',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'justify-content': {
        subkey: 'jc',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'justify-items': {
        subkey: 'ji',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'justify-self': {
        subkey: 'js',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'place-content': {
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'place-items': {
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'place-self': {
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'list-style-position': {
        ambiguousKeys: ['list-style'],
        ambiguousValues: ['inside', 'outside'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'list-style-type': {
        ambiguousKeys: ['list-style'],
        ambiguousValues: ['disc', 'decimal'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'list-style-image': {
        ambiguousKeys: ['list-style'],
        ambiguousValues: [IMAGE_VALUE_REGEX],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'list-style': {
        syntaxType: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'outline-color': {
        ambiguousKeys: ['outline'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        syntaxType: SyntaxType.Native,
        variables: ['frame'],
    } as SyntaxDefinition,
    'outline-offset': {
        unit: 'rem',
        syntaxType: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    'outline-style': {
        ambiguousKeys: ['outline'],
        ambiguousValues: BORDER_STYLE_VALUES,
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'outline-width': {
        ambiguousKeys: ['outline'],
        ambiguousValues: ['medium', 'thick', 'thin', NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    outline: {
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand,
        variables: [
            'outline-width',
            'outline-style',
            'outline-offset',
            'outline-color',
            'frame'
        ],
        transformValueComponents: autofillSolidStyle
    } as SyntaxDefinition,
    'accent-color': {
        key: 'accent',
        syntaxType: SyntaxType.Native,
    } as SyntaxDefinition,
    appearance: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'caret-color': {
        key: 'caret',
        syntaxType: SyntaxType.Native,
        variables: ['text']
    } as SyntaxDefinition,
    'scroll-behavior': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    // scroll margin
    'scroll-margin-left': {
        key: 'scroll-ml',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-margin-right': {
        key: 'scroll-mr',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-margin-top': {
        key: 'scroll-mt',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-margin-bottom': {
        key: 'scroll-mb',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-margin-x': {
        key: 'scroll-mx',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'scroll-margin-left': value,
                'scroll-margin-right': value
            }
        },
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-margin-y': {
        key: 'scroll-my',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'scroll-margin-top': value,
                'scroll-margin-bottom': value
            }
        },
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-margin': {
        key: 'scroll-m',
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // scroll padding
    'scroll-padding-left': {
        key: 'scroll-pl',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-padding-right': {
        key: 'scroll-pr',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-padding-top': {
        key: 'scroll-pt',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-padding-bottom': {
        key: 'scroll-pb',
        syntaxType: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-padding-x': {
        key: 'scroll-px',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'scroll-padding-left': value,
                'scroll-padding-right': value
            }
        },
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-padding-y': {
        key: 'scroll-py',
        unit: 'rem',
        syntaxType: SyntaxType.Shorthand,
        declare(value) {
            return {
                'scroll-padding-top': value,
                'scroll-padding-bottom': value
            }
        },
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-padding': {
        key: 'scroll-p',
        unit: 'rem',
        syntaxType: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // scroll snap
    'scroll-snap-align': {
        ambiguousKeys: ['scroll-snap'],
        ambiguousValues: ['start', 'end', 'center'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'scroll-snap-stop': {
        ambiguousKeys: ['scroll-snap'],
        ambiguousValues: ['normal', 'always'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'scroll-snap-type': {
        ambiguousKeys: ['scroll-snap'],
        ambiguousValues: ['x', 'y', 'block', 'inline', 'both'],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'will-change': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'writing-mode': {
        key: 'writing',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    direction: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'shape-outside': {
        ambiguousKeys: ['shape'],
        ambiguousValues: [/(?:inset|circle|ellipse|polygon|url|linear-gradient)\(.*\)/],
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'shape-margin': {
        ambiguousKeys: ['shape'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        syntaxType: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    'shape-image-threshold': {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'clip-path': {
        key: 'clip',
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    quotes: {
        syntaxType: SyntaxType.Native
    } as SyntaxDefinition,
    'mask-image': {
        syntaxType: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-mask-image': value,
                'mask-image': value,
            }
        }
    } as SyntaxDefinition
}

export default syntaxes