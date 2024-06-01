'use client'

import useSelectedPreviewSyntax from '~/website/utils/use-selected-preview-syntax'
import Basic from './Basic'

export default (props: any) => {
    return (
        <Basic className={useSelectedPreviewSyntax(props.className)} />
    )
}