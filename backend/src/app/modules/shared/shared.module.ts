import { CustomConfigModule } from '@libs/configurations/config-module';
import { CoreModule } from '@libs/core/core.module';
import { PinoLoggerModule } from '@libs/logger/pino/pino-logger.module';
import { OpenTelemetryModule } from '@libs/opentelemetry/opentelemetry.module';
import { PostgresTypeormModule } from '@libs/postgres-typeorm/postgres-typeorm.module';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    // Global modules
    // https://docs.nestjs.com/modules#dynamic-modules
    // https://docs.nestjs.com/fundamentals/dynamic-modules
    CustomConfigModule.forRoot(),
    PinoLoggerModule.forRootAsync(),
    OpenTelemetryModule.forRoot(),
    // `TypeOrmCoreModule` is global and create by `forRootAsync` and `forRoot` in `PostgresTypeormModule` but
    //`PostgresTypeormModule` itself is not global.`TypeOrmCoreModule` is global, so we should register it once in
    // AppModule but forFeature() is not global, so we should register it in each feature module.
    PostgresTypeormModule.forRootAsync(),
    CoreModule,
  ],
  providers: [],
})
export class SharedModule {}
