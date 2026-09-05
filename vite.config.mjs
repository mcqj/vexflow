import path from "node:path";
import { fileURLToPath } from "node:url";

import MagicString from "magic-string";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export function createViteConfig({ entry, minify, versionInfo }) {
  const input = path.resolve(root, "entry", `${entry}.ts`);
  const banner =
    `VexFlow ${versionInfo.version}   ${versionInfo.date}   ${versionInfo.id}\n` +
    "Copyright (c) 2023-present VexFlow contributors (see https://github.com/vexflow/vexflow/blob/main/AUTHORS.md).";

  return defineConfig({
    configFile: false,
    plugins: [
      {
        name: "vexflow-build-metadata",
        transform(code, id) {
          if (!id.endsWith("/src/version.ts")) return;
          const transformed = new MagicString(code);
          const replacements = {
            __VF_VERSION__: versionInfo.version,
            __VF_GIT_COMMIT_ID__: versionInfo.id,
            __VF_BUILD_DATE__: versionInfo.date,
          };
          for (const [search, replacement] of Object.entries(replacements)) {
            const start = code.indexOf(search);
            transformed.overwrite(start, start + search.length, replacement);
          }
          return {
            code: transformed.toString(),
            map: transformed.generateMap({ hires: true }),
          };
        },
      },
      {
        name: "vexflow-default-export",
        resolveId(id) {
          return id === "virtual:vexflow-entry" ? `\0${id}` : undefined;
        },
        load(id) {
          return id === "\0virtual:vexflow-entry"
            ? `export { default } from ${JSON.stringify(input)};`
            : undefined;
        },
      },
    ],
    build: {
      emptyOutDir: false,
      minify,
      outDir: path.resolve(root, "build/cjs"),
      rollupOptions: {
        input: "virtual:vexflow-entry",
        preserveEntrySignatures: "strict",
        output: {
          banner: `/*! ${banner} */`,
          entryFileNames: `${entry}.js`,
          exports: "default",
          format: "umd",
          name: "VexFlow",
        },
      },
      sourcemap: process.env.VEX_DEVTOOL === "false" ? false : true,
    },
  });
}

export default defineConfig({
  optimizeDeps: {
    noDiscovery: true,
  },
  server: {
    host: "127.0.0.1",
  },
});
