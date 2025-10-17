/** @type {import('next').NextConfig} */
const repo = (process.env.NEXT_PUBLIC_GH_REPO ?? '').trim();
const isGithub = process.env.GITHUB_ACTIONS === 'true' && repo.length > 0;
const basePath = isGithub ? `/${repo}` : '';

const config = {
  output: 'export',
  images: { unoptimized: true },
  basePath: basePath,
  assetPrefix: isGithub ? `/${repo}/` : '',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_BASE_PATH: basePath,
  }
};

export default config;
