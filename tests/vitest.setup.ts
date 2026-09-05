import { expect, test } from 'vitest';

type TestCallback = (assert: Assert) => void | Promise<void>;

interface QUnitAdapter {
  moduleName: string;
  testName: string;
  module(name: string): void;
  test(name: string, callback: TestCallback): void;
}

declare global {
  interface Assert {
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

  const QUnit: QUnitAdapter;
}

function createAssert(moduleName: string): Assert {
  return {
    test: { module: { name: moduleName } },
    deepEqual: (actual, expected) => expect(actual).toEqual(expected),
    equal: (actual, expected) => expect(actual == expected).toBe(true),
    expect: (assertions) => expect.assertions(assertions),
    notDeepEqual: (actual, expected) => expect(actual).not.toEqual(expected),
    notEqual: (actual, expected) => expect(actual != expected).toBe(true),
    notOk: (value) => expect(value).toBeFalsy(),
    notStrictEqual: (actual, expected) => expect(actual).not.toBe(expected),
    ok: (value) => expect(value).toBeTruthy(),
    propEqual: (actual, expected) => expect(actual).toEqual(expected),
    strictEqual: (actual, expected) => expect(actual).toBe(expected),
    throws: (callback, expected) => {
      const assertion = expect(callback);
      typeof expected === 'string' || expected === undefined ? assertion.toThrow() : assertion.toThrow(expected);
    },
  };
}

let currentModule = '';

const qunit: QUnitAdapter = {
  moduleName: '',
  testName: '',
  module(name) {
    currentModule = name;
    this.moduleName = name;
  },
  test(name, callback) {
    const moduleName = currentModule;
    test(`${moduleName} > ${name}`, async () => {
      this.moduleName = moduleName;
      this.testName = name;
      await callback(createAssert(moduleName));
    });
  },
};

(globalThis as typeof globalThis & { QUnit: QUnitAdapter }).QUnit = qunit;

document.body.innerHTML = '<div id="qunit-tests"></div>';