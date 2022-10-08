import { MasterCSSRule } from '../rule';
import { PADDING } from '../constants/css-property-keyword';

export class Padding extends MasterCSSRule {
    static id = 'padding';
    static override matches = /^padding(?:-(?:left|right|top|bottom))?:./;
    override get(declaration): { [key: string]: any } {
        return {
            [this.prefix.slice(0, -1)]: declaration
        }
    }
    override get order(): number {
        return (this.prefix === PADDING + ':') ? -1 : 0;
    }
}