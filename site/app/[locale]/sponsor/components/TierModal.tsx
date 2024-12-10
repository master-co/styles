import { Dispatch } from 'react'
import Image from 'next/image'
import Modal from 'internal/components/Modal'
import Link from 'internal/components/Link'

export default function TierModal({ tierState }: { tierState: [any, Dispatch<any>] }) {
    const [selectedTier, setSelectedTier] = tierState
    return <Modal backdropClick={() => setSelectedTier(null)} contentClass="max-w:320 pb:15">
        <div className="flex flex:col@<lg gap:20 p:25 r:5">
            <div className="font:48">{selectedTier.icon}</div>
            <div className='flex:1'>
                <div className="uppercase::first-letter fg:strong font:semibold text:16">{selectedTier.name}</div>
                {selectedTier.amount && (
                    <div className="fg:strong font:bold text:14">
                        {selectedTier.amount}
                        <span className="fg:neutral font:regular ml:5 text:12">
                            / {selectedTier.one ? 'one-time' : 'month'}
                        </span>
                    </div>
                )}
            </div>
        </div>
        <div className="bt:1|solid|lightest mb:5 pt:15 px:25 text:12">
            Choose a platform
        </div>
        <Link href={selectedTier.openCollectiveUrl} className="flex align-items:center font:medium gap:12 min-h:48 px:25 text-decoration:none!">
            <Image src="/images/open-collective.svg" alt="open-collective" width="24" height="24" />
            Open Collective
        </Link>
        <Link href={selectedTier.githubSponsorUrl} className="flex align-items:center font:medium gap:12 min-h:48 px:25 text-decoration:none!">
            <Image src="/images/github-sponsors.svg" alt="github-sponsors" width="24" height="24" className="scale(1.2)" />
            Github Sponsors
        </Link>
    </Modal>
}