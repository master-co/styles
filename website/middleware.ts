import { NextResponse, NextRequest } from 'next/server'
import rewriteI18n from 'internal/utils/rewrite-i18n'
import units from './units.json'

export function middleware(request: NextRequest) {
    const response = rewriteI18n(request, units)
    if (response) return response
    return NextResponse.next()
}
