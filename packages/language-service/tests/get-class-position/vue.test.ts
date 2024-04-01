import { expectClassPosition } from './test'

test('class in class array', () => {
    const target = 'class-a'
    const contents = ['<div :class="[ isActive && `', target, '` ]"></div>']
    expectClassPosition(target, contents, 'vue')
})

test('class in object syntax', () => {
    const target = 'class-a'
    const contents = ['<div :class="{ \'', target, '\': isActive }"></div>']
    expectClassPosition(target, contents, 'vue')
})

test('class in ternary operator', () => {
    const target = 'class-a'
    const contents = ['<div :class="isActive ? \'', target, '\' : inactiveClass"></div>']
    expectClassPosition(target, contents, 'vue')
})

test('class in v-bind', () => {
    const target = 'class-a'
    const contents = ['<div v-bind:class="{ active: isActive, \'', target, '\': hasError }"></div>']
    expectClassPosition(target, contents, 'vue')
})