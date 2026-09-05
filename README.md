# VexFlow

Version of Vexflow that inherits from the original by Mohit Muthanna Cheppudira.

VexFlow is an open-source library for rendering sheet music. It is written in TypeScript, and outputs scores to HTML Canvas and SVG. It works in browsers and in Node.js projects (e.g., a command line script to save a score as a PDF).

VexFlow targets modern browsers and Node.js 17 or newer, with native `structuredClone()` support.

## Quick Start

The simplest way to add VexFlow to a web page is via a `<script>` tag.

See this example: [https://jsfiddle.net/ck6erLhm/](https://jsfiddle.net/ck6erLhm/)

```html
<div id="output"></div>
<script src="vexflow.js"></script>
<script>
  // YOUR CODE GOES HERE
</script>
```

The URL above includes a version number <code>vexflow@x.y.z</code>. Specifying a version prevents a future update from breaking your deployment.

If your project uses a bundler, you can install VexFlow from npm:

```sh
npm install vexflow
```

[See tutorial](https://vexflow.github.io/vexflow-examples/tutorial).

## Development

Install the project dependencies with Node.js and npm:

```sh
npm install
```

### Run

Start the Vite development server:

```sh
npm start
```

Vite opens `http://127.0.0.1:5173/`, which redirects to the browser test page. The test page loads the TypeScript source directly and updates modules when source files change. This workflow does not write distributable files to `build/`. Run `npm run dev` to start the same server without opening a browser, then visit `http://127.0.0.1:5173/`.

Some examples in `demos/` intentionally exercise generated package artifacts. Run `npm run build` before opening those examples.

### Build

Create a clean production build:

```sh
npm run build
```

This runs linting and generates the CommonJS bundles, ES modules, and TypeScript declarations under `build/`. Individual build stages are also available:

```sh
npm run build:cjs
npm run build:esm
npm run build:types
```

### Test

Run the complete Vitest suite once:

```sh
npm test
```

Run Vitest in watch mode while developing:

```sh
npm run test:watch
```

Browser-based visual regression images are generated with Playwright. Install its Chromium browser once after installing dependencies:

```sh
npx playwright install chromium
```

Build VexFlow, then generate images with the Playwright backend:

```sh
npm run build:cjs
npm run generate:current -- --backends=playwright
```

Generated images are written to `build/images/current/`. Use `--backends=all` to run both the Playwright and jsdom image generators. The complete reference comparison workflow is available through `npm run test:reference`.

Run the linter separately with:

```sh
npm run lint
```

## Factory and EasyScore

Factory and EasyScore are VexFlow's high-level API for creating staves, voices, and notes. On a web page containing a `<div id="output"></div>`, the following code displays a score:

```javascript
const factory = new VexFlow.Factory({
  renderer: { elementId: "output", width: 500, height: 200 },
});

const score = factory.EasyScore();
const system = factory.System();

system
  .addStave({
    voices: [
      score.voice(score.notes("C#5/q, B4, A4, G#4", { stem: "up" })),
      score.voice(score.notes("C#4/h, C#4", { stem: "down" })),
    ],
  })
  .addClef("treble")
  .addTimeSignature("4/4");

factory.draw();
```

[See a version running here.](https://vexflow.github.io/vexflow-examples/getting-started)

[Learn more about EasyScore here.](https://github.com/0xfe/vexflow/wiki/Using-EasyScore)

## Native API

You can use the low-level VexFlow API if you need more control. Below, we render a stave using SVG. [See a running example of the low-level API here.](https://vexflow.github.io/vexflow-examples/getting-started)

```javascript
const { Renderer, Stave } = VexFlow;

// Create an SVG renderer and attach it to the DIV element with id="output".
const div = document.getElementById("output");
const renderer = new Renderer(div, Renderer.Backends.SVG);

// Configure the rendering context.
renderer.resize(500, 500);
const context = renderer.getContext();

// Create a stave of width 400 at position 10, 40.
const stave = new Stave(10, 40, 400);

// Add a clef and time signature.
stave.addClef("treble").addTimeSignature("4/4");

// Connect it to the rendering context and draw!
stave.setContext(context).draw();
```

## Examples

A good way to learn the API is to look at our examples & unit tests:

- [Examples](https://vexflow.github.io/vexflow-examples)

- [Unit Tests](https://github.com/vexflow/vexflow/tree/main/tests)

## More Resources

- If you need help, start a [GitHub discussion](https://github.com/vexflow/vexflow/discussions).

- Learn more on the [VexFlow wiki](https://github.com/vexflow/vexflow/wiki).

- Build VexFlow from scratch by following the [build instructions](https://github.com/vexflow/vexflow/wiki/Build).

- [VexFlow](https://vexflow.com) was created by [Mohit Muthanna Cheppudira](https://muthanna.com) in 2010. It is currently maintained by [Ron Yeh](https://github.com/ronyeh) and [Rodrigo Vilar](https://github.com/rvilarl). Many others have contributed with code, documentation, bug reports, and feature requests. See the [list of contributors](https://github.com/0xfe/vexflow/graphs/contributors).

- [Projects Using VexFlow](https://github.com/0xfe/vexflow/wiki/Project-Gallery)

# MIT License

Copyright (c) 2023-present VexFlow contributors (see AUTHORS.md).<br />
Copyright (c) 2010-2022 Mohit Muthanna Cheppudira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
