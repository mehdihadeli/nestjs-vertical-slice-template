import { ENVIRONMENT_TOKEN } from '@libs/configurations/constants';
import { Environment } from '@libs/configurations/environment';
import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  // will get the global internal logger instance that set by `app.useLogger()`
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(ENVIRONMENT_TOKEN) private readonly environment: Environment,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      if (this.environment !== Environment.Development) {
        this.logger.warn('Seeding skipped: Not in development or test environment.');
        return;
      }

      this.logger.log('Starting database seeding process...');

      await runSeeders(this.dataSource);
      this.logger.log('Database seeding completed successfully.');
    } catch (error) {
      this.logger.error('An error occurred during database seeding.', error);
    }
  }
}
