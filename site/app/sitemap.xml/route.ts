import { Page } from 'internal/types/Page'
import generateSitemapResponse from 'internal/utils/generate-sitemap-response'
import pages from '~/site/pages.json'

export function GET(request: Request) {
    return generateSitemapResponse(request, pages as Page[])
}