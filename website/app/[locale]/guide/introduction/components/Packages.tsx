import Link from 'internal/components/Link'

const mainPackages = [
    require('~/website/../packages/core/package.json'),
    require('~/website/../packages/runtime/package.json'),
    require('~/website/../packages/server/package.json'),
    require('~/website/../packages/extractor/package.json'),
    require('~/website/../packages/validator/package.json'),
    require('~/website/../packages/cli/package.json'),
    require('~/website/../packages/create/package.json'),
]

const integrationPackages = [
    require('~/website/../packages/react/package.json'),
    require('~/website/../packages/svelte/package.json'),
    require('~/website/../packages/vue/package.json'),
    require('~/website/../packages/nuxt/package.json'),
    require('~/website/../packages/extractor.vite/package.json'),
    require('~/website/../packages/extractor.webpack/package.json')
]

const developerToolPackages = [
    require('~/website/../packages/eslint-config/package.json'),
    require('~/website/../packages/eslint-plugin/package.json'),
    require('~/website/../packages/language-server/package.json'),
    require('~/website/../packages/language-service/package.json'),
    require('~/website/../packages/vscode/package.json'),
]

const solutionPackages = [
    require('~/website/node_modules/@master/colors/package.json'),
    require('~/website/node_modules/@master/normal.css/package.json'),
    require('~/website/node_modules/theme-mode/package.json'),
    require('~/website/node_modules/class-variant/package.json'),
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