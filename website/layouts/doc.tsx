import Article from 'internal/components/Article'
import ArticleHeader from 'internal/components/ArticleHeader'
import PageNavs from 'internal/components/PageNavs'
import DocMain from '../components/DocMain'
import DocFooter from '../components/DocFooter'
import PageContent from 'internal/components/PageContent'
import clsx from 'clsx'
import fetchLastCommit from 'internal/utils/fetch-last-commit'
import project from '~/project'

export default async function Layout({ children, pageDirname, params, toc, $prose, $hideLeftSide, pageCategories, className, ...props }: any) {
    return (
        <>
            <DocMain $hideRightSide={!toc} $hideLeftSide={$hideLeftSide} className={className}>
                <Article $prose>
                    <ArticleHeader {...props} metadata={props.metadata} />
                    {children}
                </Article>
                <PageNavs metadata={props.metadata} pageCategories={pageCategories} />
                <DocFooter locale={params.locale} />
            </DocMain>
            {toc && <PageContent locale={params.locale} metadata={props.metadata} pageDirname={pageDirname} lastCommit={await fetchLastCommit(pageDirname, project)}>{toc}</PageContent>}
        </>
    )
}