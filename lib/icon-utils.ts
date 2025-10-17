import { Github, Globe, FileText, ExternalLink, Play, Award, type LucideIcon } from 'lucide-react';

type LinkIcon = LucideIcon | 'devpost';

// Get the base path for assets (respects GitHub Pages deployment)
function getAssetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return basePath + path;
}

const exactTechIcons: Record<string, string> = {
  'react': getAssetPath('/tech-icons/react.svg'),
  'python': getAssetPath('/tech-icons/python.svg'),
  'typescript': getAssetPath('/tech-icons/typescript.svg'),
  'next.js': getAssetPath('/tech-icons/nextjs.svg'),
  'nextjs': getAssetPath('/tech-icons/nextjs.svg'),
  'tailwind css': getAssetPath('/tech-icons/tailwind.svg'),
  'tailwind': getAssetPath('/tech-icons/tailwind.svg'),
  'firebase': getAssetPath('/tech-icons/firebase.svg'),
  'vercel': getAssetPath('/tech-icons/vercel.svg'),
  'c': getAssetPath('/tech-icons/c.svg'),
  'pandas': getAssetPath('/tech-icons/pandas.svg'),
  'fastapi': getAssetPath('/tech-icons/fastapi.svg'),
  'selenium': getAssetPath('/tech-icons/selenium.svg'),
  'scikit-learn': getAssetPath('/tech-icons/scikit-learn.svg'),
  'make': getAssetPath('/tech-icons/make.svg'),
  'compilers': getAssetPath('/tech-icons/vm.svg'), // using vm.svg as fallback
  'compiler': getAssetPath('/tech-icons/vm.svg'), // using vm.svg as fallback
  'vm': getAssetPath('/tech-icons/vm.svg'),
  'deepseek api': getAssetPath('/tech-icons/deepseek.svg'),
  'deepseek': getAssetPath('/tech-icons/deepseek.svg'),
  'openseadragon': getAssetPath('/tech-icons/openseadragon.svg'),
  'typer': getAssetPath('/tech-icons/typer.svg'),
  'openai api': getAssetPath('/tech-icons/openai.svg'),
  'openai': getAssetPath('/tech-icons/openai.svg'),
  'midi': getAssetPath('/tech-icons/midi.svg'),
  'data visualization': getAssetPath('/tech-icons/default.svg') // using default.svg as fallback
};

const partialTechIcons: Array<{ match: string; icon: string }> = [
  { match: 'react', icon: getAssetPath('/tech-icons/react.svg') },
  { match: 'python', icon: getAssetPath('/tech-icons/python.svg') },
  { match: 'typescript', icon: getAssetPath('/tech-icons/typescript.svg') },
  { match: 'next', icon: getAssetPath('/tech-icons/nextjs.svg') },
  { match: 'tailwind', icon: getAssetPath('/tech-icons/tailwind.svg') },
  { match: 'firebase', icon: getAssetPath('/tech-icons/firebase.svg') },
  { match: 'vercel', icon: getAssetPath('/tech-icons/vercel.svg') },
  { match: 'pandas', icon: getAssetPath('/tech-icons/pandas.svg') },
  { match: 'fastapi', icon: getAssetPath('/tech-icons/fastapi.svg') },
  { match: 'selenium', icon: getAssetPath('/tech-icons/selenium.svg') },
  { match: 'scikit', icon: getAssetPath('/tech-icons/scikit-learn.svg') },
  { match: 'compiler', icon: getAssetPath('/tech-icons/vm.svg') },
  { match: 'deepseek', icon: getAssetPath('/tech-icons/deepseek.svg') },
  { match: 'openai', icon: getAssetPath('/tech-icons/openai.svg') },
  { match: 'data viz', icon: getAssetPath('/tech-icons/default.svg') },
  { match: 'midi', icon: getAssetPath('/tech-icons/midi.svg') },
  { match: 'typer', icon: getAssetPath('/tech-icons/typer.svg') }
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
