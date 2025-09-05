import { Module } from '@nestjs/common';

import { ProblemDetailsExceptionFilter } from './problem-details-exception.filter';
import { ProblemDetailsUtils } from './problem-details-utils';

@Module({
  providers: [
    ProblemDetailsUtils,
    // Provide the filter as a global filter if you want to use it globally
    {
      provide: 'APP_FILTER',
      useClass: ProblemDetailsExceptionFilter,
    },
  ],
  exports: [ProblemDetailsUtils],
})
export class ExceptionsModule {}
