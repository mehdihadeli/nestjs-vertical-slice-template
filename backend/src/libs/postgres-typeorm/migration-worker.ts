import { ENVIRONMENT_TOKEN } from '@libs/configurations/constants';
import { Environment } from '@libs/configurations/environment';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MigrationWorker implements OnModuleInit {
  private readonly logger = new Logger(MigrationWorker.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(ENVIRONMENT_TOKEN) private readonly environment: Environment,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.environment === Environment.Development || this.environment === Environment.Test) {
      try {
        this.logger.log('Running database migrations...');
        await this.dataSource.runMigrations({ transaction: 'all' });
        this.logger.log('✅ Database migrations completed successfully.');
      } catch (error) {
        this.logger.error('❌ Failed to run migrations:', error);
        throw error;
      }
    }
  }
}
