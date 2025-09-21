'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, X } from 'lucide-react';
import projectsData from '@/data/projects.json';
import { Project } from '@/lib/types';
import { projectDetails } from './project-details';

export function ProjectsCarousel() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const projects = projectsData as unknown as Project[];

  const openModal = (slug: string) => {
    setSelectedProject(slug);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <section id="projects" className="relative">
        <div className="space-y-8">
          <header className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Selected work</p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Projects</h2>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.slug}
                className="group relative overflow-hidden rounded-[1.5rem] border border-subtle bg-surface/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_16px_40px_rgb(0,0,0,0.16)] hover:border-accent-1/20 cursor-pointer"
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={() => openModal(project.slug)}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-accent-1 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted mt-1">{project.summary}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted group-hover:text-accent-1 transition-colors" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Translucent background */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            
            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                duration: 0.3
              }}
              className="relative w-full max-w-5xl max-h-[85vh] overflow-y-auto bg-surface/95 backdrop-blur-xl border border-subtle rounded-[2rem] p-8 shadow-[0_32px_64px_rgb(0,0,0,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 rounded-full bg-surface-muted hover:bg-border transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {(() => {
                const project = projects.find(p => p.slug === selectedProject);
                const details = projectDetails[selectedProject as keyof typeof projectDetails];
                if (!project || !details) return null;

                return (
                  <div className="space-y-8">
                    {/* Header */}
                    <header className="space-y-4">
                      <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
                      <p className="text-lg text-muted max-w-3xl">{details.overview}</p>
                    </header>

                    <div className="space-y-8">
                      {/* Background */}
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Background</h3>
                        <p className="text-muted">{details.background}</p>
                      </div>

                      {/* Architecture */}
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Architecture</h3>
                        <ul className="space-y-2">
                          {details.architecture.map((item: string, index: number) => (
                            <li key={index} className="text-muted flex">
                              <span className="mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Challenges */}
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Challenges</h3>
                        <ul className="space-y-2">
                          {details.challenges.map((item: string, index: number) => (
                            <li key={index} className="text-muted flex">
                              <span className="mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Results */}
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Results</h3>
                        <p className="text-muted">{details.results}</p>
                      </div>

                      {/* Timeline & Tools */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-3">Timeline</h3>
                          <p className="text-muted">{details.timeline}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-3">Tools</h3>
                          <div className="flex flex-wrap gap-2">
                            {details.tools.map((tool: string, index: number) => (
                              <span
                                key={index}
                                className="rounded-full bg-surface-muted px-3 py-1 text-sm text-muted"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Links */}
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Links</h3>
                        <div className="flex flex-wrap gap-3">
                          {details.links.map((link: { label: string; url: string }, index: number) => (
                            <Link
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-subtle bg-surface px-4 py-2 text-sm font-medium transition hover:border-accent-1 hover:text-accent-1"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}