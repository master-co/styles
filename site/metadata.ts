// @ts-expect-error
import definedMetadataList from './app/[locale]/**/*metadata.ts'
import defineUnitCategoriesGetter from 'internal/utils/define-unit-categories-getter'
import categories from './categories.js'

console.log(definedMetadataList)

export const getUnitCategories = defineUnitCategoriesGetter(definedMetadataList, categories)

export {
    definedMetadataList
}