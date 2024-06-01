import Article from 'internal/components/Article'
import ArticleHeader from 'internal/components/ArticleHeader'
import DocMain from '../components/DocMain'
import DocFooter from '../components/DocFooter'
import PageNavs from 'internal/components/PageNavs'
import pages from '~/website/data/pages.json'
import PageContent from 'internal/components/PageContent'
import fetchLastCommit from 'internal/utils/fetch-last-commit'
import project from '~/website/project'

export default async function Layout({ children, pageDirname, params, toc, $hideLeftSide, pageCategories, className, ...props }: any) {
    return <>
        <DocMain $hideRightSide={!toc} $hideLeftSide={$hideLeftSide} className={className}>
            <Article>
                <ArticleHeader {...props} metadata={props.metadata} />
                {children}
            </Article>
            <PageNavs metadata={props.metadata} pageCategories={pageCategories} />
            <DocFooter locale={params.locale} />
        </DocMain>
        {toc && <PageContent locale={params.locale} metadata={props.metadata} pageDirname={pageDirname} lastCommit={await fetchLastCommit(pageDirname, project)}>{toc}</PageContent>}
    </>
}