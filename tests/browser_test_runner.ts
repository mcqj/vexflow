import { TestAssert, TestCallback, TestMetadata, TestRunner, TestRunnerBackend } from "./test_runner";

export interface BrowserTestRunnerOptions {
  filter?: string;
  moduleName?: string;
}

interface BrowserTestResults {
  assertions: number;
  failures: string[];
  startTime: number;
  tests: number;
}

let currentModule = "";
let scheduledTests: Array<() => Promise<void>> = [];
let results: BrowserTestResults;
let options: BrowserTestRunnerOptions = {};

function valuesAreEqual(actual: unknown, expected: unknown): boolean {
  if (Object.is(actual, expected)) return true;
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function recordAssertion(result: boolean, message: string): void {
  results.assertions += 1;
  if (!result) results.failures.push(message);
}

interface BrowserAssert {
  assert: TestAssert;
  validateExpectedAssertions(): void;
}

function createAssert(metadata: TestMetadata): BrowserAssert {
  let expectedAssertions: number | undefined;
  let assertionCount = 0;
  const record = (result: boolean, message: string): void => {
    assertionCount += 1;
    recordAssertion(result, message);
  };
  const compare = (actual: unknown, expected: unknown, message: string | undefined, strict: boolean): void => {
    const matches = strict ? Object.is(actual, expected) : actual == expected;
    record(matches, message ?? `${metadata.moduleName} > ${metadata.testName}: expected values to match.`);
  };
  return {
    assert: {
    test: { module: { name: metadata.moduleName } },
    deepEqual: (actual, expected, message) =>
      record(valuesAreEqual(actual, expected), message ?? `${metadata.moduleName} > ${metadata.testName}: expected values to be deeply equal.`),
    equal: (actual, expected, message) => compare(actual, expected, message, false),
    expect: (count) => {
      expectedAssertions = count;
    },
    notDeepEqual: (actual, expected, message) =>
      record(!valuesAreEqual(actual, expected), message ?? `${metadata.moduleName} > ${metadata.testName}: expected values to differ.`),
    notEqual: (actual, expected, message) => record(actual != expected, message ?? `${metadata.moduleName} > ${metadata.testName}: expected values to differ.`),
    notOk: (value, message) => record(!value, message ?? `${metadata.moduleName} > ${metadata.testName}: expected a falsy value.`),
    notStrictEqual: (actual, expected, message) =>
      record(!Object.is(actual, expected), message ?? `${metadata.moduleName} > ${metadata.testName}: expected values to differ.`),
    ok: (value, message) => record(!!value, message ?? `${metadata.moduleName} > ${metadata.testName}: expected a truthy value.`),
    propEqual: (actual, expected, message) =>
      record(valuesAreEqual(actual, expected), message ?? `${metadata.moduleName} > ${metadata.testName}: expected properties to match.`),
    strictEqual: (actual, expected, message) => compare(actual, expected, message, true),
    throws: (callback, expected, message) => {
      let thrown: unknown;
      try {
        callback();
      } catch (error) {
        thrown = error;
      }
      const matches =
        thrown !== undefined &&
        (expected === undefined ||
          typeof expected === "string" ||
          (expected instanceof RegExp && expected.test(String(thrown))) ||
          (typeof expected === "function" && thrown instanceof expected));
      record(matches, message ?? `${metadata.moduleName} > ${metadata.testName}: expected callback to throw.`);
    },
    },
    validateExpectedAssertions: () => {
      if (expectedAssertions !== undefined) {
        record(
          assertionCount === expectedAssertions,
          `${metadata.moduleName} > ${metadata.testName}: expected ${expectedAssertions} assertions, but received ${assertionCount}.`,
        );
      }
    },
  };
}

function matchesFilter(metadata: TestMetadata): boolean {
  if (options.moduleName && metadata.moduleName !== options.moduleName) return false;
  if (options.filter && !`${metadata.moduleName} ${metadata.testName}`.includes(options.filter)) return false;
  return true;
}

const browserBackend: TestRunnerBackend = {
  module(name) {
    currentModule = name;
  },
  test(name, callback) {
    const metadata = { moduleName: currentModule, testName: name };
    if (!matchesFilter(metadata)) return;

    results.tests += 1;
    const browserAssert = createAssert(metadata);
    const runTest = async (): Promise<void> => {
      try {
        await callback(browserAssert.assert, metadata);
        browserAssert.validateExpectedAssertions();
      } catch (error) {
        results.failures.push(`${metadata.moduleName} > ${metadata.testName}: ${String(error)}`);
      }
    };
    scheduledTests.push(runTest);
  },
};

function updateResultElement(): void {
  const element = document.querySelector("#qunit-testresult");
  if (!element) return;
  const duration = Date.now() - results.startTime;
  element.textContent = `${results.tests} tests completed in ${duration} ms. ${results.failures.length} failed.`;
}

export function installBrowserTestRunner(nextOptions: BrowserTestRunnerOptions = {}): void {
  currentModule = "";
  options = nextOptions;
  scheduledTests = [];
  results = { assertions: 0, failures: [], startTime: Date.now(), tests: 0 };
  TestRunner.install(browserBackend);
}

export async function completeBrowserTests(): Promise<BrowserTestResults> {
  for (const runTest of scheduledTests) {
    await runTest();
  }
  updateResultElement();
  if (results.failures.length) {
    console.error(results.failures.join("\n"));
  }
  return results;
}