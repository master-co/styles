import dedent from 'ts-dedent'
import { expectClassPosition } from './test'

test('styled template literal', () => {
    const target = 'class-b'
    const contents = ['const Button = styled.button`class-a ', target, '`']
    expectClassPosition(target, contents, 'tsx')
})

test('styled template literal and new lines', () => {
    const target = 'class-b'
    const contents = [dedent`
        const Button = styled
            .button\`class-a `, target, '`']
    expectClassPosition(target, contents, 'tsx')
})

test('styled invoked', () => {
    const target = 'class-b'
    const contents = ['const Button = styled.button("class-a ', target, '")']
    expectClassPosition(target, contents, 'tsx')
})
