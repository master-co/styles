import { DASH, GRID, ROW, SPAN } from './constants/css-property-keyword';
import { MasterStyle } from '@master/style';

export class GridRowStyle extends MasterStyle {
    static override prefixes = /^grid-row(-span)?:/;
    static override properties = [GRID + DASH + ROW];
    static override defaultUnit = '';
    static override supportFullName = false;
    override get parseValue() {
        return this.prefix.slice(-5, -1) === 'span' && this.value !== 'auto'
            ? SPAN + ' ' + this.value + '/' + SPAN + ' ' + this.value
            : this.value;
    }
}