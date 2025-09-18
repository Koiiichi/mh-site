import { Hero } from './(components)/hero';
import { ProjectsCarousel } from './(components)/projects-carousel/carousel';
import { BuildingList } from './(components)/building/building-list';
import { FooterClock } from './(components)/footer-clock';
import Link from 'next/link';

const writingLinks = [
  {
    title: 'Parallax as narrative device',
    href: 'https://mirror.xyz/muneeb/writing/parallax-narrative',
    meta: 'Notes · Coming soon'
  },
  {
    title: 'Designing multiplayer editors that stay quiet',
    href: 'https://mirror.xyz/muneeb/writing/multiplayer-editors',
    meta: 'Essay · Drafting'
  },
  {
    title: 'Edge-first analytics for ambient teams',
    href: 'https://mirror.xyz/muneeb/writing/ambient-teams',
    meta: 'Field notes · Outline'
  }
];

const connectLinks = [
  { label: 'Email', href: 'mailto:hello@muneeb.design' },
  { label: 'GitHub', href: 'https://github.com/muneeb-hassan' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muneeb-hassan/' },
  { label: 'Dribbble', href: 'https://dribbble.com/muneebhassan' }
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-24">
      <Hero />
      <ProjectsCarousel />
      <section className="grid gap-10 rounded-[2.5rem] border border-subtle bg-surface/80 px-10 py-12 shadow-[0_38px_120px_rgba(8,10,14,0.2)]">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Now</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What I’m orbiting</h2>
          </div>
          <p className="text-base text-muted">
            Building developer tools that feel like collaborators, evolving CoCode’s multiplayer rituals, and shaping
            humane documentation for the MLOX VM. Between cycles, I’m sketching tactile analytics surfaces and learning
            Urdu calligraphy again.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div data-surface className="flex flex-col gap-3 p-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Focus</span>
            <p className="text-lg font-semibold">Design engineering at the compiler layer</p>
            <p className="text-sm text-muted">
              Extending Lox into a tactile language with tracing, interactive notebooks, and visual bytecode diffing.
            </p>
          </div>
          <div data-surface className="flex flex-col gap-3 p-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Exploration</span>
            <p className="text-lg font-semibold">Ambient metrics without dashboards</p>
            <p className="text-sm text-muted">
              Experimenting with narrative-driven analytics that live inside the workflows instead of dashboards.
            </p>
          </div>
          <div data-surface className="flex flex-col gap-3 p-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Learning</span>
            <p className="text-lg font-semibold">Calligraphy, Urdu type, and motion systems</p>
            <p className="text-sm text-muted">
              Studying stroke contrast to inform variable typography and responsive motion curves in product systems.
            </p>
          </div>
        </div>
      </section>
      <BuildingList />
      <section id="writing" className="space-y-6">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Writing</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Signals in draft</h2>
        </header>
        <div className="grid gap-4">
          {writingLinks.map((entry) => (
            <Link
              key={entry.title}
              href={entry.href}
              className="group flex items-center justify-between gap-6 rounded-2xl border border-subtle bg-surface/70 px-6 py-4 transition hover:border-accent-1"
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-accent-1">{entry.title}</h3>
                <p className="text-sm text-muted">{entry.meta}</p>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Soon</span>
            </Link>
          ))}
        </div>
      </section>
      <section id="connect" className="space-y-8">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Connect</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Let’s build resonance</h2>
        </header>
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div className="space-y-4 text-base text-muted">
            <p>
              I’m open to collaborations on developer tooling, creative research, and systems work where design and
              engineering blur. The sweet spot: small teams shipping purposeful craft with patience.
            </p>
            <p>
              Email is best. I read everything, even if it takes a moment to reply. Mentorship requests are welcome—tell
              me what you’re exploring.
            </p>
          </div>
          <div data-surface className="flex flex-col gap-3 p-6">
            <a
              href="mailto:hello@muneeb.design"
              className="text-lg font-semibold text-foreground transition hover:text-accent-1"
            >
              hello@muneeb.design
            </a>
            <div className="flex flex-wrap gap-3 text-sm text-muted">
              {connectLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-subtle px-3 py-1.5 transition hover:border-accent-1 hover:text-accent-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <FooterClock />
    </main>
  );
}
