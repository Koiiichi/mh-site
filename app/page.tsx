'use client';

import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Hero } from './(components)/hero';
import { ProjectsCarousel } from './(components)/projects-carousel/simple-carousel';
import { Now } from './(components)/now';
import { FooterClock } from './(components)/footer-clock';
import { useFocusLine } from '@/lib/hooks/useFocusLine';

const connectLinks = [
  { label: 'EMAIL', href: 'mailto:m57hassa@uwaterloo.ca', icon: Mail },
  { label: 'LINKEDIN', href: 'https://linkedin.com/in/muneeb-hassan-mh', icon: Linkedin },
  { label: 'GITHUB', href: 'https://github.com/Koiiichi', icon: Github }
];

const workExperience = [
  //{
    //time: 'Now',
    // NOTE: Update when the co-op for spring term is confirmed. 
  //},
  {
    time: 'Previously',
    company: 'Latii',
    url: 'https://latii.com/',
    role: 'AI R&D Engineer'
  },
  {
    company: 'WATonomous',
    url: 'https://www.watonomous.ca',
    role: 'Autonomous Systems Engineer'
  },
  {
    time: '',
    company: 'Sapphire Fibres Limited',
    url: 'http://www.sapphire.com.pk/sfl/',
    role: 'Data Engineering Intern'
  },
];

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const workRef = useFocusLine<HTMLDivElement>();
  const connectRef = useFocusLine<HTMLDivElement>();

  return (
    <main className="flex flex-1 flex-col gap-24">
      <Hero />

      {/* Work — content left, briefcase orb right, hairline spine between. */}
      <section
        id="work"
        className="flex min-h-[80vh] flex-col justify-center md:pr-[44%]"
      >
        <motion.div
          ref={workRef}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-10 md:border-r md:border-subtle md:pr-12"
        >
          <header className="flex flex-col gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Experience</p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Work</h2>
          </header>
          <div className="space-y-8">
            {workExperience.map((work, index) => (
              <div key={index} data-focus-item className="flex items-start gap-4">
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
        </motion.div>
      </section>

      <ProjectsCarousel />

      <Now />

      {/* Connect — cherry-bonsai bookend: orb centered, links below (mirrors hero). */}
      <section
        id="connect"
        className="flex min-h-[90vh] flex-col items-center justify-end gap-8 pb-[14vh] text-center"
      >
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Contact</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Connect</h2>
        </header>
        <p className="max-w-xl text-base text-muted">
          Feel free to reach out on LinkedIn or by email.
        </p>
        <div ref={connectRef} className="flex flex-wrap justify-center gap-3">
          {connectLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.label}
                data-focus-item
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
      </section>
      <FooterClock />
    </main>
  );
}