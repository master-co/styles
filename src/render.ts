import { Style } from './style';
import { StyleSheet } from './sheet';
import './polyfills/css-escape';
import { generateColorVariablesText } from './utils/generate-color-variables-text';

export function render(html: string): {
    stylesCss: string,
    colorsCss: string,
    colorsMetaContent: string,
    html: string
} {
    if (!html) {
        return {
            stylesCss: '',
            colorsCss: '',
            colorsMetaContent: '',
            html
        };
    }

    const styleSheet = new StyleSheet();
    const regexp = /\sclass="([^"]*)"/gm;
    let results: string[];
    while (results = regexp.exec(html)) {
        const classNames = results[1].replace(/\n/g, '').split(' ').filter(css => css);
        for (const eachClassName of classNames) {
            if (!(eachClassName in styleSheet.countOfName)) {
                styleSheet.findAndInsert(eachClassName);
                styleSheet.countOfName[eachClassName] = 1;
            }
        }
    }
    const stylesCss = styleSheet.styles.map(eachStyle => eachStyle.text).join('');
    const colorsCss = Style.colorNames
        .map(colorName => generateColorVariablesText(colorName, Style.rgbColors[colorName]))
        .join('');
    const colorsMetaContent = Style.colorNames.join(',');
    return {
        stylesCss,
        colorsCss,
        colorsMetaContent,
        html: html.includes('<head>')
            ? html.replace(/(<head>)/,
                `$1
                <style id="master-colors">${colorsCss}</style>
                <style id="master-styles">${stylesCss}</style>
                <meta name="master:colors" content="${colorsMetaContent}"></meta>`
            )
            : html
    };
}