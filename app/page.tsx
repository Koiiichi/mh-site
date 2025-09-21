import { Hero } from './(components)/hero';
import { ProjectsCarousel } from './(components)/projects-carousel/simple-carousel';
import { FooterClock } from './(components)/footer-clock';
import { Mail, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

const connectLinks = [
  { label: 'EMAIL', href: 'mailto:m57hassa@uwaterloo.ca', icon: Mail },
  { label: 'LINKEDIN', href: 'https://linkedin.com/in/muneeb-hassan-mh', icon: Linkedin },
  { label: 'X', href: 'https://x.com/muneebhassan', icon: Twitter },
  { label: 'GITHUB', href: 'https://github.com/Koiiichi', icon: Github }
];

const workExperience = [
  {
    time: 'Now',
    company: 'Midnight Sun Solar Car Team',
    url: 'https://www.uwmidsun.com/',
    role: 'Firmware Developer'
  },
  {
    time: 'Previously',
    company: 'Sapphire Fibres Limited',
    url: 'http://www.sapphire.com.pk/sfl/',
    role: 'Oracle ADF Developer Intern'
  },
  {
    time: '',
    company: 'Chirp Tech',
    url: 'https://chirptech.net/',
    role: 'Game Development Intern'
  }
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-16">
      <Hero />
      <ProjectsCarousel />
      
      {/* Work Section */}
      <section id="work" className="space-y-8">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Experience</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Work</h2>
        </header>
        <div className="space-y-6">
          {workExperience.map((work, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-24">
                {work.time && (
                  <span className="text-sm font-mono text-muted">{work.time}</span>
                )}
              </div>
              <div className="flex-1">
                <a
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-foreground hover:text-accent-1 transition-colors"
                >
                  <span className="font-medium">{work.company}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
                <p className="text-sm text-muted mt-0.5">{work.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="connect" className="space-y-8">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Connect</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Get in Touch</h2>
        </header>
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div className="space-y-4 text-base text-muted">
            <p>
              Reach out on LinkedIn or by email — can&apos;t wait to meet you!
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