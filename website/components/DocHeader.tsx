'use client'

import links from '../links'
import Header from 'internal/components/Header'
import HeaderNav from 'internal/components/HeaderNav'
import LanguageButton from 'internal/components/LanguageButton'
import GitHubIconButton from 'internal/components/GitHubIconButton'
import ThemeButton from '~/website/components/ThemeButton'
import TwitterIconButton from 'internal/components/TwitterIconButton'
import DiscussionsIconButton from 'internal/components/DiscussionsIconButton'
import DiscordIconButton from 'internal/components/DiscordIconButton'
import { IconChevronDown, IconListSearch } from '@tabler/icons-react'
import { Logotype } from '~/website/components/Logotype'
import DocVersionSelect from './DocVersionSelect'
import version from '~/website/version'
import Link from 'internal/components/Link'
import DocMenuButton from './DocMenuButton'
import { useTranslation } from 'internal/contexts/i18n'
import HeaderContent from 'internal/components/HeaderContent'
import SearchButton from 'internal/components/SearchButton'
import isDateWithinSevenDays from '~/website/utils/is-date-within-seven-days'
import DocBadge from 'internal/components/DocBadge'

export default function DocHeader(props: any) {
    const $ = useTranslation()
    return (
        <Header {...props} >
            <HeaderContent className="app-container">
                <DocMenuButton className="app-header-icon hidden@md ml:-5x" locale={props.locale} />
                <Link href={'/'} className="mx:auto@<md">
                    {<Logotype height="19" />}
                </Link>
                <label className='app-header-nav hidden@<md rel font:medium gap:5 ml:30'>
                    v{version}
                    <DocVersionSelect version={version} />
                    <IconChevronDown className="mr:-3 size:1em stroke:1.5" />
                </label>
                {links.map(({ Icon, fullName, ...eachLink }: any) => <HeaderNav className="hidden@<md" key={eachLink.name} {...eachLink}>
                    {$(eachLink.name)}
                    {eachLink.date && isDateWithinSevenDays(eachLink.date) && <DocBadge className="ml:1x" $color="primary" $size="xs">New</DocBadge>}
                </HeaderNav>)}
                <TwitterIconButton className="app-header-icon hidden@<md ml:auto" />
                <DiscordIconButton className="app-header-icon hidden@<md" />
                <DiscussionsIconButton className="app-header-icon hidden@<md" projectId="css" />
                <GitHubIconButton className="app-header-icon hidden@<md" projectId="css" />
                <div className='hidden@<md bg:divider h:1em mx:4x w:1'></div>
                <LanguageButton className="app-header-icon hidden@<md" locale={props.locale} />
                <ThemeButton className="app-header-icon hidden@<md mr:-3x" />
                <SearchButton id="sidebar-toggle" className="app-header-icon hidden@md mr:-5x">
                    <IconListSearch width="22" height="22" strokeWidth="1.2" />
                </SearchButton>
            </HeaderContent>
        </Header>
    )
}