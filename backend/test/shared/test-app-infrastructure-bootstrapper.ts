import { AppInfrastructure } from '@app/app.infrastructure';
import { TestAppInfrastructureBootstrapper } from '@libs/test/test-app-bootstrapper';
import { INestApplication } from '@nestjs/common';

export class AppTestInfrastructureBootstrapper implements TestAppInfrastructureBootstrapper {
  bootstrap(app: INestApplication): void {
    AppInfrastructure.setup(app);
  }
}
