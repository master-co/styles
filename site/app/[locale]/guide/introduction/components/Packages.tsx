import Link from 'internal/components/Link'

const mainPackages = [
    require('~/site/../packages/core/package.json'),
    require('~/site/../packages/runtime/package.json'),
    require('~/site/../packages/server/package.json'),
    require('~/site/../packages/extractor/package.json'),
    require('~/site/../packages/validator/package.json'),
    require('~/site/../packages/cli/package.json'),
    require('~/site/../packages/create/package.json'),
]

const integrationPackages = [
    require('~/site/../packages/react/package.json'),
    require('~/site/../packages/svelte/package.json'),
    require('~/site/../packages/vue/package.json'),
    require('~/site/../packages/nuxt/package.json'),
    require('~/site/../packages/extractor.vite/package.json'),
    require('~/site/../packages/extractor.webpack/package.json')
]

const developerToolPackages = [
    require('~/site/../packages/eslint-config/package.json'),
    require('~/site/../packages/eslint-plugin/package.json'),
    require('~/site/../packages/language-server/package.json'),
    require('~/site/../packages/language-service/package.json'),
    require('~/site/../packages/vscode/package.json'),
]

const solutionPackages = [
    require('~/site/node_modules/@master/colors/package.json'),
    require('~/site/node_modules/@master/normal.css/package.json'),
    require('~/site/node_modules/theme-mode/package.json'),
    require('~/site/node_modules/class-variant/package.json'),
]

export default () => {
    const Tr = ({ children }: any) => (
        <tr>
            <th>
                <Link href={'https://github.com/master-co/css/tree/rc/' + children.repository.directory} indicate>
                    {children.name}
                </Link>
            </th>
            <td>{children.description}</td>
        </tr>
    )
    return (
        <table>
            <thead>
                <tr>
                    <th>Package</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colSpan={2}><small>Main</small></td>
                </tr>
                {mainPackages.map((eachPackage) => <Tr key={eachPackage.name}>{eachPackage}</Tr>)}
                <tr>
                    <td colSpan={2}><small>Integrations</small></td>
                </tr>
                {integrationPackages.map((eachPackage) => <Tr key={eachPackage.name}>{eachPackage}</Tr>)}
                <tr>
                    <td colSpan={2}><small>Developer Tools</small></td>
                </tr>
                {developerToolPackages.map((eachPackage) => <Tr key={eachPackage.name}>{eachPackage}</Tr>)}
                <tr>
                    <td colSpan={2}><small>Other Solutions</small></td>
                </tr>
                {solutionPackages.map((eachPackage) => (
                    <tr key={eachPackage.name}>
                        <th>
                            <Link href={eachPackage.repository.url} indicate>
                                {eachPackage.name}
                            </Link>
                        </th>
                        <td>{eachPackage.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}