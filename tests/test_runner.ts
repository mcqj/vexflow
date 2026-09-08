export interface TestMetadata {
  moduleName: string;
  testName: string;
}

export interface TestAssert {
  test: { module: { name: string } };
  deepEqual(actual: unknown, expected: unknown, message?: string): void;
  equal(actual: unknown, expected: unknown, message?: string): void;
  expect(assertions: number): void;
  notDeepEqual(actual: unknown, expected: unknown, message?: string): void;
  notEqual(actual: unknown, expected: unknown, message?: string): void;
  notOk(value: unknown, message?: string): void;
  notStrictEqual(actual: unknown, expected: unknown, message?: string): void;
  ok(value: unknown, message?: string): void;
  propEqual(actual: unknown, expected: unknown, message?: string): void;
  strictEqual(actual: unknown, expected: unknown, message?: string): void;
  throws(callback: () => unknown, expected?: RegExp | (new (...args: never[]) => Error) | string, message?: string): void;
}

declare global {
  type Assert = TestAssert;
}

export type TestCallback = (assert: TestAssert, metadata: TestMetadata) => void | Promise<void>;

export interface TestRunnerBackend {
  module(name: string): void;
  test(name: string, callback: TestCallback): void;
}

const missingBackend: TestRunnerBackend = {
  module: () => {
    throw new Error('No test runner has been installed.');
  },
  test: () => {
    throw new Error('No test runner has been installed.');
  },
};

let backend: TestRunnerBackend = missingBackend;

export const TestRunner = {
  install(nextBackend: TestRunnerBackend): void {
    backend = nextBackend;
  },
  reset(): void {
    backend = missingBackend;
  },
  module(name: string): void {
    backend.module(name);
  },
  test(name: string, callback: TestCallback): void {
    backend.test(name, callback);
  },
};