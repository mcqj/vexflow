// @author Ron B. Yeh

// node ./tools/fix-esm-imports.mjs ./build/esm/
// See the `build:esm` command in tools/build.mjs.

// Used by tools/build.mjs to add .js extensions to imports and exports under the `vexflow/build/esm/` directory.
// ES module import statements do not work without the .js extension.

// This script recursively walks `build/esm/` and fixes imports & exports in every JS file.
// It adds a .js extension to every import / export of a file, fixing files in place. For example:
// import { Fraction } from './fraction'; => import { Fraction } from './fraction.js';
// export * from './barnote';             => export * from './barnote.js';

// The ESM files are produced by the tsc compiler, which does NOT add .js extensions to imports / exports.
// When importing the default files via a web page or node, you get errors like:
//   vexflow.js:1 GET https://..... net::ERR_ABORTED 404 (Not Found)
//   Error [ERR_MODULE_NOT_FOUND]: Cannot find module...
// The fix is to add the .js file extensions, so that the browser and node can resolve the imports properly.
// The TypeScript team has said they do not plan to add this feature.
// See: https://github.com/microsoft/TypeScript/issues/16577#issuecomment-754941937

// Limitations:
// - Assume import(...) function uses only string literals.

import * as fs from 'fs';
import * as path from 'path';

const startingDirectory = process.argv[2] ?? __dirname;

function* walk(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walk(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}

// Read and write files in place.
function fixImportsAndExports(filePath) {
  const contents = fs.readFileSync(filePath, 'utf8');

  // Line by line regex replace!
  const lines = contents.split('\n');
  const newLines = lines.map((line) => {
    const match = line.match(/(['"])(\.[^'"]*)\1;?\s*$/);
    const specifier = match?.[2];
    if (!specifier) {
      return line;
    }
    const quote = match[1];
    const fixedSpecifier = specifier
      .replace(/\.$/, './index')
      .replace(/\/$/, '/index');
    if (line.startsWith('import ')) {
      if (fixedSpecifier.endsWith('.js')) {
        return line;
      }
      return line.replace(`${quote}${specifier}${quote}`, `${quote}${fixedSpecifier}.js${quote}`);
    } else if (line.startsWith('export ') && line.includes(' from ')) {
      if (fixedSpecifier.endsWith('.js')) {
        return line;
      }
      return line.replace(`${quote}${specifier}${quote}`, `${quote}${fixedSpecifier}.js${quote}`);
    } else {
      return line;
    }
  });
  const newContents = newLines.join('\n');
  fs.writeFileSync(filePath, newContents);
}

for (const filePath of walk(startingDirectory)) {
  if (filePath.endsWith('.js')) {
    fixImportsAndExports(filePath);
  }
}
