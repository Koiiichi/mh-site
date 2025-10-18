/** @type {import('next').NextConfig} */
const config = {
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  }
};

export default config;
