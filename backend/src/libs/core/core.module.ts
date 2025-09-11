import { AppOptions } from '@libs/configurations/app-options';
import { CustomConfigModule } from '@libs/configurations/config-module';
import { Configuration } from '@libs/configurations/configuration';
import { DependencyValidatorService } from '@libs/core/dependency-validator.service';
import { ProblemDetailsExceptionFilter } from '@libs/core/exceptions/problem-details-exception.filter';
import { ProblemDetailsUtils } from '@libs/core/exceptions/problem-details-utils';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
  imports: [CustomConfigModule.forFeature(Configuration.addOptions<AppOptions>('appOptions')), CqrsModule.forRoot()],
  providers: [
    ProblemDetailsUtils,
    // Provide the filter as a global filter if you want to use it globally
    DependencyValidatorService,
    {
      provide: 'APP_FILTER',
      useClass: ProblemDetailsExceptionFilter,
    },
  ],
  exports: [
    // Re-export CqrsModule
    CqrsModule,
    ProblemDetailsUtils,
  ],
})
export class CoreModule {}
