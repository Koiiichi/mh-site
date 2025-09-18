import { Hero } from './(components)/hero';
import { ProjectsCarousel } from './(components)/projects-carousel/carousel';
import { BuildingList } from './(components)/building/building-list';
import { FooterClock } from './(components)/footer-clock';
import { LatestCommitCard } from './(components)/latest-commit';

const experiences = [
  {
    company: 'Midnight Sun Solar Car Team',
    role: 'Firmware Developer',
    timeframe: 'Oct 2024 — Present',
    location: 'Waterloo, ON',
    bullets: [
      'Designed a modular, debounced input manager that lifted steering reliability by 10% in full system tests.',
      'Integrated input handling into FreeRTOS scheduling for deterministic, low-latency driver controls.',
      'Provisioned static tasks, timers, and semaphores across the MSXVI vehicle for safe scheduling.'
    ],
    tags: ['FreeRTOS', 'Embedded C', 'STM32']
  },
  {
    company: 'Sapphire Fibres Limited',
    role: 'Oracle ADF Developer Intern',
    timeframe: 'Jun 2023 — Aug 2023',
    location: 'Lahore, PK',
    bullets: [
      'Built supplier onboarding and asset registration modules that cut manual entry by 15%.',
      'Squashed legacy ERP defects and co-developed inventory tracking flows used by 400+ operators.',
      'Automated supplier performance reports and asset logs, saving 10+ hours per week across teams.'
    ],
    tags: ['Oracle ADF', 'PL/SQL', 'Enterprise Apps']
  },
  {
    company: 'Chirp Tech',
    role: 'Game Development Intern',
    timeframe: 'Jun 2022 — Aug 2022',
    location: 'Lahore, PK',
    bullets: [
      'Co-created a cross-platform Unreal Engine experience with networking that scales to 10k+ users.',
      'Engineered multiplayer session logic that reduced latency while supporting 50+ concurrent players.',
      'Migrated critical UI and state logic from Blueprints to C++ for stability and maintainability.'
    ],
    tags: ['Unreal Engine', 'C++', 'Networking']
  }
];

const education = [
  {
    school: 'University of Waterloo',
    credential: 'Bachelor of Mathematics, Computational Mathematics (Joint Statistics) · Minor in Computing',
    timeframe: '2023 — Aug 2029 · Co-op Seq. 3',
    location: 'Waterloo, ON',
    details: [
      'GPA 3.7 · 2A term in Fall 2025',
      'Course interests: numerical methods, stochastic processes, systems programming'
    ]
  }
];

const connectLinks = [
  { label: 'Email', href: 'mailto:m57hassa@uwaterloo.ca' },
  { label: 'GitHub', href: 'https://github.com/Koiiichi' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muneeb-hassan-mh/' }
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-24">
      <Hero />
      <section id="experience" className="space-y-8">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Experience</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Crafting in the field</h2>
          <p className="max-w-2xl text-sm text-muted">
            Co-op roles and internships where I grew resilient systems thinking across firmware, enterprise platforms, and
            networked experiences.
          </p>
        </header>
        <div className="grid gap-6">
          {experiences.map((experience) => (
            <article
              key={`${experience.company}-${experience.role}`}
              className="grid gap-6 rounded-[2rem] border border-subtle bg-surface/80 p-8 shadow-[0_30px_90px_rgba(8,10,14,0.18)] md:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]"
            >
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">{experience.timeframe}</span>
                  <h3 className="text-2xl font-semibold text-foreground">{experience.role}</h3>
                  <p className="text-sm text-muted">{experience.company} · {experience.location}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted">
                  {experience.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-surface-muted px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <ul className="space-y-3 text-sm text-muted">
                {experience.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-2xl border border-transparent bg-surface/70 p-4">
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <ProjectsCarousel />
      <section className="grid gap-10 rounded-[2.5rem] border border-subtle bg-surface/80 px-10 py-12 shadow-[0_38px_120px_rgba(8,10,14,0.2)]">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Now</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What I’m orbiting</h2>
          </div>
          <p className="text-base text-muted">
            Current slices of work across firmware, collaborative tooling, and mathematical explorations — plus a live
            pulse of what just shipped on GitHub.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <article data-surface className="flex flex-col gap-3 rounded-3xl border border-subtle bg-surface/80 p-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Firmware</span>
            <p className="text-lg font-semibold">Stabilising MSXVI steering stack</p>
            <p className="text-sm text-muted">
              Extending the button manager into telemetry hooks so race controls stay debounced and observable.
            </p>
          </article>
          <article data-surface className="flex flex-col gap-3 rounded-3xl border border-subtle bg-surface/80 p-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Collaboration</span>
            <p className="text-lg font-semibold">Scaling CoCode’s session tools</p>
            <p className="text-sm text-muted">
              Building merge-safe branching, live diffing, and presence rituals inspired by IDE muscle memory.
            </p>
          </article>
          <article data-surface className="flex flex-col gap-3 rounded-3xl border border-subtle bg-surface/80 p-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Learning</span>
            <p className="text-lg font-semibold">Statistical modelling & DSP</p>
            <p className="text-sm text-muted">
              Exploring stochastic processes and digital signal processing to inform future data sonification work.
            </p>
          </article>
          <LatestCommitCard />
        </div>
      </section>
      <BuildingList />
      <section id="education" className="space-y-8">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Education</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Grounded in math & computing</h2>
        </header>
        <div className="grid gap-6">
          {education.map((entry) => (
            <article
              key={entry.school}
              className="rounded-[2rem] border border-subtle bg-surface/80 p-8 shadow-[0_30px_90px_rgba(8,10,14,0.18)]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">{entry.school}</h3>
                  <p className="text-sm text-muted">{entry.credential}</p>
                </div>
                <div className="text-right text-sm text-muted">
                  <p>{entry.timeframe}</p>
                  <p>{entry.location}</p>
                </div>
              </div>
              <ul className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
                {entry.details.map((detail) => (
                  <li key={detail} className="rounded-2xl border border-transparent bg-surface/70 p-4">
                    {detail}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section id="writing" className="space-y-6">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Writing</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Signals in draft</h2>
        </header>
        <div className="grid gap-4">
          <article className="group flex items-center justify-between gap-6 rounded-2xl border border-subtle bg-surface/70 px-6 py-5 transition hover:border-accent-1">
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent-1">Blogs coming soon!</h3>
              <p className="text-sm text-muted">Long-form breakdowns on firmware patterns, collaborative DX, and data sonification are on the drafting table.</p>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Stay tuned</span>
          </article>
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
              I’m open to firmware, data tooling, and collaborative product roles where thoughtful engineering and
              interaction design meet. I thrive in small teams pairing rigorous math with tangible prototypes.
            </p>
            <p>
              Email is best. I respond as quickly as school and co-op allow, and I’m always happy to mentor folks exploring
              embedded systems or multiplayer experience design.
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
