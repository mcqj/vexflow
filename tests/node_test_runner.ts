import { TestAssert, TestRunner, TestRunnerBackend } from './test_runner';

const noOp = (): void => undefined;

function createAssert(moduleName: string): TestAssert {
  return {
    test: { module: { name: moduleName } },
    deepEqual: noOp,
    equal: noOp,
    expect: noOp,
    notDeepEqual: noOp,
    notEqual: noOp,
    notOk: noOp,
    notStrictEqual: noOp,
    ok: noOp,
    propEqual: noOp,
    strictEqual: noOp,
    throws: noOp,
  };
}

let currentModule = '';

const nodeBackend: TestRunnerBackend = {
  module(name) {
    currentModule = name;
  },
  test(name, callback) {
    callback(createAssert(currentModule), { moduleName: currentModule, testName: name });
  },
};

export function installNodeTestRunner(): void {
  currentModule = '';
  TestRunner.install(nodeBackend);
}