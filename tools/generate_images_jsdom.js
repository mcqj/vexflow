// Run the full VexFlow test suite, grab the generated images, and
// dump them into a local directory as PNG files.
//
// This meant to be used with the visual regression test system in
// `tools/visual_regression.sh`.

const fs = require('fs');
const path = require('path');

const { JSDOM } = require('jsdom');

const { GlobalFonts } = require('@napi-rs/canvas');

// JSDOM uses @napi-rs/canvas internally. https://www.npmjs.com/package/@napi-rs/canvas
// @napi-rs/canvas can load custom fonts with GlobalFonts.registerFromPath(...).
// It doesn't seem to support WOFF2. Regular OTF works fine.
const fontsDir = path.resolve(__dirname, '../node_modules/@vexflow-fonts/');
GlobalFonts.registerFromPath(path.join(fontsDir, 'bravura/bravura.otf'), 'Bravura');
GlobalFonts.registerFromPath(path.join(fontsDir, 'academico/academico.otf'), 'Academico');
GlobalFonts.registerFromPath(path.join(fontsDir, 'petaluma/petaluma.otf'), 'Petaluma');
GlobalFonts.registerFromPath(path.join(fontsDir, 'petalumascript/petalumascript.otf'), 'Petaluma Script');
GlobalFonts.registerFromPath(path.join(fontsDir, 'leland/leland.otf'), 'Leland');
GlobalFonts.registerFromPath(path.join(fontsDir, 'edwin/edwin-roman.otf'), 'Edwin');
GlobalFonts.registerFromPath(path.join(fontsDir, 'gonville/gonville.otf'), 'Gonville');
GlobalFonts.registerFromPath(path.join(fontsDir, 'sebastian/sebastian.otf'), 'Sebastian');
GlobalFonts.registerFromPath(path.join(fontsDir, 'finaleash/finaleash.otf'), 'Finale Ash');

const dom = new JSDOM(`<!DOCTYPE html><body><div id="qunit-tests"></div></body>`);
global.window = dom.window;
global.document = dom.window.document;

const [scriptDir, imageDir] = process.argv.slice(2, 4);

const runOptions = {
  jobs: 1,
  job: 0,
};

// Optional:
//  --fonts argument specifies which font stacks to test. Defaults to all.
//  --jobs, --job: see tests/vexflow_test_helpers.ts: VexFlowTests.run()
// For example:
//   node generate_images_jsdom.js SCRIPT_DIR IMAGE_OUTPUT_DIR --fonts=petaluma
//   node generate_images_jsdom.js SCRIPT_DIR IMAGE_OUTPUT_DIR --fonts=bravura,gonville
const ALL_FONTS = ['Bravura', 'Petaluma', 'Finale Ash', 'Sebastian', 'Gonville'];
let fontStacksToTest = ALL_FONTS;
const { argv } = process;

if (argv.length >= 5) {
  for (let i = 4; i < argv.length; i++) {
    const arg = argv[i];
    const value = arg.split('=')[1];
    const intValue = parseInt(value);
    if (arg.startsWith('--fonts=')) {
      const fontsList = value.split(',');
      // Create an array of font names with the first letter in upper case.
      fontStacksToTest = fontsList.map((fontName) => fontName.charAt(0).toUpperCase() + fontName.slice(1));
    } else if (arg.startsWith('--jobs=')) {
      runOptions.jobs = intValue;
    } else if (arg.startsWith('--job=')) {
      runOptions.job = intValue;
    } else {
      // console.log('???', arg);
    }
  }
}

// vexflow-debug-with-tests.js includes both the VexFlow library and the test code.
const vexflowDebugWithTestsJS = path.resolve(__dirname, path.join(scriptDir, 'cjs', 'vexflow-debug-with-tests.js'));
if (!fs.existsSync(vexflowDebugWithTestsJS)) {
  console.log('Cannot find', vexflowDebugWithTestsJS);
  console.log('Aborting');
  process.exit(1);
}
global.VexFlow = require(vexflowDebugWithTestsJS);

// vexflow_test_helpers uses this to write out image files.
global.VexFlow.Test.shims = { fs };

// Tell VexFlow that we're outside the browser. Just run the Node tests.
const VFT = VexFlow.Test;
VFT.installNodeTestRunner();
VFT.RUN_CANVAS_TESTS = false;
VFT.RUN_SVG_TESTS = false;
VFT.RUN_NODE_TESTS = true;
VFT.NODE_IMAGEDIR = imageDir;
VFT.NODE_FONT_STACKS = fontStacksToTest;

// Create the image directory if it doesn't exist.
fs.mkdirSync(VFT.NODE_IMAGEDIR, { recursive: true });

// Run all tests.
VFT.run(runOptions);
