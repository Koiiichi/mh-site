import { Hero } from './(components)/hero';
import { ProjectsCarousel } from './(components)/projects-carousel/simple-carousel';
import { FooterClock } from './(components)/footer-clock';
import { Mail, Github, Linkedin, Phone } from 'lucide-react';

const connectLinks = [
  { label: 'EMAIL', href: 'mailto:m57hassa@uwaterloo.ca', icon: Mail },
  { label: 'GITHUB', href: 'https://github.com/Koiiichi', icon: Github },
  { label: 'LINKEDIN', href: 'https://linkedin.com/in/muneeb-hassan-mh', icon: Linkedin },
  { label: 'PHONE', href: 'tel:+14376693239', icon: Phone }
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-24">
      <Hero />
      <ProjectsCarousel />
      <section id="connect" className="space-y-8">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Connect</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Let&apos;s build resonance</h2>
        </header>
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div className="space-y-4 text-base text-muted">
            <p>
              I&apos;m open to collaborations on developer tooling, creative research, and systems work where design and
              engineering blur. The sweet spot: small teams shipping purposeful craft with patience.
            </p>
            <p>
              Email is best. I read everything, even if it takes a moment to reply. Mentorship requests are welcome—tell
              me what you&apos;re exploring.
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
              {connectLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-subtle px-3 py-1.5 transition hover:border-accent-1 hover:text-accent-1"
                  >
                    <IconComponent className="h-3 w-3" />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <FooterClock />
    </main>
  );
}