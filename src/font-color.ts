import { COLOR } from './constants/css-property-keyword';
import { Style } from '@master/style';

export class FontColorStyle extends Style {
    static override matches = /^((f(ont)?-)?color:.)/;
    static override colorStarts = 'f(ont)?:';
    static override key = COLOR;
    static override unit = '';
}