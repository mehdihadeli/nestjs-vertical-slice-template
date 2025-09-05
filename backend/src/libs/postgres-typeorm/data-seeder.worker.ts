import { Environment } from '@libs/core/environment';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'; // Import Logger
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      if (process.env.NODE_ENV !== Environment.Development) {
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
