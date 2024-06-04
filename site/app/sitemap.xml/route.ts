import generateSitemapResponse from 'internal/utils/generate-sitemap-response'
import definedMetadataList from '~/site/app/defined-metadata-list'

export function GET(request: Request) {
    return generateSitemapResponse(request, definedMetadataList)
}