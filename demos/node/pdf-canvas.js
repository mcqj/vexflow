// Summary:
//   Render a score into a canvas and convert it to a PDF. Saved in `output/score.pdf`.
// Run:
//   node pdf-canvas.js
// Status:

const VexFlow = require('vexflow');

const fs = require('fs');
const { JSDOM } = require('jsdom');
const { GlobalFonts } = require('@napi-rs/canvas');
const { jsPDF } = require('jspdf');

// Make sure the output folder exists.
if (!fs.existsSync('./output/')) {
  fs.mkdirSync('./output/');
}

// JSDOM uses @napi-rs/canvas internally. https://www.npmjs.com/package/@napi-rs/canvas
// @napi-rs/canvas can load custom fonts with GlobalFonts.registerFromPath(...).
// It doesn't seem to support WOFF2. Regular OTF works fine.
const fontsDir = '../../node_modules/@vexflow-fonts/';
GlobalFonts.registerFromPath(fontsDir + 'bravura/bravura.otf', 'Bravura');
GlobalFonts.registerFromPath(fontsDir + 'academico/academico.otf', 'Academico');
GlobalFonts.registerFromPath(fontsDir + 'petaluma/petaluma.otf', 'Petaluma');
GlobalFonts.registerFromPath(fontsDir + 'petalumascript/petalumascript.otf', 'Petaluma Script');

const outputFile = 'output/score-canvas.pdf';

const { Stave, StaveNote, Formatter, Renderer } = VexFlow;

VexFlow.setFonts('Bravura');
// VexFlow.setFonts('Petaluma');

console.log('VexFlow Build: ' + VexFlow.BUILD.ID);

const dom = new JSDOM(
  `<!DOCTYPE html><html><head><style></style></head><body><canvas id="container"></canvas><body></html>`
);

global.window = dom.window;
global.document = dom.window.document;

const canvas = document.getElementById('container');
console.log(canvas.width, canvas.height);
const renderer = new Renderer(canvas, Renderer.Backends.CANVAS);
console.log(canvas.width, canvas.height);

// Configure the rendering context.
renderer.resize(200, 200);
const context = renderer.getContext();

const stave = new Stave(10, 0, 190);

// Add a clef and time signature.
stave.addClef('treble').addTimeSignature('4/4');

// Connect it to the rendering context and draw!
stave.setContext(context).drawWithStyle();

const notes = [
  new StaveNote({ keys: ['c/4'], duration: 'q' }),
  new StaveNote({ keys: ['d/4'], duration: 'q' }),
  new StaveNote({ keys: ['b/4'], duration: 'qr' }),
  new StaveNote({ keys: ['c/4', 'e/4', 'g/4'], duration: 'q' }),
];

// Helper function to justify and draw a 4/4 voice.
Formatter.FormatAndDraw(context, stave, notes);

const doc = new jsPDF();
doc.addImage(canvas.toDataURL(), undefined, 50, 100, 80, 80, undefined, 'NONE', 10 /* degrees */);
doc.save(outputFile);
console.log('Saved a PDF:', outputFile);
