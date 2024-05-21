import { test, expect } from 'vitest'
import exploreConfig from '../src'
import config from './master.css'

test('basic', () => {
    expect(exploreConfig({ cwd: __dirname })).toStrictEqual(config)
})