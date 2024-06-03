import SyntaxTable from 'internal/components/SyntaxTable'
import syntaxes from '../syntaxes'
import SyntaxTr from 'internal/components/SyntaxTr'

export default () =>
    <SyntaxTable>
        {syntaxes.map((syntax) =>
            <SyntaxTr value={syntax} key={syntax}></SyntaxTr>)
        }
    </SyntaxTable>