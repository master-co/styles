import { test, it, expect, describe } from 'vitest'
import { hint } from './test'

test.concurrent('@', () => expect(hint('@')?.map(({ label }) => label)).toContain('fade|1s'))
test.concurrent('@fade|', () => expect(hint('@fade|')?.map(({ label }) => label)).toContain('alternate'))
test.concurrent('animation:', () => expect(hint('animation:')?.map(({ label }) => label)).toContain('fade'))
test.concurrent('animation-name:', () => expect(hint('animation-name:')?.map(({ label }) => label)).toContain('fade'))
test.concurrent('selector', () => expect(hint('@fade|1s:')?.map(({ label }) => label)).toContain(':hover'))
test.concurrent('at', () => expect(hint('@fade|1s@')?.map(({ label }) => label)).toContain('@sm'))