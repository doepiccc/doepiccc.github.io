import { useEffect, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Braces,
  Check,
  CheckCircle2,
  CircleDot,
  Code2,
  Github,
  Layers3,
  Linkedin,
  Menu,
  Network,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react'
import { LanguageSwitch } from './i18n/LocaleContext'

const LINKEDIN_URL = 'https://www.linkedin.com/in/arsenik/'
const UNISON_REPOSITORY = 'https://github.com/doepiccc/UnisonZenithEVMDapp'
const UNISON_APP = `${import.meta.env.BASE_URL}unison/`

type Page = 'home' | 'unison-article'

function readPage(): Page {
  return window.location.hash === '#/journal/unison' ? 'unison-article' : 'home'
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand ${compact ? 'brand--compact' : ''}`}>
      <svg className="brand__mark" viewBox="0 0 64 52" aria-hidden="true">
        <defs>
          <linearGradient id="brand-sun" x1="32" y1="21" x2="32" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff7754" />
            <stop offset="1" stopColor="#ff493f" />
          </linearGradient>
        </defs>
        <path d="M16 45a16 16 0 0 1 32 0H16Z" fill="url(#brand-sun)" />
        <path d="M21 45a11 11 0 0 1 22 0" fill="#ff8968" opacity=".35" />
        <g fill="none" stroke="#ff654b" strokeWidth="3.8" strokeLinecap="square">
          <path d="M32 4v20M13 12l10 14M51 12 41 26M4 27l15 8M60 27l-15 8M3 46h58" />
        </g>
        <g fill="#ff654b">
          <rect x="30.1" y="0" width="3.8" height="4" />
          <rect x="8.9" y="7.2" width="4" height="4" transform="rotate(-35 10.9 9.2)" />
          <rect x="51.1" y="7.2" width="4" height="4" transform="rotate(35 53.1 9.2)" />
        </g>
      </svg>
      <span className="brand__word">doepic.cc</span>
    </span>
  )
}

function Header({ page }: { page: Page }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__brand" href="#top" aria-label="DoEpic.cc home">
          <Brand />
        </a>

        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#devlog">Devlog</a>
          <a href="#about">About</a>
          {page === 'unison-article' && <a className="site-nav__back" href="#devlog"><ArrowLeft size={14} /> Home</a>}
        </nav>

        <div className="site-header__actions">
          <LanguageSwitch />
          <span className="network-status"><i /> Online</span>
          <a className="linkedin-badge linkedin-badge--header" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            <Linkedin size={15} fill="currentColor" />
            <span>LinkedIn</span>
            <ArrowUpRight size={13} />
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
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

function ProtocolVisual() {
  const trackPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <div className="protocol-visual" onPointerMove={trackPointer}>
      <div className="protocol-visual__glow" />
      <div className="protocol-visual__topline">
        <span><Radio size={13} /> Research node</span>
        <span>Live / 0x01</span>
      </div>

      <div className="protocol-orbit" aria-hidden="true">
        <div className="protocol-orbit__ring protocol-orbit__ring--one" />
        <div className="protocol-orbit__ring protocol-orbit__ring--two" />
        <div className="protocol-orbit__ring protocol-orbit__ring--three" />
        <div className="protocol-orbit__axis protocol-orbit__axis--x" />
        <div className="protocol-orbit__axis protocol-orbit__axis--y" />
        <div className="protocol-orbit__sun">
          <span>R&D</span>
          <small>CORE</small>
        </div>
        <div className="protocol-node protocol-node--evm"><i /><span>EVM</span><small>EXECUTION</small></div>
        <div className="protocol-node protocol-node--data"><i /><span>DATA</span><small>INDEX</small></div>
        <div className="protocol-node protocol-node--wallet"><i /><span>UX</span><small>WALLET</small></div>
        <svg className="protocol-orbit__route" viewBox="0 0 520 410" preserveAspectRatio="none">
          <path d="M82 275 C130 250 155 125 260 199 S388 225 448 100" />
          <path className="protocol-orbit__route-pulse" d="M82 275 C130 250 155 125 260 199 S388 225 448 100" />
        </svg>
      </div>

      <div className="protocol-console">
        <span><i className="console-dot console-dot--cyan" /> wallet:connected</span>
        <span><i className="console-dot console-dot--orange" /> block:final</span>
        <span className="protocol-console__hash">0x7A2F...19C4</span>
      </div>
    </div>
  )
}

function SectionHeading({ index, eyebrow, title, text }: { index: string; eyebrow: string; title: string; text?: string }) {
  return (
    <header className="section-heading">
      <div className="section-heading__index">[{index}]</div>
      <div className="section-heading__copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__grid site-container">
        <div className="hero__copy">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-icon"><Blocks size={14} /></span>
            Independent Web3 product lab
            <span className="hero__eyebrow-code">// 001</span>
          </div>
          <h1>Building the <span>useful layer</span> of Web3.</h1>
          <p className="hero__lead">
            We design DApps and research the protocols beneath them—turning complex crypto rails into products people can actually use.
          </p>
          <div className="hero__actions">
            <ButtonLink href="#work">Explore the work <ArrowDownRight size={17} /></ButtonLink>
            <ButtonLink href="#devlog" secondary>Read the devlog <ArrowRight size={17} /></ButtonLink>
          </div>
          <div className="hero__proof">
            <span><Check size={13} /> Product-minded engineering</span>
            <span><Check size={13} /> Open research notes</span>
          </div>
        </div>
        <ProtocolVisual />
      </div>

      <div className="hero-ticker" aria-label="Areas of practice">
        <div className="hero-ticker__track">
          <span>DApp development</span><i />
          <span>Protocol research</span><i />
          <span>Wallet UX</span><i />
          <span>Open source</span><i />
          <span>DApp development</span><i />
          <span>Protocol research</span><i />
          <span>Wallet UX</span><i />
          <span>Open source</span><i />
        </div>
      </div>
    </section>
  )
}

const practices = [
  {
    icon: <Code2 size={21} />,
    label: 'Build',
    title: 'DApp engineering',
    text: 'Production-minded interfaces for wallets, onchain workflows, and protocol-native products.',
    code: 'REACT / TYPESCRIPT / EVM',
    color: 'cyan',
  },
  {
    icon: <Search size={21} />,
    label: 'Study',
    title: 'Protocol research',
    text: 'Hands-on investigation of execution, settlement, identity, and the trust assumptions in between.',
    code: 'SYSTEMS / FLOWS / RISK',
    color: 'orange',
  },
  {
    icon: <Braces size={21} />,
    label: 'Share',
    title: 'Open build notes',
    text: 'Clear field notes from experiments: architecture choices, rough edges, and what we learned shipping.',
    code: 'DEVLOG / SOURCE / PROOFS',
    color: 'violet',
  },
]

function Practices() {
  return (
    <section className="section section--practices" id="research">
      <div className="site-container">
        <SectionHeading
          index="01"
          eyebrow="What we do"
          title="Research that ends in working software."
          text="No trend reports from the sidelines. We learn protocols by building on them, then publish the useful parts."
        />
        <div className="practice-grid">
          {practices.map((practice, index) => (
            <article className={`practice-card practice-card--${practice.color}`} key={practice.title}>
              <div className="practice-card__top">
                <span className="practice-card__icon">{practice.icon}</span>
                <span className="practice-card__number">0{index + 1}</span>
              </div>
              <span className="practice-card__label">{practice.label}</span>
              <h3>{practice.title}</h3>
              <p>{practice.text}</p>
              <div className="practice-card__code"><i /> {practice.code}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectBrowser() {
  return (
    <div className="project-browser">
      <div className="project-browser__bar">
        <span className="browser-dots"><i /><i /><i /></span>
        <span className="browser-address"><ShieldCheck size={12} /> doepic.cc/unison/</span>
        <span className="browser-live"><i /> LIVE</span>
      </div>
      <div className="project-browser__screen">
        <img src={`${import.meta.env.BASE_URL}images/unison-overview.png`} alt="UNISON settlement dashboard overview" />
        <div className="project-browser__scan" />
      </div>
    </div>
  )
}

function FeaturedProject() {
  return (
    <section className="section section--project" id="work">
      <div className="site-container">
        <SectionHeading
          index="02"
          eyebrow="Featured build"
          title="One interface. Two execution worlds."
        />
        <article className="project-card">
          <div className="project-card__header">
            <div className="unison-lockup">
              <span className="unison-symbol"><Layers3 size={24} /></span>
              <span><strong>UNISON</strong><small>Settlement desk</small></span>
            </div>
            <div className="project-card__badges">
              <span><i /> Zenith Testnet</span>
              <span>Open source</span>
            </div>
          </div>

          <div className="project-card__body">
            <div className="project-card__copy">
              <span className="project-kicker">EVM → CANTON</span>
              <h3>Shareable settlement requests, without a backend.</h3>
              <p>
                UNISON is a privacy-first React DApp for creating and paying Canton settlement requests from a standard EVM wallet through Zenith Gateway.
              </p>
              <ul className="project-features">
                <li><CheckCircle2 size={16} /> URL-encoded payment requests</li>
                <li><CheckCircle2 size={16} /> Deterministic Gateway inbox resolution</li>
                <li><CheckCircle2 size={16} /> One-receipt Canton finality</li>
              </ul>
              <div className="project-card__actions">
                <ButtonLink href={UNISON_APP}>Open DApp <ArrowUpRight size={16} /></ButtonLink>
                <ButtonLink href={UNISON_REPOSITORY} secondary external><Github size={16} /> Source</ButtonLink>
              </div>
            </div>
            <ProjectBrowser />
          </div>

          <div className="project-card__footer">
            <span>REACT 19</span><i />
            <span>ETHERS V6</span><i />
            <span>CIP-103</span><i />
            <span>STATIC-FIRST</span>
          </div>
        </article>
      </div>
    </section>
  )
}

const researchRows = [
  { icon: <Layers3 size={20} />, number: '01', title: 'Protocol interfaces', text: 'Zenith EVM + Canton settlement' },
  { icon: <WalletCards size={20} />, number: '02', title: 'Wallet experience', text: 'EIP-1193 + CIP-103 connectivity' },
  { icon: <ShieldCheck size={20} />, number: '03', title: 'Trust & finality', text: 'Receipts, proofs, and failure modes' },
]

function ResearchSignal() {
  return (
    <section className="section section--signal" id="about">
      <div className="site-container signal-grid">
        <div className="signal-copy">
          <span className="eyebrow">Our point of view</span>
          <h2>Web3,<br /><em>without the fog.</em></h2>
          <p>
            Good infrastructure disappears into a clear product. We focus on the last mile: where protocol guarantees meet human decisions.
          </p>
          <a className="text-link" href="#devlog">Read our field notes <ArrowRight size={15} /></a>
        </div>
        <div className="research-panel">
          <div className="research-panel__head">
            <span><CircleDot size={14} /> Active research surface</span>
            <span>03 SIGNALS</span>
          </div>
          {researchRows.map((row) => (
            <div className="research-row" key={row.number}>
              <span className="research-row__icon">{row.icon}</span>
              <span className="research-row__number">/{row.number}</span>
              <div><strong>{row.title}</strong><small>{row.text}</small></div>
              <ArrowUpRight size={17} />
            </div>
          ))}
          <div className="research-panel__foot">
            <span>STATUS</span>
            <strong><i /> Building in public</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

function Devlog() {
  return (
    <section className="section section--devlog" id="devlog">
      <div className="site-container">
        <SectionHeading
          index="03"
          eyebrow="Development blog"
          title="Notes from the build."
          text="Short, practical entries about the products, protocols, and decisions behind the work."
        />
        <a className="devlog-card" href="#/journal/unison">
          <div className="devlog-card__meta">
            <span className="devlog-card__index">DEVLOG / 001</span>
            <span>03 NOV 2026</span>
            <span>5 MIN READ</span>
          </div>
          <div className="devlog-card__content">
            <div className="devlog-card__graphic" aria-hidden="true">
              <span className="devlog-card__sun" />
              <span className="devlog-card__route" />
              <span className="devlog-card__node devlog-card__node--one">EVM</span>
              <span className="devlog-card__node devlog-card__node--two">CANTON</span>
            </div>
            <div className="devlog-card__copy">
              <span className="devlog-card__category">BUILD LOG / UNISON</span>
              <h3>One link from an EVM wallet to Canton finality.</h3>
              <p>How we built a static, privacy-first settlement desk on Zenith—and why the payment request lives in the URL.</p>
              <div className="devlog-card__tags"><span>ARCHITECTURE</span><span>WALLET UX</span><span>SETTLEMENT</span></div>
            </div>
            <span className="devlog-card__arrow"><ArrowUpRight size={22} /></span>
          </div>
        </a>
      </div>
    </section>
  )
}

function ContactStrip() {
  return (
    <section className="contact-strip">
      <div className="site-container contact-strip__inner">
        <div>
          <span className="eyebrow">Start a conversation</span>
          <h2>Have a protocol worth making <em>usable?</em></h2>
        </div>
        <a className="linkedin-badge linkedin-badge--large" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
          <span className="linkedin-badge__icon"><Linkedin size={22} fill="currentColor" /></span>
          <span><small>Connect on</small><strong>LinkedIn</strong></span>
          <ArrowUpRight size={19} />
        </a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer__inner">
        <a href="#top" aria-label="doepic.cc — back to top"><Brand compact /></a>
        <p>Independent DApp development<br />and protocol research.</p>
        <div className="site-footer__links">
          <a href={UNISON_REPOSITORY} target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn</a>
        </div>
        <span className="site-footer__copy">© {new Date().getFullYear()} DOEPIC.CC</span>
      </div>
    </footer>
  )
}

function HomePage() {
  return (
    <main>
      <Hero />
      <Practices />
      <FeaturedProject />
      <ResearchSignal />
      <Devlog />
      <ContactStrip />
    </main>
  )
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

export default function App() {
  const [page, setPage] = useState<Page>(readPage)

  useEffect(() => {
    const syncRoute = () => {
      const nextPage = readPage()
      setPage(nextPage)

      window.requestAnimationFrame(() => {
        if (nextPage === 'unison-article') {
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
    document.title = page === 'unison-article'
      ? 'UNISON build log — DoEpic.cc'
      : 'DoEpic.cc — Web3 product lab'
  }, [page])

  return (
    <div className="site-shell">
      <Header page={page} />
      {page === 'home' ? <HomePage /> : <UnisonArticle />}
      <Footer />
    </div>
  )
}
