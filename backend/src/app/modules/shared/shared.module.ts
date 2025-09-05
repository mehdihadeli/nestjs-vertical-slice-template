import { CoreModule } from '@libs/core/core.module';
import { NestLoggerModule } from '@libs/logger/nest/nest-logger.module';
import { OpenTelemetryModule } from '@libs/opentelemetry/opentelemetry.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CoreModule, NestLoggerModule],
})
export class SharedModule {}
