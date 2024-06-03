import Demo from 'internal/components/Demo'
import DemoPanel from 'internal/components/DemoPanel'
import Code from 'internal/components/Code'
import clsx from 'clsx'

export default ({ className }: any) => {
    return (
        <>
            <Demo className="gap:40">
                <button className="bg:stripe cursor:pointer font:14 font:semibold h:42 px:20 r:5">Hover Me</button>
            </Demo>
            <Code lang="html">{`
                <div class="**${className}**">Hover Me</div>
            `}</Code>
        </>
    )
}