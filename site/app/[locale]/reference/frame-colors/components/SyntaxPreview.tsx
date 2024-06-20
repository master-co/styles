'use client'

import useSelectedPreviewSyntax from 'internal/uses/use-selected-preview-syntax'
import Basic from './Basic'

export default (props: any) => {
    return (
        <Basic className={useSelectedPreviewSyntax(props.className)} />
    )
}