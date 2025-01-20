import cssEscape from 'shared/utils/css-escape'
import type { SyntaxRule } from '../syntax-rule'
import SyntaxType from '../syntax-type'
import { BORDER_STYLE_VALUES, COLOR_VALUE_REGEX, IMAGE_VALUE_REGEX, NUMBER_VALUE_REGEX, VALUE_DELIMITERS } from '../common'
import autofillSolidStyle from '../utils/autofill-solid-style'
import { SyntaxDefinition } from '../types/config'

const rules = {
    group: {
        matcher: /^(?:.+?[*_>~+])?\{.+?\}/,
        type: SyntaxType.Shorthand,
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

                for (const eachNative of rule.nodes) {
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
                const rules = this.css.generate(eachName, this.mode)
                if (rules.length) {
                    for (const eachRule of rules) {
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'font-weight': {
        ambiguousKeys: ['font', 'f'],
        ambiguousValues: ['bolder'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'font-family': {
        ambiguousKeys: ['font', 'f'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'font-smoothing': {
        ambiguousKeys: ['font', 'f'],
        ambiguousValues: ['antialiased', 'subpixel-antialiased'],
        type: SyntaxType.Native,
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
        type: SyntaxType.Native,
        unit: 'deg'
    } as SyntaxDefinition,
    'font-variant-numeric': {
        ambiguousKeys: ['font', 'f'],
        ambiguousValues: ['ordinal', 'slashed-zero', 'lining-nums', 'oldstyle-nums', 'proportional-nums', 'tabular-nums', 'diagonal-fractions', 'stacked-fractions'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'font-variant': {
        ambiguousKeys: ['font', 'f'],
        type: SyntaxType.NativeShorthand,
    },
    font: {
        subkey: 'f',
        type: SyntaxType.NativeShorthand,
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
        type: SyntaxType.Native
    } as SyntaxDefinition,
    color: {
        key: 'fg',
        type: SyntaxType.Native,
        variables: ['text']
    } as SyntaxDefinition,
    // margin
    'margin-left': {
        key: 'ml',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-right': {
        key: 'mr',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-top': {
        key: 'mt',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-bottom': {
        key: 'mb',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-x': {
        key: 'mx',
        subkey: 'margin-x',
        unit: 'rem',
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // margin inline
    'margin-inline-start': {
        key: 'mis',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-inline-end': {
        key: 'mie',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'margin-inline': {
        key: 'mi',
        unit: 'rem',
        type: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // padding
    'padding-left': {
        key: 'pl',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-right': {
        key: 'pr',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-top': {
        key: 'pt',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-bottom': {
        key: 'pb',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-x': {
        key: 'px',
        unit: 'rem',
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // padding inline
    'padding-inline-start': {
        key: 'pis',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-inline-end': {
        key: 'pie',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'padding-inline': {
        key: 'pi',
        unit: 'rem',
        type: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // flex
    'flex-basis': {
        ambiguousKeys: ['flex'],
        unit: 'rem',
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'flex-wrap': {
        ambiguousKeys: ['flex'],
        ambiguousValues: ['wrap', 'nowrap', 'wrap-reverse'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'flex-grow': {
        ambiguousKeys: ['flex'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'flex-shrink': {
        ambiguousKeys: ['flex'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'flex-direction': {
        ambiguousKeys: ['flex'],
        ambiguousValues: ['row', 'row-reverse', 'column', 'column-reverse'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    flex: {
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    display: {
        key: 'd',
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    width: {
        key: 'w',
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    height: {
        key: 'h',
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'min-width': {
        key: 'min-w',
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'min-height': {
        key: 'min-h',
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    size: {
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'box-decoration-break': {
        key: 'box-decoration',
        type: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-box-decoration-break': value,
                'box-decoration-break': value,
            }
        }
    } as SyntaxDefinition,
    contain: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    content: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'counter-increment': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'counter-reset': {
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'letter-spacing': {
        key: 'tracking',
        subkey: 'ls',
        type: SyntaxType.Native,
        unit: 'em'
    } as SyntaxDefinition,
    'line-height': {
        key: 'leading',
        subkey: 'line-h',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'object-fit': {
        ambiguousKeys: ['object', 'obj'],
        ambiguousValues: ['contain', 'cover', 'fill', 'scale-down'],
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'object-position': {
        ambiguousKeys: ['object', 'obj'],
        ambiguousValues: ['top', 'bottom', 'right', 'left', 'center'],
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-align': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['justify', 'center', 'left', 'right', 'start', 'end'],
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-decoration-color': {
        ambiguousKeys: ['text-decoration'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        type: SyntaxType.Native,
        variables: ['text']
    } as SyntaxDefinition,
    'text-decoration-style': {
        ambiguousKeys: ['text-decoration'],
        ambiguousValues: ['solid', 'double', 'dotted', 'dashed', 'wavy'],
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-decoration-thickness': {
        ambiguousKeys: ['text-decoration'],
        ambiguousValues: ['from-font', NUMBER_VALUE_REGEX],
        type: SyntaxType.Native,
        unit: 'em'
    } as SyntaxDefinition,
    'text-decoration-line': {
        ambiguousKeys: ['text-decoration'],
        ambiguousValues: ['underline', 'overline', 'line-through'],
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-decoration': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['underline', 'overline', 'line-through'],
        unit: 'rem',
        type: SyntaxType.NativeShorthand,
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
        type: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    'text-underline-position': {
        ambiguousKeys: ['text-underline'],
        ambiguousValues: ['front-font', 'under', 'left', 'right'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'text-overflow': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['ellipsis', 'clip'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'text-orientation': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['mixed', 'upright', 'sideways-right', 'sideways', 'use-glyph-orientation'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'text-transform': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['uppercase', 'lowercase', 'capitalize'],
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-rendering': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['optimizeSpeed', 'optimizeLegibility', 'geometricPrecision'],
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'text-wrap': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: ['wrap', 'nowrap', 'balance', 'pretty'],
        type: SyntaxType.NativeShorthand,
    } as SyntaxDefinition,
    'text-indent': {
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'vertical-align': {
        key: 'v',
        subkey: 'vertical',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    columns: {
        key: 'cols',
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'white-space': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    top: {
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    bottom: {
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    left: {
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    right: {
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    inset: {
        unit: 'rem',
        type: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    'max-height': {
        key: 'max-h',
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'max-width': {
        key: 'max-w',
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    opacity: {
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    visibility: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    clear: {
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    float: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    isolation: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'overflow-x': {
        type: SyntaxType.Native,
        declare(value) {
            return value === 'overlay'
                ? { 'overflow-x': ['auto', value] }
                : { 'overflow-x': value }
        }
    } as SyntaxDefinition,
    'overflow-y': {
        type: SyntaxType.Native,
        declare(value) {
            return value === 'overlay'
                ? { 'overflow-y': ['auto', value] }
                : { 'overflow-y': value }
        }
    } as SyntaxDefinition,
    overflow: {
        type: SyntaxType.NativeShorthand,
        declare(value) {
            return value === 'overlay'
                ? { overflow: ['auto', value] }
                : { overflow: value }
        }
    } as SyntaxDefinition,
    'overscroll-behavior-x': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'overscroll-behavior-y': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'overscroll-behavior': {
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'z-index': {
        key: 'z',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    position: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    cursor: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'pointer-events': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    resize: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'touch-action': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'word-break': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'word-spacing': {
        type: SyntaxType.Native,
        unit: 'em'
    } as SyntaxDefinition,
    'user-drag': {
        type: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-user-drag': value,
                'user-drag': value,
            }
        }
    } as SyntaxDefinition,
    'user-select': {
        type: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-user-select': value,
                'user-select': value,
            }
        }
    } as SyntaxDefinition,
    'text-shadow': {
        unit: 'rem',
        type: SyntaxType.Native,
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
        type: SyntaxType.Shorthand
    } as SyntaxDefinition,
    'text-fill-color': {
        ambiguousKeys: ['text', 't'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        type: SyntaxType.Native,
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
        type: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-text-stroke-width': value
            }
        },
    } as SyntaxDefinition,
    'text-stroke-color': {
        ambiguousKeys: ['text-stroke'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        type: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-text-stroke-color': value
            }
        }
    } as SyntaxDefinition,
    'text-stroke': {
        unit: 'rem',
        type: SyntaxType.Native,
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
        type: SyntaxType.Shorthand,
    } as SyntaxDefinition,
    'box-shadow': {
        key: 'shadow',
        subkey: 's',
        unit: 'rem',
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'table-layout': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'transform-box': {
        ambiguousKeys: ['transform'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'transform-style': {
        ambiguousKeys: ['transform'],
        ambiguousValues: ['flat', 'preserve-3d'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'transform-origin': {
        ambiguousKeys: ['transform'],
        ambiguousValues: ['top', 'bottom', 'right', 'left', 'center', NUMBER_VALUE_REGEX],
        unit: 'px',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    transform: {
        matcher: /^(?:translate|scale|skew|rotate|perspective|matrix)(?:3d|[XYZ])?\(/,
        type: SyntaxType.Native,
        analyze(className: string) {
            return [className.startsWith('transform') ? className.slice(10) : className]
        },
        unit: 'px',
        variables: ['spacing']
    } as SyntaxDefinition,
    'transition-property': {
        key: '~property',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'transition-timing-function': {
        key: '~easing',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'transition-duration': {
        key: '~duration',
        type: SyntaxType.Native,
        unit: 'ms'
    } as SyntaxDefinition,
    'transition-delay': {
        key: '~delay',
        type: SyntaxType.Native,
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
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'animation-delay': {
        key: '@delay',
        type: SyntaxType.Native,
        unit: 'ms'
    } as SyntaxDefinition,
    'animation-direction': {
        key: '@direction',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'animation-duration': {
        key: '@duration',
        type: SyntaxType.Native,
        unit: 'ms'
    } as SyntaxDefinition,
    'animation-fill-mode': {
        key: '@fill',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'animation-iteration-count': {
        key: '@iteration',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'animation-name': {
        key: '@name',
        type: SyntaxType.Native,
        includeAnimations: true
    } as SyntaxDefinition,
    'animation-play-state': {
        key: '@play',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'animation-timing-function': {
        key: '@easing',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    animation: {
        sign: '@',
        type: SyntaxType.NativeShorthand,
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
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'border-spacing': {
        unit: 'rem',
        type: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    // border color
    'border-top-color': {
        ambiguousKeys: ['bt', 'border-top'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        type: SyntaxType.Native,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-bottom-color': {
        ambiguousKeys: ['bb', 'border-bottom'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        type: SyntaxType.Native,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-left-color': {
        ambiguousKeys: ['bl', 'border-left'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        type: SyntaxType.Native,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-right-color': {
        ambiguousKeys: ['br', 'border-right'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        type: SyntaxType.Native,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-x-color': {
        ambiguousKeys: ['bx', 'border-x'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.NativeShorthand,
        variables: ['frame'],
    } as SyntaxDefinition,
    // border radius
    'border-top-left-radius': {
        key: 'rtl',
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'border-top-right-radius': {
        key: 'rtr',
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'border-bottom-left-radius': {
        key: 'rbl',
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'border-bottom-right-radius': {
        key: 'rbr',
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'border-top-radius': {
        key: 'rt',
        unit: 'rem',
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    // border style
    'border-top-style': {
        ambiguousKeys: ['bt', 'border-top'],
        ambiguousValues: BORDER_STYLE_VALUES,
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-bottom-style': {
        ambiguousKeys: ['bb', 'border-bottom'],
        ambiguousValues: BORDER_STYLE_VALUES,
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-left-style': {
        ambiguousKeys: ['bl', 'border-left'],
        ambiguousValues: BORDER_STYLE_VALUES,
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-right-style': {
        ambiguousKeys: ['br', 'border-right'],
        ambiguousValues: BORDER_STYLE_VALUES,
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-x-style': {
        ambiguousKeys: ['bx', 'border-x'],
        ambiguousValues: BORDER_STYLE_VALUES,
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    // border width
    'border-top-width': {
        ambiguousKeys: ['bt', 'border-top'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-bottom-width': {
        ambiguousKeys: ['bb', 'border-bottom'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-left-width': {
        ambiguousKeys: ['bl', 'border-left'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-right-width': {
        ambiguousKeys: ['br', 'border-right'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'border-x-width': {
        ambiguousKeys: ['bx', 'border-x'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    // border image
    'border-image-repeat': {
        ambiguousKeys: ['border-image'],
        ambiguousValues: ['stretch', 'repeat', 'round', 'space'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'border-image-slice': {
        ambiguousKeys: ['border-image'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'border-image-source': {
        ambiguousKeys: ['border-image'],
        ambiguousValues: [IMAGE_VALUE_REGEX],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'border-image-width': {
        ambiguousKeys: ['border-image'],
        ambiguousValues: ['auto', NUMBER_VALUE_REGEX],
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'border-image-outset': {
        ambiguousKeys: ['border-image'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'border-image': {
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    // border
    'border-top': {
        key: 'bt',
        type: SyntaxType.NativeShorthand,
        unit: 'rem',
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-bottom': {
        key: 'bb',
        type: SyntaxType.NativeShorthand,
        unit: 'rem',
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-left': {
        key: 'bl',
        type: SyntaxType.NativeShorthand,
        unit: 'rem',
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-right': {
        key: 'br',
        type: SyntaxType.NativeShorthand,
        unit: 'rem',
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
    } as SyntaxDefinition,
    'border-x': {
        key: 'bx',
        unit: 'rem',
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.NativeShorthand,
        transformValueComponents: autofillSolidStyle,
        variables: ['frame'],
    } as SyntaxDefinition,
    'background-attachment': {
        ambiguousKeys: ['bg'],
        ambiguousValues: ['fixed', 'local', 'scroll'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'background-blend-mode': {
        key: 'bg-blend',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'background-color': {
        ambiguousKeys: ['bg'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'background-clip': {
        key: 'bg-clip',
        type: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-background-clip': value,
                'background-clip': value
            }
        }
    } as SyntaxDefinition,
    'background-origin': {
        key: 'bg-origin',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'background-position': {
        ambiguousKeys: ['bg'],
        ambiguousValues: ['top', 'bottom', 'right', 'left', 'center'],
        type: SyntaxType.Native,
        unit: 'px'
    } as SyntaxDefinition,
    'background-repeat': {
        ambiguousKeys: ['bg'],
        ambiguousValues: ['space', 'round', 'repeat', 'no-repeat', 'repeat-x', 'repeat-y'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'background-size': {
        ambiguousKeys: ['bg'],
        ambiguousValues: ['auto', 'cover', 'contain', NUMBER_VALUE_REGEX],
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'background-image': {
        ambiguousKeys: ['bg'],
        ambiguousValues: [IMAGE_VALUE_REGEX],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    background: {
        key: 'bg',
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    gradient: {
        matcher: /^gradient\(/,
        type: SyntaxType.Shorthand,
        declare(value) {
            return {
                'background-image': 'linear-' + value
            }
        }
    } as SyntaxDefinition,
    'mix-blend-mode': {
        key: 'blend',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'backdrop-filter': {
        key: 'bd',
        type: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-backdrop-filter': value,
                'backdrop-filter': value,
            }
        }
    } as SyntaxDefinition,
    filter: {
        matcher: /^(?:blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|opacity|saturate|sepia)\(/,
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    fill: {
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    'stroke-dasharray': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'stroke-dashoffset': {
        type: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    'stroke-width': {
        ambiguousKeys: ['stroke'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    stroke: {
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    x: {
        type: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    y: {
        type: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    cx: {
        type: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    cy: {
        type: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    rx: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    ry: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-column-start': {
        key: 'grid-col-start',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-column-end': {
        key: 'grid-col-end',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-column-span': {
        key: 'grid-col-span',
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.NativeShorthand,
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
        type: SyntaxType.Shorthand
    } as SyntaxDefinition,
    'grid-row-start': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-row-end': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-row-span': {
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.NativeShorthand
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
        type: SyntaxType.Shorthand
    } as SyntaxDefinition,
    'grid-auto-columns': {
        key: 'grid-auto-cols',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-auto-flow': {
        key: 'grid-flow',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-auto-rows': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-template-areas': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'grid-template-columns': {
        key: 'grid-template-cols',
        type: SyntaxType.Native,
        unit: 'rem'
    } as SyntaxDefinition,
    'grid-template-rows': {
        type: SyntaxType.Native,
        unit: 'rem'
    } as SyntaxDefinition,
    'grid-template': {
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'grid-area': {
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    grid: {
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'column-gap': {
        key: 'gap-x',
        unit: 'rem',
        type: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    'row-gap': {
        key: 'gap-y',
        unit: 'rem',
        type: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    gap: {
        unit: 'rem',
        type: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    order: {
        key: 'o',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'break-inside': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'break-before': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'break-after': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'aspect-ratio': {
        key: 'aspect',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'column-span': {
        key: 'col-span',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'align-content': {
        subkey: 'ac',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'align-items': {
        subkey: 'ai',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'align-self': {
        subkey: 'as',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'justify-content': {
        subkey: 'jc',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'justify-items': {
        subkey: 'ji',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'justify-self': {
        subkey: 'js',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'place-content': {
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'place-items': {
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'place-self': {
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'list-style-position': {
        ambiguousKeys: ['list-style'],
        ambiguousValues: ['inside', 'outside'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'list-style-type': {
        ambiguousKeys: ['list-style'],
        ambiguousValues: ['disc', 'decimal'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'list-style-image': {
        ambiguousKeys: ['list-style'],
        ambiguousValues: [IMAGE_VALUE_REGEX],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'list-style': {
        type: SyntaxType.NativeShorthand
    } as SyntaxDefinition,
    'outline-color': {
        ambiguousKeys: ['outline'],
        ambiguousValues: [COLOR_VALUE_REGEX],
        type: SyntaxType.Native,
        variables: ['frame'],
    } as SyntaxDefinition,
    'outline-offset': {
        unit: 'rem',
        type: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    'outline-style': {
        ambiguousKeys: ['outline'],
        ambiguousValues: BORDER_STYLE_VALUES,
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'outline-width': {
        ambiguousKeys: ['outline'],
        ambiguousValues: ['medium', 'thick', 'thin', NUMBER_VALUE_REGEX],
        unit: 'rem',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    outline: {
        unit: 'rem',
        type: SyntaxType.NativeShorthand,
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
        type: SyntaxType.Native,
    } as SyntaxDefinition,
    appearance: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'caret-color': {
        key: 'caret',
        type: SyntaxType.Native,
        variables: ['text']
    } as SyntaxDefinition,
    'scroll-behavior': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    // scroll margin
    'scroll-margin-left': {
        key: 'scroll-ml',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-margin-right': {
        key: 'scroll-mr',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-margin-top': {
        key: 'scroll-mt',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-margin-bottom': {
        key: 'scroll-mb',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-margin-x': {
        key: 'scroll-mx',
        unit: 'rem',
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // scroll padding
    'scroll-padding-left': {
        key: 'scroll-pl',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-padding-right': {
        key: 'scroll-pr',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-padding-top': {
        key: 'scroll-pt',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-padding-bottom': {
        key: 'scroll-pb',
        type: SyntaxType.Native,
        unit: 'rem',
        variables: ['spacing']
    } as SyntaxDefinition,
    'scroll-padding-x': {
        key: 'scroll-px',
        unit: 'rem',
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.Shorthand,
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
        type: SyntaxType.NativeShorthand,
        variables: ['spacing']
    } as SyntaxDefinition,
    // scroll snap
    'scroll-snap-align': {
        ambiguousKeys: ['scroll-snap'],
        ambiguousValues: ['start', 'end', 'center'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'scroll-snap-stop': {
        ambiguousKeys: ['scroll-snap'],
        ambiguousValues: ['normal', 'always'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'scroll-snap-type': {
        ambiguousKeys: ['scroll-snap'],
        ambiguousValues: ['x', 'y', 'block', 'inline', 'both'],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'will-change': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'writing-mode': {
        key: 'writing',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    direction: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'shape-outside': {
        ambiguousKeys: ['shape'],
        ambiguousValues: [/(?:inset|circle|ellipse|polygon|url|linear-gradient)\(.*\)/],
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'shape-margin': {
        ambiguousKeys: ['shape'],
        ambiguousValues: [NUMBER_VALUE_REGEX],
        unit: 'rem',
        type: SyntaxType.Native,
        variables: ['spacing']
    } as SyntaxDefinition,
    'shape-image-threshold': {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'clip-path': {
        key: 'clip',
        type: SyntaxType.Native
    } as SyntaxDefinition,
    quotes: {
        type: SyntaxType.Native
    } as SyntaxDefinition,
    'mask-image': {
        type: SyntaxType.Native,
        declare(value) {
            return {
                '-webkit-mask-image': value,
                'mask-image': value,
            }
        }
    } as SyntaxDefinition
}

export default rules