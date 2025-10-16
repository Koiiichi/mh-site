import { Github, Globe, FileText, ExternalLink, Play, Award, type LucideIcon } from 'lucide-react';

type LinkIcon = LucideIcon | 'devpost';

const exactTechIcons: Record<string, string> = {
  'react': '/tech-icons/react.svg',
  'python': '/tech-icons/python.svg',
  'typescript': '/tech-icons/typescript.svg',
  'next.js': '/tech-icons/nextjs.svg',
  'nextjs': '/tech-icons/nextjs.svg',
  'tailwind css': '/tech-icons/tailwind.svg',
  'tailwind': '/tech-icons/tailwind.svg',
  'firebase': '/tech-icons/firebase.svg',
  'vercel': '/tech-icons/vercel.svg',
  'c': '/tech-icons/c.svg',
  'pandas': '/tech-icons/pandas.svg',
  'fastapi': '/tech-icons/fastapi.svg',
  'selenium': '/tech-icons/selenium.svg',
  'scikit-learn': '/tech-icons/scikit-learn.svg',
  'make': '/tech-icons/make.svg',
  'compilers': '/tech-icons/compiler.svg',
  'compiler': '/tech-icons/compiler.svg',
  'vm': '/tech-icons/vm.svg',
  'deepseek api': '/tech-icons/deepseek.svg',
  'deepseek': '/tech-icons/deepseek.svg',
  'openseadragon': '/tech-icons/openseadragon.svg',
  'typer': '/tech-icons/typer.svg',
  'openai api': '/tech-icons/openai.svg',
  'openai': '/tech-icons/openai.svg',
  'midi': '/tech-icons/midi.svg',
  'data visualization': '/tech-icons/data-viz.svg'
};

const partialTechIcons: Array<{ match: string; icon: string }> = [
  { match: 'react', icon: '/tech-icons/react.svg' },
  { match: 'python', icon: '/tech-icons/python.svg' },
  { match: 'typescript', icon: '/tech-icons/typescript.svg' },
  { match: 'next', icon: '/tech-icons/nextjs.svg' },
  { match: 'tailwind', icon: '/tech-icons/tailwind.svg' },
  { match: 'firebase', icon: '/tech-icons/firebase.svg' },
  { match: 'vercel', icon: '/tech-icons/vercel.svg' },
  { match: 'pandas', icon: '/tech-icons/pandas.svg' },
  { match: 'fastapi', icon: '/tech-icons/fastapi.svg' },
  { match: 'selenium', icon: '/tech-icons/selenium.svg' },
  { match: 'scikit', icon: '/tech-icons/scikit-learn.svg' },
  { match: 'compiler', icon: '/tech-icons/compiler.svg' },
  { match: 'deepseek', icon: '/tech-icons/deepseek.svg' },
  { match: 'openai', icon: '/tech-icons/openai.svg' },
  { match: 'data viz', icon: '/tech-icons/data-viz.svg' },
  { match: 'midi', icon: '/tech-icons/midi.svg' },
  { match: 'typer', icon: '/tech-icons/typer.svg' }
];

export function getTechIconPath(tech: string): string | null {
  const normalized = tech.trim().toLowerCase();

  if (normalized in exactTechIcons) {
    return exactTechIcons[normalized];
  }

  const partial = partialTechIcons.find((entry) => normalized.includes(entry.match));
  return partial ? partial.icon : null;
}

export function getLinkIcon(label: string): LinkIcon {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('devpost')) {
    return 'devpost';
  }
  if (lowerLabel.includes('source') || lowerLabel.includes('github') || lowerLabel.includes('repo')) {
    return Github;
  }
  if (lowerLabel.includes('website') || lowerLabel.includes('site') || lowerLabel.includes('demo')) {
    return Globe;
  }
  if (lowerLabel.includes('documentation') || lowerLabel.includes('docs')) {
    return FileText;
  }
  if (lowerLabel.includes('listen') || lowerLabel.includes('play')) {
    return Play;
  }
  if (lowerLabel.includes('nasa') || lowerLabel.includes('space apps')) {
    return Award;
  }
  return ExternalLink;
}

export type { LinkIcon };
