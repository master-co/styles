import { MOZ_PREFIX, OSX, WEBKIT_PREFIX } from './constants/css-browser-prefix';
import { ANTIALIASED, AUTO, DASH, FONT, GRAYSCALE, SMOOTH, SMOOTHING } from './constants/css-property-keyword';
import { MasterStyle } from '@master/style';

export class FontSmoothingStyle extends MasterStyle {
    static override prefixes = /^f(ont)?:(smooth|sharp)/;
    static override defaultUnit = '';
    static override supportFullName = false;
    override get properties(): { [key: string]: any } {
        const isSmooth = this.value === SMOOTH;
        return {
            [WEBKIT_PREFIX + FONT + DASH + SMOOTHING]: {
                ...this,
                value: isSmooth
                    ? ANTIALIASED
                    : AUTO
            },
            [MOZ_PREFIX + OSX + FONT + DASH + SMOOTHING]: {
                ...this,
                value: isSmooth
                    ? GRAYSCALE
                    : AUTO
            }
        };
    };
}