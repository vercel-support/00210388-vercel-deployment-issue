// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  swcMinify: true,
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production",
  // },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    outputFileTracingExcludes: {
      '/*': ['**canvas**'],
    },
  },

  webpack: (config, { isServer, webpack }) => {
    config.externals = [...config.externals, 'canvas'];

    // Loaders
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
      {
        test: /\.lawme-workflow$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: /raw/,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },
        ],
      }
    );
    fileLoaderRule.exclude = /\.svg$/i;

    // NodeJS Polyfills
    config.target = 'node';
    if (!isServer) {
      // config.node = {
      //   dgram: 'empty',
      //   fs: 'empty',
      //   net: 'empty',
      //   tls: 'empty',
      //   child_process: 'empty',
      // };
      const fallback = config.resolve.fallback || {};
      Object.assign(fallback, {
        fs: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        child_process: false,
      });
      config.resolve.fallback = fallback;
      config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ]);
    }
    return config;
  },
};


export default config
