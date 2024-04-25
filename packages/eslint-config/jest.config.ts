// import { pathsToModuleNameMapper } from 'ts-jest'
import { getTsconfig } from 'get-tsconfig'
// import { resolve } from 'path'

// const tsconfig = getTsconfig()?.config

/** @type {import('jest').Config} */
export default {
    preset: '@techor/jest',
    // moduleNameMapper: tsconfig?.compilerOptions?.paths && pathsToModuleNameMapper(tsconfig.compilerOptions?.paths, {
    //     prefix: resolve(tsconfig?.compilerOptions?.baseUrl || '.')
    // }),
}
