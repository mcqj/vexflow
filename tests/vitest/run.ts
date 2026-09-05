import { VexFlowTests } from "../vexflow_test_helpers";

import "../index";

export function runVitestJob(job: number): void {
  VexFlowTests.run({ jobs: 4, job });
}
