import { expectClassPosition } from './test'

test('class in ternary operator', () => {
    const target = 'class-a'
    const contents = ['<div class:list={ isActive ? \'', target, '\' : inactiveClass }></div>']
    expectClassPosition(target, contents, 'astro')
})