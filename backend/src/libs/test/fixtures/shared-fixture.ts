import { AppModule } from '@app/app.module';
import { ProblemDetails } from '@libs/core/exceptions/problem-details';
import {
  DefaultTestAppInfrastructureBootstrapper,
  TestAppInfrastructureBootstrapper,
} from '@libs/test/test-app-bootstrapper';
import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { TestingLogger } from '@nestjs/testing/services/testing-logger.service';

import { PostgresContainerFixture } from './postgres-fixture';

export class SharedFixture {
  public app: INestApplication | null = null;
  public postgresFixture: PostgresContainerFixture;
  private testAppInfrastructureBootstrapper: TestAppInfrastructureBootstrapper;
  private logger = new Logger('SharedFixture');

  constructor(bootstrapper?: TestAppInfrastructureBootstrapper) {
    this.postgresFixture = new PostgresContainerFixture();
    this.testAppInfrastructureBootstrapper = bootstrapper ?? new DefaultTestAppInfrastructureBootstrapper();
  }

  public getLogger(): Logger {
    return this.logger;
  }
  public async initialize(): Promise<void> {
    await this.postgresFixture.start();

    // - Envs to override should add before Configuration provider built and collect configurations to override
    // app configurations. After build configuration is completed, configuration elements don't update further via
    // environment or appsettings.json because configuration providers setup is completed
    this.overrideConfigForTests();

    const moduleBuilder: TestingModuleBuilder = Test.createTestingModule({
      imports: [AppModule],
    });

    // // or Override the TypeOrmModule configuration globally instead of overrideConfigForTests
    // moduleBuilder.overrideProvider(TYPEORM_MODULE_OPTIONS).useValue({})

    const moduleRef: TestingModule = await moduleBuilder.compile();
    this.app = moduleRef.createNestApplication();
    this.testAppInfrastructureBootstrapper.bootstrap(this.app);
    this.app?.useLogger(new TestingLogger());

    await this.app?.init();

    console.log('✅ Test app initialized with selected testAppInfrastructureBootstrapper');
  }

  /**
   * Helper to validate ProblemDetails response
   */
  public assertProblemDetails(body: any, expectedStatus: number, detail?: string, title?: string, type?: string): void {
    const { type: actualType, title: actualTitle, status, detail: actualDetail } = body as ProblemDetails;

    expect(body).toBeDefined();
    expect(actualType).toBeDefined();
    expect(actualTitle).toBeDefined();
    expect(status).toBe(expectedStatus);
    expect(actualDetail).toBeDefined();

    if (detail) expect(actualDetail).toContain(detail);
    if (title) expect(actualTitle).toContain(title);
    if (type) expect(actualType).toContain(type);
  }

  public async cleanup(): Promise<void> {
    await this.postgresFixture.resetDb();
  }

  public async dispose(): Promise<void> {
    if (this.app) {
      await this.app.close();
    }
    await this.postgresFixture.stop();
  }

  public getHandler<T>(token: any): T {
    if (!this.app) throw new Error('App not initialized');
    return this.app.get(token);
  }

  private overrideConfigForTests(): void {
    process.env.POSTGRES_OPTIONS__CONNECTION_STRING = this.postgresFixture.getConnectionString();
  }
}
