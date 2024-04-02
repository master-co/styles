import { expectClassPosition } from './test'

test('clsx', () => {
    const target = 'class-b'
    const contents = ['const classes = clsx("class-a ', target, '")']
    expectClassPosition(target, contents, 'js')
})

test('styled', () => {
    const target = 'class-b'
    const contents = ['const Button = styled("class-a ', target, '")']
    expectClassPosition(target, contents, 'tsx')
})

// test('escaped single quotes', () => {
//     const target = `content:\\'\\'`
//     const contents = [`export default () => <div className={'block `, target, '}></div>']
//     expectClassPosition(target, contents, 'tsx')
// })