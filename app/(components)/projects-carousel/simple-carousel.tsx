'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, X } from 'lucide-react';
import projectsData from '@/data/projects.json';
import { Project } from '@/lib/types';

const projectDetails: Record<string, { overview: string; architecture: string[]; timeline: string; tools: string; links: { label: string; url: string }[] }> = {
  cocode: {
    overview: "CoCode is a collaborative, web-based code editor designed for real-time programming and team workflows. Inspired by the simplicity of Google Docs and the familiarity of desktop IDEs, it combines multi-user concurrency, conflict resolution, and project persistence with a VS Code–like interface powered by Monaco Editor. What started as a \"glorified Notepad++ online\" grew into a fully featured development platform for teams.",
    architecture: [
      "Frontend: TypeScript, React, Tailwind CSS for scalable UI/UX",
      "Editor Core: Monaco Editor integration providing syntax highlighting, auto-detection of languages, and a VS Code–like editing experience",
      "Backend & Persistence: Firebase Realtime Database for live synchronization and Firestore/Storage for structured persistence",
      "Authentication: Firebase Authentication supporting Google, GitHub, and email login",
      "Collaboration Features: Live cursors, session presence tracking, tabbed file navigation, and cross-user project sync",
      "Deployment: Vercel-hosted with GitHub workflows for CI/CD"
    ],
    timeline: "October 2024 – June 2025",
    tools: "TypeScript · React · Tailwind CSS · Firebase (Realtime DB, Firestore, Storage, Authentication) · Monaco Editor · Bash · GitHub Workflows · Vercel",
    links: [
      { label: "Visit Website →", url: "https://co-c0de.vercel.app/" },
      { label: "View Source →", url: "https://github.com/Koiiichi/CoCode" }
    ]
  },
  mlox: {
    overview: "MLOX is a custom interpreted programming language built in C, extending the Lox language from Crafting Interpreters with modern runtime features. Designed as both a learning project and a language playground, MLOX introduces ternary operators, object-oriented primitives, native string methods, mathematical operations, and file I/O.",
    architecture: [
      "Core Interpreter: Written in C with a focus on performance and clarity",
      "Parsing: Recursive descent parser extended to handle ternary operators and new language constructs",
      "Bytecode VM: Stack-based virtual machine handling execution with dispatch loops and dynamic memory management",
      "Object-Oriented Primitives: Extended value system to support class-like structures, methods, and property access",
      "Native Methods: Implemented standard library features for string manipulation, file I/O, and math operations",
      "Documentation: Doxygen-style wiki generated directly from annotated C source"
    ],
    timeline: "June 2025 – August 2025",
    tools: "C · Make · Doxygen · Vim · GCC/Clang",
    links: [
      { label: "View Source →", url: "https://github.com/Koiiichi/mlox" },
      { label: "Documentation →", url: "https://github.com/Koiiichi/mlox" }
    ]
  },
  harmonics: {
    overview: "Project Harmonics is a data sonification tool that transforms particle physics datasets into sound, creating auditory representations of scientific phenomena. Originally developed in 2023 as a scientific outreach initiative, it maps collision data to musical parameters such as pitch, velocity, and timing using MIDI-based outputs.",
    architecture: [
      "Data Processing: Python + Pandas to clean and structure physics datasets",
      "Mapping Engine: Converts attributes (particle type, momentum, angle) into musical values (pitch, velocity, timing)",
      "MIDI Generation: Outputs portable MIDI files for use in DAWs (Digital Audio Workstations)",
      "Pipeline: sonify_dataset.py transforms raw CSV physics data into playable .mid files"
    ],
    timeline: "March 2023 – Present (Ongoing Expansion)",
    tools: "Python · Pandas · MIDI Libraries · Digital Audio Workstation (DAW)",
    links: [
      { label: "View Source →", url: "https://github.com/Koiiichi/project-harmonics/tree/main" },
      { label: "Listen Demo →", url: "https://projectharmonics.wixsite.com/about/method" }
    ]
  },
  chabacrunch: {
    overview: "ChabaCrunch is a data science project built during the TouchBistro x UW Hackathon (Feb 2025) that analyzed over 8 million restaurant transactions across Canada and the U.S. The system unified messy bill- and venue-level datasets into an analysis-ready pipeline, enabling insights into tipping culture across cities, venue concepts, and order types.",
    architecture: [
      "Data Integration: Merged bills.csv and venues.csv on venue_xref_id to build a unified dataset",
      "Data Cleaning: Tagged transactions as refunds vs. sales, removed invalid rows, applied concept-based outlier capping",
      "Feature Engineering: Derived tip percentage per transaction, aggregated venue-level features",
      "Modeling: Used tuned Random Forest to impute missing venue concepts (22% missing) with ~85% accuracy",
      "Exploratory Data Analysis: Visualized average tip percentages and amounts by city"
    ],
    timeline: "February 2025",
    tools: "Python · Pandas · scikit-learn · NumPy · Matplotlib · Seaborn · Google Colab",
    links: [
      { label: "Devpost →", url: "https://devpost.com/software/chabacrunch" },
      { label: "View Source →", url: "https://github.com/Koiiichi/ChabaCrunch-CXC2025" }
    ]
  }
};

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.slug}
                className="group relative overflow-hidden rounded-[1.5rem] border border-subtle bg-surface/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all hover:shadow-[0_16px_40px_rgb(0,0,0,0.16)] cursor-pointer"
                whileHover={{ y: -4 }}
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
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-muted px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="rounded-full bg-surface-muted px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                        +{project.tags.length - 3}
                      </span>
                    )}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-surface border border-subtle rounded-[2rem] p-8 shadow-[0_32px_64px_rgb(0,0,0,0.2)]"
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
                const details = projectDetails[selectedProject];
                if (!project || !details) return null;

                return (
                  <div className="space-y-8">
                    <header className="space-y-4">
                      <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
                      <p className="text-lg text-muted max-w-3xl">{details.overview}</p>
                    </header>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Architecture</h3>
                        <ul className="space-y-2">
                          {details.architecture.map((item, index) => (
                            <li key={index} className="text-muted">• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-3">Timeline</h3>
                          <p className="text-muted">{details.timeline}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-3">Tools</h3>
                          <p className="text-muted">{details.tools}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">Links</h3>
                        <div className="flex flex-wrap gap-3">
                          {details.links.map((link, index) => (
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