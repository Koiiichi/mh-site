import type { MetadataRoute } from 'next';
import projectsData from '@/data/projects.json';
import { Project } from '@/lib/types';

const projects = projectsData as unknown as Project[];

function resolveBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.GITHUB_ACTIONS === 'true') {
    const repo = process.env.NEXT_PUBLIC_GH_REPO ?? '';
    const owner = process.env.GITHUB_REPOSITORY?.split('/')[0];
    if (owner && repo) {
      return `https://${owner}.github.io/${repo}`;
    }
  }
  return 'https://muneeb.design';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = resolveBaseUrl().replace(/\/$/, '');
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1
    },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const
    }))
  ];

  return entries;
}
