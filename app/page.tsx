import { Hero } from './(components)/hero';
import { ProjectsCarousel } from './(components)/projects-carousel/carousel';
import { BuildingList } from './(components)/building/building-list';
import { FooterClock } from './(components)/footer-clock';
import { GitHubWidget } from './(components)/github-widget';
import Link from 'next/link';

const writingLinks = [
  {
    title: 'Building a Custom Language Interpreter in C',
    href: '#',
    meta: 'Technical deep-dive · Coming soon'
  },
  {
    title: 'Real-time Collaboration in Web Applications',
    href: '#',
    meta: 'Case study · Planning'
  },
  {
    title: 'From Data to Sound: Particle Physics Sonification',
    href: '#',
    meta: 'Research notes · Draft'
  }
];

const connectLinks = [
  { label: 'Email', href: 'mailto:m57hassa@uwaterloo.ca' },
  { label: 'GitHub', href: 'https://github.com/Koiiichi' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/muneeb-hassan-mh' },
  { label: 'Phone', href: 'tel:+14376693239' }
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
          <div className="space-y-4">
            <p className="text-base text-muted">
              Developing firmware for the Midnight Sun Solar Car Team, extending the MLOX language interpreter, and 
              building collaborative tools with CoCode. Currently pursuing Computational Mathematics at the University 
              of Waterloo while exploring systems programming and compiler design.
            </p>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-3">Latest commit</p>
              <GitHubWidget />
            </div>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div data-surface className="flex flex-col gap-3 p-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Focus</span>
            <p className="text-lg font-semibold">Systems programming & firmware development</p>
            <p className="text-sm text-muted">
              Building modular button managers with FreeRTOS integration for the MSXVI solar vehicle, focusing on real-time reliability.
            </p>
          </div>
          <div data-surface className="flex flex-col gap-3 p-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Exploration</span>
            <p className="text-lg font-semibold">Language design & compiler architecture</p>
            <p className="text-sm text-muted">
              Extending the Lox interpreter with modern features, exploring virtual machine architecture and bytecode optimization.
            </p>
          </div>
          <div data-surface className="flex flex-col gap-3 p-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Learning</span>
            <p className="text-lg font-semibold">Collaborative development tools</p>
            <p className="text-sm text-muted">
              Building real-time collaborative editors with conflict resolution, studying distributed systems and user experience design.
            </p>
          </div>
        </div>
      </section>
      <BuildingList />
      <section id="writing" className="space-y-6">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Writing</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Blogs coming soon!</h2>
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
              href="mailto:m57hassa@uwaterloo.ca"
              className="text-lg font-semibold text-foreground transition hover:text-accent-1"
            >
              m57hassa@uwaterloo.ca
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
