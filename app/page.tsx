'use client';

import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react';
import { Hero } from './(components)/hero';
import { ProjectsCarousel } from './(components)/projects-carousel/simple-carousel';
import { Now } from './(components)/now';
import { FooterClock } from './(components)/footer-clock';

const connectLinks = [
  { label: 'EMAIL', href: 'mailto:m57hassa@uwaterloo.ca', icon: Mail },
  { label: 'LINKEDIN', href: 'https://linkedin.com/in/muneeb-hassan-mh', icon: Linkedin },
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
    <main className="flex flex-1 flex-col gap-12">
      <Hero />
      
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
                  className="group inline-flex items-center gap-2 text-foreground hover:text-accent-1 transition-colors duration-200"
                >
                  <span className="font-medium">{work.company}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
                <p className="text-sm text-muted mt-0.5">{work.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProjectsCarousel />

      <Now />

      <section id="connect" className="space-y-8">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Connect</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Get in Touch</h2>
        </header>
        <div className="space-y-6">
          <p className="text-base text-muted max-w-2xl">
            Feel free to reach out on LinkedIn or by email.
          </p>
          <div className="flex flex-wrap gap-3">
            {connectLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-subtle bg-surface px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:border-accent-1 hover:text-accent-1 hover:shadow-md"
                >
                  <IconComponent className="h-4 w-4" />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>
      <FooterClock />
    </main>
  );
}