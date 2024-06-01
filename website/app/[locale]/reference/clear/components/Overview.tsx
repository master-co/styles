import SyntaxTable from '~/website/components/SyntaxTable'
import syntaxes from '../syntaxes'
import SyntaxTr from '~/website/components/SyntaxTr'

export default () =>
    <SyntaxTable>
        {syntaxes.map((syntax) =>
            <SyntaxTr value={syntax} key={syntax}></SyntaxTr>)
        }
    </SyntaxTable>