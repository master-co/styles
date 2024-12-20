import { NextResponse, NextRequest } from 'next/server'
import rewriteI18n from 'internal/utils/rewrite-i18n'
import units from './units'

export function middleware(request: NextRequest) {
    const response = rewriteI18n(request, units as any)
    if (response) return response
    return NextResponse.next()
}
