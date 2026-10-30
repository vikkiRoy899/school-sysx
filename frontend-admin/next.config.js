const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emits a self-contained server bundle for the Docker image.
  output: 'standalone',
  // In an npm-workspaces monorepo the trace root must be the repo root,
  // otherwise standalone output misses hoisted dependencies.
  outputFileTracingRoot: path.join(__dirname, '..'),
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
