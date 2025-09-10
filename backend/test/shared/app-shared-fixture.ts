import { SharedFixture } from '@libs/test/fixtures/shared-fixture';

import { AppTestInfrastructureBootstrapper } from './test-app-infrastructure-bootstrapper';

export class AppSharedFixture extends SharedFixture {
  constructor() {
    super(new AppTestInfrastructureBootstrapper());
  }
}
