// import { pathsToModuleNameMapper } from 'ts-jest'
// import { getTsconfig } from 'get-tsconfig'

// const tsconfig = getTsconfig()?.config

/** @type {import('jest').Config} */
export default {
    preset: '@techor/jest',
    // moduleNameMapper: tsconfig?.compilerOptions?.paths && pathsToModuleNameMapper(tsconfig.compilerOptions?.paths, { prefix: '<rootDir>/' }),
}
