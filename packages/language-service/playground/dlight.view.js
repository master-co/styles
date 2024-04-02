/* eslint-disable no-undef */
import { View } from '@dlightjs/dlight'

@View
class MyComp {
    night = false
    fruits = ['🍎', '🍊', '🥑']

    Body() {
        h1('hello, dlight js')

        for (const fruit of this.fruits) {
            div(fruit)
        }

        button('toggle')
            .class('toggle fg:blue-50:hover')
            .onClick(() => {
                this.night = !this.night
            })

        if (this.night) {
            '🌙'
            '✨'
            '🌟'
        } else {
            '🔆'
        }
    }
}