import { expect, test } from "@playwright/test";

import { loadSourceTestModule, renderCaseIds } from "./visual_helpers";

test("runs source-backed annotation tests in Chromium", async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));

  await loadSourceTestModule(page, "Annotation");
  expect(pageErrors).toEqual([]);
});

test("matches a source-rendered annotation canvas", async ({ page }) => {
  await loadSourceTestModule(page, "Annotation");

  await expect(
    page.locator('[id="canvas_Annotation.Bounding_Box.Bravura"] + .vex-tabdiv'),
  ).toHaveScreenshot("annotation-bounding-box-bravura.png");
});

test("matches a source-rendered annotation SVG", async ({ page }) => {
  await loadSourceTestModule(page, "Annotation");

  await expect(
    page.locator('[id="svg_Annotation.Bounding_Box.Gonville"] + .vex-tabdiv'),
  ).toHaveScreenshot("annotation-bounding-box-gonville.png");
});

test("matches the remaining source-rendered annotation cases", async ({
  page,
}) => {
  await loadSourceTestModule(page, "Annotation");

  const representativeCases = new Set([
    "canvas_Annotation.Bounding_Box.Bravura",
    "svg_Annotation.Bounding_Box.Gonville",
  ]);
  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    if (representativeCases.has(caseId)) continue;
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${caseId}.png`,
    );
  }
});

test("matches source-rendered accidental cases", async ({ page }) => {
  await loadSourceTestModule(page, "Accidental");

  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${index}-${caseId}.png`,
    );
  }
});

test("matches source-rendered articulation cases", async ({ page }) => {
  await loadSourceTestModule(page, "Articulation");

  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${index}-${caseId}.png`,
    );
  }
});

test("matches source-rendered barline cases", async ({ page }) => {
  await loadSourceTestModule(page, "Barline");

  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${index}-${caseId}.png`,
    );
  }
});

test("matches source-rendered clef cases", async ({ page }) => {
  await loadSourceTestModule(page, "Clef");

  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${index}-${caseId}.png`,
    );
  }
});

test("matches source-rendered beam cases", async ({ page }) => {
  await loadSourceTestModule(page, "Beam");

  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${index}-${caseId}.png`,
    );
  }
});

test("matches source-rendered bend cases", async ({ page }) => {
  await loadSourceTestModule(page, "Bend");

  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${index}-${caseId}.png`,
    );
  }
});

test("matches source-rendered chord symbol cases", async ({ page }) => {
  await loadSourceTestModule(page, "ChordSymbol");

  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${index}-${caseId}.png`,
    );
  }
});

test("matches source-rendered curve cases", async ({ page }) => {
  await loadSourceTestModule(page, "Curve");

  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${index}-${caseId}.png`,
    );
  }
});

test("matches source-rendered dot cases", async ({ page }) => {
  await loadSourceTestModule(page, "Dot");

  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${index}-${caseId}.png`,
    );
  }
});

test("matches source-rendered stave connector cases", async ({ page }) => {
  await loadSourceTestModule(page, "StaveConnector");

  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${index}-${caseId}.png`,
    );
  }
});

test("matches source-rendered stave hairpin cases", async ({ page }) => {
  await loadSourceTestModule(page, "StaveHairpin");

  const cases = page.locator("#qunit-tests .testcanvas");
  const caseIds = await renderCaseIds(page);

  for (const [index, caseId] of caseIds.entries()) {
    await expect(cases.nth(index).locator(".vex-tabdiv")).toHaveScreenshot(
      `${index}-${caseId}.png`,
    );
  }
});
