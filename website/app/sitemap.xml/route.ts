import { Page } from 'internal/scripts/prepare-app'
import generateSitemapResponse from 'internal/utils/generate-sitemap-response'
import pages from '~/website/pages.json'

export function GET(request: Request) {
    return generateSitemapResponse(request, pages as Page[])
}