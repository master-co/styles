import { hint } from './test'

test('one declaration', () => expect(hint('{text:')?.find(({ label }) => label === 'center')).toMatchObject({ label: 'center' }))
test('two declarations', () => expect(hint('{block;text:')?.find(({ label }) => label === 'center')).toMatchObject({ label: 'center' }))
it('should not hint selectors', () => expect(hint('{block;text:center:')).toBeUndefined())
it('should not hint queries', () => expect(hint('{block;text:center@')).toBeUndefined())