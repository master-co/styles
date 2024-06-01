import syntaxes from '../syntaxes'
import SyntaxTable from '~/website/components/SyntaxTable'
import SyntaxTr from '~/website/components/SyntaxTr'

export default () => {
    return (
        <>
            <SyntaxTable scrollY={0}>
                {syntaxes.map((syntax) =>
                    <SyntaxTr value={syntax} key={syntax}></SyntaxTr>)
                }
            </SyntaxTable>
        </>
    )
}