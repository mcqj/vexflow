import { expect, type Page } from "@playwright/test";

export async function loadSourceTestModule(
  page: Page,
  moduleName: string,
): Promise<void> {
  await page.goto(`/tests/flow.html?source=true&module=${moduleName}`);
  await expect(page.locator("#qunit-testresult")).toContainText(
    "completed in",
    { timeout: 60_000 },
  );
  await expect(page.locator("#qunit-testresult")).toContainText("0 failed");
}

export async function renderCaseIds(page: Page): Promise<string[]> {
  return page
    .locator("#qunit-tests .testcanvas .name")
    .evaluateAll((elements) =>
      elements.map((element) => {
        if (!element.id) {
          throw new Error("Render case is missing a stable title ID.");
        }
        return element.id;
      }),
    );
}
