const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [''], // Add domains here
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `
    @import "src/styles/extendables/index.scss";
    @import "src/styles/variables/index.scss";`,
  },
  reactStrictMode: true,
}

module.exports = nextConfig;