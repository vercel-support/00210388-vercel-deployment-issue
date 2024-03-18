import * as esbuild from 'esbuild';

const aliasModule = (moduleFrom: string, moduleTo: string): esbuild.Plugin => ({
  name: 'alias-module',
  setup(build) {
    build.onResolve({ filter: new RegExp(`^${moduleFrom}$`) }, async (args) => {
      const resolved = await build.resolve(moduleTo, {
        importer: args.importer,
        kind: 'import-statement',
        resolveDir: args.resolveDir,
      });

      if (resolved.errors.length > 0) {
        return { errors: resolved.errors };
      }

      return { path: resolved.path, namespace: 'alias-module', external: true };
    });
  },
});

//////////////////////////////////////
// NODE //////////////////////////////
//////////////////////////////////////

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/node/index.mjs',
  format: 'cjs',
  target: 'node16',
  packages: 'external',
  plugins: [
    aliasModule('lodash-es', 'lodash'),
    aliasModule('p-queue', 'p-queue-6'),
    aliasModule('emittery', 'emittery-0-13'),
    aliasModule('p-retry', 'p-retry-4'),
  ],
});

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/node/index.cjs',
  format: 'cjs',
  target: 'node16',
  packages: 'external',
  plugins: [
    aliasModule('lodash-es', 'lodash'),
    aliasModule('p-queue', 'p-queue-6'),
    aliasModule('emittery', 'emittery-0-13'),
    aliasModule('p-retry', 'p-retry-4'),
  ],
});

//////////////////////////////////////
// WEB ///////////////////////////////
//////////////////////////////////////

const node_only = [
  'fs',
  'path',
  'os',
  'child_process',
  'stream',
  'http',
  'querystring',
  'crypto',
  'url',
  'https',
  'events',
  'assert',
];

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/web/bundle.mjs',
    bundle: true,
    platform: 'browser',
    format: 'esm',
    target: ['esnext'],
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window',
    },
    external: node_only,
  })
  .catch(() => process.exit(1));

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/web/bundle.cjs',
    bundle: true,
    platform: 'browser',
    target: ['esnext'],
    format: 'cjs',
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window',
    },
    external: node_only,
  })
  .catch(() => process.exit(1));
