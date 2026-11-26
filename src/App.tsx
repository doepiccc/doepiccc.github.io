import { useEffect, useState, type ReactNode } from 'react'
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  CircleDollarSign,
  Clock3,
  FileKey2,
  Github,
  Handshake,
  Layers3,
  Link2,
  Linkedin,
  Network,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  WalletCards,
  Zap,
} from 'lucide-react'
import { LanguageSwitch, useLocale } from './i18n/LocaleContext'
import { Scene } from './scene/Scene'
import { ThemeSwitch } from './theme/ThemeContext'

const LINKEDIN_URL = 'https://www.linkedin.com/in/arsenik/'
const GITHUB_URL = 'https://github.com/doepiccc'
const UNISON_REPOSITORY = 'https://github.com/doepiccc/UnisonZenithEVMDapp'
const ZENITH_REPOSITORY = 'https://github.com/doepiccc/ZenithDapps'
const UNISON_APP = `${import.meta.env.BASE_URL}unison/`
const ZENITH_APP = `${import.meta.env.BASE_URL}zenith/`
const LOGO = `${import.meta.env.BASE_URL}favicon.svg`

type Page = 'home' | 'unison-article' | 'zenith-article'

function readPage(): Page {
  if (window.location.hash === '#/journal/unison') return 'unison-article'
  if (window.location.hash === '#/journal/zenith') return 'zenith-article'
  return 'home'
}

function Brand() {
  return (
    <span className="brand" data-no-i18n>
      <img src={LOGO} alt="" width="27" height="27" />
      <span className="brand__word grad">doepic<b>.cc</b></span>
    </span>
  )
}

function Header() {
  return (
    <header className="nav">
      <div className="nav__bar glass">
        <a href="#top" aria-label="DoEpic.cc home"><Brand /></a>
        <span className="nav__space" />
        <nav className="nav__links" aria-label="Primary navigation">
          <a href="#work">R&D</a>
          <a href="#devlog">Devlog</a>
        </nav>
        <ThemeSwitch />
        <LanguageSwitch />
        <a className="pill" href="#contact">Contact</a>
      </div>
    </header>
  )
}

function ButtonLink({
  href,
  children,
  secondary = false,
  external = false,
}: {
  href: string
  children: ReactNode
  secondary?: boolean
  external?: boolean
}) {
  return (
    <a
      className={`button-link ${secondary ? 'button-link--secondary' : ''}`}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="site-container">
        <div className="hero__card glass tilt" data-tilt="6">
          <div>
            <div className="hero__top">
              <img className="hero__tile" src={LOGO} alt="" width="52" height="52" />
              <span className="eyebrow eyebrow--live"><i />Web3 product lab</span>
            </div>
            <h1><span>Building crypto things</span> <span className="grad">that feel good to use</span></h1>
          </div>
          <div className="hero__side">
            <p>DApps, protocol research and experiments. Open source, testnet first, no trackers.</p>
            <div className="hero__actions">
              <ButtonLink href="#work">See R&D projects <ArrowDown size={15} /></ButtonLink>
              <ButtonLink href={GITHUB_URL} secondary external><Github size={15} /> GitHub</ButtonLink>
            </div>
            <div className="hero__stats">
              <span><b>2</b> <span>R&D projects</span></span>
              <span><b>10</b> <span>dApps</span></span>
              <span><b>0</b> <span>trackers</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface Project {
  id: 'unison' | 'zenith'
  number: string
  name: string
  live: string
  tags: string[]
  kicker: string
  text: string
  image: string
  alt: string
  app: string
  appLabel: string
  repository: string
  article: string
}

const projects: Project[] = [
  {
    id: 'unison',
    number: '01 / 2026',
    name: 'UNISON',
    live: 'Zenith Testnet',
    tags: ['EVM → Canton', 'CIP-103', 'Open source'],
    kicker: 'Settlement desk',
    text: 'Shareable settlement requests without a backend: create a link, pay it from a standard EVM wallet and get Canton finality through Zenith Gateway.',
    image: 'images/unison-overview.png',
    alt: 'UNISON settlement dashboard overview',
    app: UNISON_APP,
    appLabel: 'Open DApp',
    repository: UNISON_REPOSITORY,
    article: '#/journal/unison',
  },
  {
    id: 'zenith',
    number: '02 / 2026',
    name: 'Zenith Apps',
    live: '10 DApps',
    tags: ['Solidity', '13 contracts', 'Demo ready'],
    kicker: 'Consumer app suite',
    text: 'Ten everyday onchain products, from link payments and shared tabs to subscriptions, tickets and inheritance vaults. Try each one before deployment.',
    image: 'images/zenith-overview.png',
    alt: 'Zenith Apps consumer DApp suite overview',
    app: ZENITH_APP,
    appLabel: 'Open app suite',
    repository: ZENITH_REPOSITORY,
    article: '#/journal/zenith',
  },
]

function Research() {
  return (
    <section className="section" id="work">
      <div className="site-container">
        <span className="kicker rv">R&D</span>
        <h2 className="rv">Research & experiments</h2>
        <div className="project-list">
          {projects.map((project) => (
            <article className={`project glass tilt rv project--${project.id}`} data-tilt="3" key={project.id}>
              <a className="project__image" href={project.app} tabIndex={-1} aria-hidden="true">
                <img src={`${import.meta.env.BASE_URL}${project.image}`} alt={project.alt} loading="lazy" decoding="async" />
              </a>
              <div className="project__text">
                <span className="project__number"><span>{project.number}</span> · <span>{project.kicker}</span></span>
                <div className="tags">
                  <span className="tags__live">{project.live}</span>
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <h3 data-no-i18n>{project.name}</h3>
                <p>{project.text}</p>
                <div className="project__actions">
                  <ButtonLink href={project.app}><span>{project.appLabel}</span> <ArrowUpRight size={15} /></ButtonLink>
                  <ButtonLink href={project.repository} secondary external><Github size={15} /> Source</ButtonLink>
                  <a className="text-link" href={project.article}>Build log <ArrowRight size={14} /></a>
                </div>
              </div>
            </article>
          ))}
          <article className="project project--soon glass tilt rv" data-tilt="3">
            <div className="project__image" aria-hidden="true">
              <img src={`${import.meta.env.BASE_URL}img/lp/soon.webp`} alt="" loading="lazy" decoding="async" width="960" height="536" />
            </div>
            <div className="project__text">
              <span className="project__number"><span>03+</span> · <span>Next in R&D</span></span>
              <div className="tags"><span className="tags__live">Coming soon</span></div>
              <h3>New projects are on the way</h3>
              <p>This block will soon be home to more experiments: new DApps, protocol studies and tools. Follow along on GitHub.</p>
              <div className="project__actions">
                <ButtonLink href={GITHUB_URL} secondary external><Github size={15} /> Follow on GitHub</ButtonLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

const notes = [
  { number: '001', href: '#/journal/unison', title: 'One link from an EVM wallet to Canton finality.', date: '03 NOV 2026', time: '5 MIN READ' },
  { number: '002', href: '#/journal/zenith', title: 'Ten consumer dApps. One coherent app layer.', date: '04 NOV 2026', time: '7 MIN READ' },
]

function ContactLinks() {
  const links = [
    { icon: <Github size={19} />, name: 'GitHub', handle: 'doepiccc', href: GITHUB_URL },
    { icon: <Linkedin size={19} fill="currentColor" />, name: 'LinkedIn', handle: 'in/arsenik', href: LINKEDIN_URL },
  ]
  return (
    <div className="panel panel--links glass tilt rv" data-tilt="4">
      {links.map((link) => (
        <a className="contact" href={link.href} target="_blank" rel="me noreferrer" key={link.name}>
          <span className="contact__icon">{link.icon}</span>
          <span className="contact__text" data-no-i18n><b>{link.name}</b><small>{link.handle}</small></span>
          <ArrowUpRight className="contact__arrow" size={17} />
        </a>
      ))}
    </div>
  )
}

function DevlogAndContact() {
  return (
    <section className="section">
      <div className="site-container duo">
        <div className="duo__column" id="devlog">
          <span className="kicker rv">Devlog</span>
          <h2 className="rv">Notes from the build.</h2>
          <div className="panel glass tilt rv" data-tilt="3">
            {notes.map((note) => (
              <a className="note" href={note.href} key={note.number}>
                <span className="note__number">{note.number}</span>
                <span className="note__title">{note.title}</span>
                <span className="note__meta"><span>{note.date}</span> · <span>{note.time}</span></span>
              </a>
            ))}
          </div>
        </div>
        <div className="duo__column" id="contact">
          <span className="kicker rv">Contact</span>
          <h2 className="rv">Get in touch</h2>
          <ContactLinks />
        </div>
      </div>
    </section>
  )
}

function ContactStrip() {
  return (
    <section className="section" id="contact">
      <div className="site-container contact-strip">
        <span className="kicker rv">Contact</span>
        <h2 className="rv">Have a protocol worth making usable?</h2>
        <ContactLinks />
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="site-container">
        <p>© <span>{new Date().getFullYear()}</span> <span data-no-i18n>doepic.cc</span> · <span>Made with heart</span></p>
        <p className="footer__links">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="me noreferrer">LinkedIn</a>
          <a href={UNISON_APP}>UNISON</a>
          <a href={ZENITH_APP}>Zenith Apps</a>
          <a href="#top">Back to top ↑</a>
        </p>
      </div>
    </footer>
  )
}

function HomePage() {
  return (
    <main>
      <Hero />
      <Research />
      <DevlogAndContact />
    </main>
  )
}

/** Pointer-following 3D tilt for `.tilt` cards and the fade-in of `.rv` blocks. */
function useCardEffects(page: Page) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.1 })
    document.querySelectorAll('.rv').forEach((element) => observer.observe(element))

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups: (() => void)[] = []
    if (fine && !still) {
      for (const card of document.querySelectorAll<HTMLElement>('.tilt')) {
        const strength = Number(card.dataset.tilt ?? 4)
        const move = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect()
          const x = (event.clientX - bounds.left) / bounds.width
          const y = (event.clientY - bounds.top) / bounds.height
          card.style.setProperty('--mx', `${x * 100}%`)
          card.style.setProperty('--my', `${y * 100}%`)
          card.style.transform = `perspective(1100px) rotateY(${(x - 0.5) * strength}deg) rotateX(${-(y - 0.5) * strength}deg) translateY(-2px)`
        }
        const leave = () => { card.style.transform = '' }
        card.addEventListener('pointermove', move)
        card.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          card.removeEventListener('pointermove', move)
          card.removeEventListener('pointerleave', leave)
        })
      }
    }
    return () => {
      observer.disconnect()
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [page])
}

function FlowDiagram() {
  return (
    <div className="article-flow" aria-label="UNISON settlement flow: EVM wallet to Zenith Gateway to Canton party">
      <div className="article-flow__node"><WalletCards size={20} /><strong>EVM wallet</strong><small>Sign transfer</small></div>
      <span className="article-flow__line"><i /><ArrowRight size={16} /></span>
      <div className="article-flow__node article-flow__node--active"><Layers3 size={20} /><strong>Zenith</strong><small>Resolve + finalize</small></div>
      <span className="article-flow__line"><i /><ArrowRight size={16} /></span>
      <div className="article-flow__node"><Network size={20} /><strong>Canton party</strong><small>Receive value</small></div>
    </div>
  )
}

const zenithCatalog = [
  {
    id: 'payments',
    index: '01',
    title: 'Payments & social',
    text: 'Move value, share costs, and make agreements.',
    apps: [
      { id: 'zenlink', icon: <Link2 />, name: 'ZenLink', text: 'Protected link and QR transfers.' },
      { id: 'splitzen', icon: <ReceiptText />, name: 'SplitZen', text: 'Shared expenses with net settlement.' },
      { id: 'pactfi', icon: <BadgeCheck />, name: 'PactFi', text: 'Stake-backed habit challenges.' },
      { id: 'safedeal', icon: <Handshake />, name: 'SafeDeal P2P', text: 'Dual-collateral peer deals.' },
    ],
  },
  {
    id: 'streaming',
    index: '02',
    title: 'Streaming finance',
    text: 'Use fast blocks for products that move second by second.',
    apps: [
      { id: 'microretail', icon: <CircleDollarSign />, name: 'MicroRetail RWA', text: 'Tokenized T-Bond savings demo.' },
      { id: 'substream', icon: <Clock3 />, name: 'SubStream', text: 'Cancelable per-second subscriptions.' },
      { id: 'flashpredict', icon: <Activity />, name: 'FlashPredict', text: 'Two-minute higher/lower markets.' },
    ],
  },
  {
    id: 'assets',
    index: '03',
    title: 'Digital assets',
    text: 'Own, sell, and protect digital value with visible rules.',
    apps: [
      { id: 'fairtix', icon: <TicketCheck />, name: 'FairTix', text: 'Tickets with capped resale.' },
      { id: 'gumroad', icon: <FileKey2 />, name: 'OnChain Gumroad', text: 'Direct digital sales and licenses.' },
      { id: 'deadman', icon: <ShieldCheck />, name: "DeadMan's Vault", text: 'Heartbeat-based inheritance.' },
    ],
  },
] as const

function ZenithFlowDiagram() {
  return (
    <div className="article-flow article-flow--zenith" aria-label="Zenith Apps flow: discover, simulate or sign, then verify">
      <div className="article-flow__node"><Blocks size={20} /><strong>Discover</strong><small>Choose a task</small></div>
      <span className="article-flow__line"><i /><ArrowRight size={16} /></span>
      <div className="article-flow__node article-flow__node--active"><Zap size={20} /><strong>Simulate or sign</strong><small>Mode per contract</small></div>
      <span className="article-flow__line"><i /><ArrowRight size={16} /></span>
      <div className="article-flow__node"><ShieldCheck size={20} /><strong>Verify</strong><small>Receipt + Explorer</small></div>
    </div>
  )
}

function ZenithCatalog() {
  return (
    <div className="article-catalog">
      {zenithCatalog.map((category) => (
        <article className={`article-catalog__group article-catalog__group--${category.id}`} key={category.id}>
          <header>
            <span>{category.index}</span>
            <div><strong>{category.title}</strong><p>{category.text}</p></div>
          </header>
          <div className="article-catalog__apps">
            {category.apps.map((app) => (
              <a className="article-catalog__app" href={`${ZENITH_APP}#/app/${app.id}`} key={app.name}>
                <span>{app.icon}</span>
                <div><strong>{app.name}</strong><small>{app.text}</small></div>
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

function UnisonArticle() {
  return (
    <main className="article-page" id="top">
      <div className="article-hero">
        <div className="site-container article-hero__inner">
          <a className="article-back" href="#devlog"><ArrowLeft size={15} /> All field notes</a>
          <div className="article-hero__meta"><span>DEVLOG / 001</span><span>03 NOV 2026</span><span>5 MIN READ</span></div>
          <span className="article-hero__eyebrow">UNISON / BUILD LOG</span>
          <h1>One link from an EVM wallet to <em>Canton finality.</em></h1>
          <p>A brief look at the architecture and product choices behind our static settlement desk for Zenith Testnet.</p>
          <div className="article-hero__author">
            <span className="article-hero__avatar">AT</span>
            <span><strong>Arseniy Troshin</strong><small>Builder / Researcher</small></span>
          </div>
        </div>
      </div>

      <article className="article-body site-container">
        <div className="article-body__rail">
          <span>IN THIS NOTE</span>
          <a href="#article-problem">01 / Problem</a>
          <a href="#article-flow">02 / Flow</a>
          <a href="#article-decisions">03 / Decisions</a>
          <a href="#article-status">04 / Status</a>
        </div>

        <div className="article-body__content">
          <p className="article-lede">
            UNISON is a privacy-first React DApp that connects standard EVM wallets with Canton recipients through Zenith Gateway. A recipient creates a request; a payer opens the link, reviews the destination, and signs one transaction.
          </p>

          <section id="article-problem">
            <span className="article-section-label">01 / THE PROBLEM</span>
            <h2>Two execution models should not mean two confusing workflows.</h2>
            <p>
              EVM users expect an address, an amount, and a wallet confirmation. Canton uses full Party IDs and a different connectivity model. The product challenge was to preserve the guarantees of both systems while presenting one legible payment flow.
            </p>
            <div className="article-callout">
              <Sparkles size={20} />
              <p><strong>The product thesis</strong>A cross-network settlement should feel like opening a link—not operating a bridge.</p>
            </div>
          </section>

          <section id="article-flow">
            <span className="article-section-label">02 / THE FLOW</span>
            <h2>Resolve. Settle. Verify.</h2>
            <p>
              UNISON maps the complete Canton Party ID to its deterministic Gateway inbox. The payer sends ZTH or a registered asset from an EIP-1193 wallet. Zenith finalizes the EVM transaction through Canton consensus, and the resulting receipt becomes the settlement proof.
            </p>
            <FlowDiagram />
            <ol className="article-steps">
              <li><span>01</span><div><strong>Resolve</strong><p>Derive the recipient's Gateway inbox from the full Canton Party ID.</p></div></li>
              <li><span>02</span><div><strong>Settle</strong><p>Review the asset and destination, then sign with the wallet already in use.</p></div></li>
              <li><span>03</span><div><strong>Verify</strong><p>Link the finalized receipt to the Zenith explorer and keep a local activity record.</p></div></li>
            </ol>
          </section>

          <section id="article-decisions">
            <span className="article-section-label">03 / KEY DECISIONS</span>
            <h2>Static by design.</h2>
            <p>
              The payment request—including recipient, asset, amount, expiry, and memo—is encoded in the URL fragment. There is no application backend and no customer record to maintain. Saved recipients, requests, and activity stay in browser storage; private keys and bearer tokens do not.
            </p>
            <div className="decision-grid">
              <div><span>NO. 01</span><strong>URL as transport</strong><p>Requests are portable and independently shareable.</p></div>
              <div><span>NO. 02</span><strong>Wallet-native</strong><p>EIP-1193 for payers and CIP-103 for Canton identity.</p></div>
              <div><span>NO. 03</span><strong>Receipt as proof</strong><p>No arbitrary confirmation counter after finality.</p></div>
              <div><span>NO. 04</span><strong>Local by default</strong><p>Public workflow data stays on the current device.</p></div>
            </div>
          </section>

          <section id="article-status">
            <span className="article-section-label">04 / CURRENT STATUS</span>
            <h2>A working research build on Zenith Testnet.</h2>
            <p>
              The current build supports ZTH, DORIG, DUSD, and wCC; direct settlements; QR payment links; recipient setup; and local activity tracking. It is intentionally testnet-only while the integration surface and onboarding model are being explored.
            </p>
            <div className="article-stack">
              <span>React 19</span><span>TypeScript</span><span>Vite</span><span>ethers v6</span><span>Canton DApp SDK</span>
            </div>
            <div className="article-warning">
              <ShieldCheck size={20} />
              <p><strong>Research software</strong>UNISON currently targets Zenith Testnet. Test assets have no real-world value.</p>
            </div>
          </section>

          <div className="article-cta">
            <div><span>EXPLORE THE BUILD</span><h2>See UNISON in action.</h2></div>
            <div>
              <ButtonLink href={UNISON_APP}>Open DApp <ArrowUpRight size={16} /></ButtonLink>
              <ButtonLink href={UNISON_REPOSITORY} secondary external><Github size={16} /> View source</ButtonLink>
            </div>
          </div>
        </div>
      </article>
      <ContactStrip />
    </main>
  )
}

function ZenithArticle() {
  return (
    <main className="article-page article-page--zenith" id="top">
      <div className="article-hero article-hero--zenith">
        <div className="site-container article-hero__inner">
          <a className="article-back" href="#devlog"><ArrowLeft size={15} /> All field notes</a>
          <div className="article-hero__meta"><span>DEVLOG / 002</span><span>04 NOV 2026</span><span>7 MIN READ</span></div>
          <span className="article-hero__eyebrow">ZENITH APPS / BUILD LOG</span>
          <h1>Ten consumer dApps. <em>One coherent app layer.</em></h1>
          <p>How we made a complete smart-contract suite explorable before deployment—and ready to activate one product at a time.</p>
          <div className="article-hero__author">
            <span className="article-hero__avatar">AT</span>
            <span><strong>Arseniy Troshin</strong><small>Builder / Researcher</small></span>
          </div>
        </div>
      </div>

      <article className="article-body site-container">
        <div className="article-body__rail">
          <span>IN THIS NOTE</span>
          <a href="#zenith-thesis">01 / Product thesis</a>
          <a href="#zenith-architecture">02 / Architecture</a>
          <a href="#zenith-catalog">03 / App catalog</a>
          <a href="#zenith-safety">04 / Safety</a>
        </div>

        <div className="article-body__content">
          <p className="article-lede">
            Zenith Apps is a static-first suite of ten consumer products for payments, streaming finance, and digital assets. Every flow works in an explicit interface demo, then switches to real testnet execution as its contract address appears in the deployment manifest.
          </p>

          <div className="article-metrics" aria-label="Zenith Apps project metrics">
            <div><strong>10</strong><span>consumer dApps</span></div>
            <div><strong>13</strong><span>Solidity contracts</span></div>
            <div><strong>03</strong><span>product categories</span></div>
            <div><strong>0</strong><span>application servers</span></div>
          </div>

          <section id="zenith-thesis">
            <span className="article-section-label">01 / PRODUCT THESIS</span>
            <h2>Protocols are not product categories.</h2>
            <p>
              Most testnet experiences begin with a contract function. Zenith Apps begins with a recognizable job: send money by link, close a shared tab, stop a subscription, resell a ticket fairly, or protect assets for a beneficiary. The cryptography stays inspectable, but the interface speaks in outcomes.
            </p>
            <div className="article-callout article-callout--zenith">
              <Sparkles size={20} />
              <p><strong>The product thesis</strong>Choose a task, not a protocol—and keep the result verifiable.</p>
            </div>
          </section>

          <section id="zenith-architecture">
            <span className="article-section-label">02 / SUITE ARCHITECTURE</span>
            <h2>Demo first. Activate onchain contract by contract.</h2>
            <p>
              At startup, the frontend reads a public deployment manifest and resolves each app independently. A missing address keeps that workflow in local interface-demo mode. A deployed address activates wallet reads, approvals, writes, receipt confirmation, and Zenith Explorer links—without changing the product screen or adding an application backend.
            </p>
            <ZenithFlowDiagram />
            <ol className="article-steps">
              <li><span>01</span><div><strong>Discover</strong><p>Browse every workflow without connecting a wallet.</p></div></li>
              <li><span>02</span><div><strong>Resolve mode</strong><p>Match the app key to its address in the deployment manifest.</p></div></li>
              <li><span>03</span><div><strong>Simulate or sign</strong><p>Run locally in demo mode or submit through an EIP-1193 wallet.</p></div></li>
              <li><span>04</span><div><strong>Confirm</strong><p>Wait for the receipt and expose the result in Zenith Explorer.</p></div></li>
            </ol>
            <figure className="article-figure">
              <img src={`${import.meta.env.BASE_URL}images/zenith-zenlink.png`} alt="ZenLink secure transfer interface" loading="lazy" decoding="async" />
              <figcaption><span>INTERFACE / ZENLINK</span>One-time link transfers remain usable in demo mode and keep the same flow when the contract goes live.</figcaption>
            </figure>
          </section>

          <section id="zenith-catalog">
            <span className="article-section-label">03 / APP CATALOG</span>
            <h2>Ten focused flows, not ten empty dashboards.</h2>
            <p>
              The suite groups related jobs without flattening them into a generic contract console. Each app has its own onboarding, validation, generated demo state, transaction path, and visible trust assumptions.
            </p>
            <ZenithCatalog />
          </section>

          <section id="zenith-safety">
            <span className="article-section-label">04 / SAFETY & STATUS</span>
            <h2>Static, explicit, and testnet-only.</h2>
            <p>
              The production artifact talks directly to an injected wallet and Zenith public RPC. Temporary ZenLink secrets remain in the URL fragment, deployment keys stay outside the frontend, and demo-only mechanics are labeled in the interface. The contracts are open research software—not audited production infrastructure.
            </p>
            <div className="decision-grid">
              <div><span>NO. 01</span><strong>No app backend</strong><p>Static hosting, relative assets, and hash routes.</p></div>
              <div><span>NO. 02</span><strong>Progressive activation</strong><p>Each deployed contract becomes live independently.</p></div>
              <div><span>NO. 03</span><strong>Standard wallet surface</strong><p>EIP-1193 and ethers v6 for testnet execution.</p></div>
              <div><span>NO. 04</span><strong>Visible demo mechanics</strong><p>Oracle, faucet, time warp, and bot assumptions stay explicit.</p></div>
            </div>
            <div className="article-stack">
              <span>React 19</span><span>TypeScript</span><span>Solidity 0.8.30</span><span>ethers v6</span><span>Chain ID 936485</span>
            </div>
            <div className="article-warning article-warning--zenith">
              <ShieldCheck size={20} />
              <p><strong>Testnet by design</strong>ZTH and zUSDC have no real-world value. Never use production assets or keys.</p>
            </div>
          </section>

          <div className="article-cta article-cta--zenith">
            <div><span>EXPLORE THE SUITE</span><h2>Try all ten Zenith Apps.</h2></div>
            <div>
              <ButtonLink href={ZENITH_APP}>Open app suite <ArrowUpRight size={16} /></ButtonLink>
              <ButtonLink href={ZENITH_REPOSITORY} secondary external><Github size={16} /> View source</ButtonLink>
            </div>
          </div>
        </div>
      </article>
      <ContactStrip />
    </main>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>(readPage)
  const { t } = useLocale()

  useEffect(() => {
    const syncRoute = () => {
      const nextPage = readPage()
      setPage(nextPage)

      window.requestAnimationFrame(() => {
        if (nextPage !== 'home') {
          window.scrollTo({ top: 0, behavior: 'instant' })
          return
        }

        const targetId = window.location.hash.replace(/^#/, '')
        if (targetId && !targetId.startsWith('/')) {
          window.setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' }), 0)
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' })
        }
      })
    }

    window.addEventListener('hashchange', syncRoute)
    syncRoute()
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  useEffect(() => {
    const title = page === 'unison-article'
      ? 'UNISON build log — DoEpic.cc'
      : page === 'zenith-article'
        ? 'Zenith Apps build log — DoEpic.cc'
        : 'DoEpic.cc — Web3 product lab'
    const description = page === 'zenith-article'
      ? 'Inside Zenith Apps: ten consumer dApps, thirteen Solidity contracts, and progressive testnet activation.'
      : 'DoEpic.cc is an independent Web3 product lab: UNISON, Zenith Apps and open research, with more projects on the way.'
    document.title = t(title)
    document.querySelector('meta[name="description"]')?.setAttribute('content', t(description))
  }, [page, t])

  useCardEffects(page)

  const content = page === 'home'
    ? <HomePage />
    : page === 'unison-article'
      ? <UnisonArticle />
      : <ZenithArticle />

  return (
    <div className="site-shell">
      <Scene />
      <Header />
      {content}
      <Footer />
    </div>
  )
}
