/** @type {import('next').NextConfig} */
const repo = (process.env.NEXT_PUBLIC_GH_REPO ?? '').trim();
const isGithub = process.env.GITHUB_ACTIONS === 'true' && repo.length > 0;

const config = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isGithub ? `/${repo}` : '',
  assetPrefix: isGithub ? `/${repo}/` : '',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  }
};

export default config;
