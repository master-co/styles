import { MasterCSSRule } from '../rule';
import { BORDER, dash, STYLE } from '../constants/css-property-keyword';
import { getBorderProps } from '../utils/get-border-props';

export class BorderStyle extends MasterCSSRule {
    static id = 'borderStyle';
    static override matches = /^(border(-(left|right|top|bottom))?-style:.|b([xytblr]|order(-(left|right|top|bottom))?)?:(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)(?!\|))/;
    override get(declaration): { [key: string]: any } {
        return getBorderProps(this.prefix, declaration, STYLE);
    }
    override get order(): number {
        return (this.prefix === dash(BORDER, STYLE) + ":" || this.prefix === 'b:' || this.prefix === BORDER + ':') ? -1 : 0;
    }
}