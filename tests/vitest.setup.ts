import { expect, test } from 'vitest';

import { TestAssert, TestCallback, TestRunner, TestRunnerBackend } from './test_runner';

function createAssert(moduleName: string): TestAssert {
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

const vitestBackend: TestRunnerBackend = {
  module(name) {
    currentModule = name;
  },
  test(name, callback) {
    const moduleName = currentModule;
    test(`${moduleName} > ${name}`, async () => {
      await callback(createAssert(moduleName), { moduleName, testName: name });
    });
  },
};

TestRunner.install(vitestBackend);

document.body.innerHTML = '<div id="qunit-tests"></div>';