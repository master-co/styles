import syntaxes from '../syntaxes'
import SyntaxTable from '~/website/components/SyntaxTable'
import SyntaxTr from '~/website/components/SyntaxTr'

export default () => {
    const previewSyntax = 'align-items:center'
    return (
        <>
            <SyntaxTable>
                {syntaxes.map((syntax) =>
                    <SyntaxTr value={syntax} key={syntax}></SyntaxTr>)
                }
            </SyntaxTable>
        </>
    )
}