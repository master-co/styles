import { it, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { render } from '../src'
import { dirname, join } from 'path'
import fg from 'fast-glob'

fg.sync('../../../website/app/**/tests/**/template.html', { cwd: __dirname })
    .forEach(templatePath => {
        const templateDirname = dirname(templatePath)
        test(templateDirname.replace('../app/[locale]/(root)', ''), async () => {
            const config = (await import(join(__dirname, templateDirname, 'master.css.js'))).default
            expect(
                render(
                    readFileSync(join(__dirname, templatePath)).toString()
                        .replace(/\*\*/g, '')
                        .replace(/^- .*/gm, ''),
                    config
                ).css?.text
            )
                .toEqual(readFileSync(join(__dirname, templateDirname, 'generated.css')).toString())
        })
    })