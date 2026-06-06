export type ProjectMedia =
  | { type: 'image'; src: string; alt?: string }
  | { type: 'video'; src: string; poster?: string; alt?: string };

export type ProjectLinks = {
  [key: string]: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  links: ProjectLinks;
  media: ProjectMedia;
  metrics?: string[];
  role?: string;
  timeframe?: string;
  /** Optional brand-mark SVG (monochrome, recolored to currentColor). */
  icon?: string | null;
};

export type BuildingItem = {
  name: string;
  status: 'Active' | 'Paused' | 'Exploring';
  started: string;
  progress: number;
  collaborators?: boolean;
  description?: string;
};
