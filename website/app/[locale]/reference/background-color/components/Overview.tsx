import SyntaxTable from '~/website/components/SyntaxTable'
import syntaxes from '../syntaxes'
import SyntaxTr from '~/website/components/SyntaxTr'
import SyntaxPreview from './SyntaxPreview'
import Bg from '~/website/components/Bg'

export default () => {
    const previewSyntax = 'bg:yellow'
    return (
        <>
            <SyntaxTable>
                {syntaxes.map((syntax) =>
                    <SyntaxTr value={syntax} key={syntax} previewSyntax={previewSyntax}>
                        {typeof syntax === 'string' && <Bg className={syntax} />}
                    </SyntaxTr>)
                }
            </SyntaxTable>
            <SyntaxPreview className={previewSyntax} />
        </>
    )
}