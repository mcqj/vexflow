import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'vite';

import { createViteConfig } from '../vite.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(root, 'build');
const cjsDir = path.join(buildDir, 'cjs');
const esmDir = path.join(buildDir, 'esm');
const referenceDir = path.join(root, 'reference');
const referenceImageCache = path.join(referenceDir, 'images');
const generatedReferenceImages = path.join(buildDir, 'images', 'reference');
const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));

function gitCommitID() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'unknown';
  }
}

const versionInfo = {
  version: packageJson.version,
  id: gitCommitID(),
  date: new Date().toISOString(),
};

const productionEntries = ['vexflow', 'vexflow-core', 'vexflow-bravura'];
const debugEntries = ['vexflow-debug', 'vexflow-debug-with-tests'];

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: 'inherit' });
}

async function buildCJS(watch = false) {
  mkdirSync(cjsDir, { recursive: true });
  for (const entry of [...productionEntries, ...debugEntries]) {
    const minify = productionEntries.includes(entry);
    await build(createViteConfig({ entry, minify, versionInfo, watch }));
  }
}

function buildESM() {
  mkdirSync(esmDir, { recursive: true });
  writeFileSync(path.join(esmDir, 'package.json'), '{\n  "type": "module"\n}\n');
  run('npx', ['tsc', '-p', 'tsconfig.esm.json']);
  run('node', ['./tools/fix-esm-imports.mjs', './build/esm/']);
  const versionFile = [
    `export const VERSION = '${versionInfo.version}';`,
    `export const ID = '${versionInfo.id}';`,
    `export const DATE = '${versionInfo.date}';`,
  ];
  writeFileSync(path.join(esmDir, 'src/version.js'), `${versionFile.join('\n')}\n`);
}

function buildTypes() {
  run('npx', ['tsc', '-p', 'tsconfig.types.json']);
}

const command = process.argv[2] ?? 'build';

switch (command) {
  case 'build':
    rmSync(buildDir, { recursive: true, force: true });
    await buildCJS();
    buildESM();
    buildTypes();
    break;
  case 'cjs':
    await buildCJS();
    break;
  case 'esm':
    buildESM();
    break;
  case 'types':
    buildTypes();
    break;
  case 'watch':
    rmSync(buildDir, { recursive: true, force: true });
    await buildCJS(true);
    break;
  case 'clean':
    rmSync(buildDir, { recursive: true, force: true });
    break;
  case 'reference':
    rmSync(buildDir, { recursive: true, force: true });
    await buildCJS();
    buildESM();
    rmSync(referenceDir, { recursive: true, force: true });
    cpSync(buildDir, referenceDir, { recursive: true });
    break;
  case 'save-reference-images':
    try {
      rmSync(referenceImageCache, { recursive: true, force: true });
      cpSync(generatedReferenceImages, referenceImageCache, { recursive: true });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    break;
  case 'restore-reference-images':
    try {
      mkdirSync(path.dirname(generatedReferenceImages), { recursive: true });
      cpSync(referenceImageCache, generatedReferenceImages, { recursive: true });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      run('npm', ['run', 'generate:reference']);
    }
    break;
  default:
    throw new Error(`Unknown build command: ${command}`);
}
