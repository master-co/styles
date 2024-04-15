import { hint } from './test'

test('@', () => expect(hint('@')?.map(({ label }) => label)).toContain('fade|1s'))
test('@fade|', () => expect(hint('@fade|')?.map(({ label }) => label)).toContain('alternate'))
test('animation:', () => expect(hint('animation:')?.map(({ label }) => label)).toContain('fade'))
test('animation-name:', () => expect(hint('animation-name:')?.map(({ label }) => label)).toContain('fade'))
test('selector', () => expect(hint('@fade|1s:')?.map(({ label }) => label)).toContain(':hover'))
test('at', () => expect(hint('@fade|1s@')?.map(({ label }) => label)).toContain('@sm'))