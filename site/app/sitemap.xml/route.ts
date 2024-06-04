import generateSitemapResponse from 'internal/utils/generate-sitemap-response'
import { definedMetadataList } from '~/site/metadata'

export function GET(request: Request) {
    return generateSitemapResponse(request, definedMetadataList)
}