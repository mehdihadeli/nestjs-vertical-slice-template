import { ENVIRONMENT_TOKEN } from '@libs/configurations/constants';
import { Environment } from '@libs/configurations/environment';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DependencyValidatorService implements OnModuleInit {
  private readonly logger = new Logger(DependencyValidatorService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(ENVIRONMENT_TOKEN) private readonly environment: Environment,
  ) {}

  onModuleInit(): void {
    this.logger.log(`Validating global configuration in ${this.environment} environment...`);

    if (!this.configService) {
      throw new Error(
        'PostgresTypeormModule: ConfigService is not available. ' +
          'Did you forget to import CustomConfigModule.forRoot(...) in AppModule?',
      );
    }

    if (!this.environment || !Object.values(Environment).includes(this.environment)) {
      throw new Error(
        'PostgresTypeormModule: ENVIRONMENT_TOKEN is invalid or not provided. ' +
          'Ensure CustomConfigModule.forRoot(...) is registered globally in AppModule.',
      );
    }
  }
}
