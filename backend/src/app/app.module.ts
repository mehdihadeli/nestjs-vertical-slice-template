import { HealthModule } from '@app/modules/health/health.module';
import { ProductsModule } from '@app/modules/products/products.module';
import { SharedModule } from '@app/modules/shared/shared.module';
import { CustomConfigModule } from '@libs/configurations/config-module';
import { PinoLoggerModule } from '@libs/logger/pino/pino-logger.module';
import { OpenTelemetryModule } from '@libs/opentelemetry/opentelemetry.module';
import { PostgresTypeormModule } from '@libs/postgres-typeorm/postgres-typeorm.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // Global modules
    // https://docs.nestjs.com/modules#dynamic-modules
    // https://docs.nestjs.com/fundamentals/dynamic-modules
    CustomConfigModule.forRoot(),
    OpenTelemetryModule.forRoot(),
    // `TypeOrmCoreModule` is global and create by `forRootAsync` and `forRoot` in `PostgresTypeormModule` but
    //`PostgresTypeormModule` itself is not global.`TypeOrmCoreModule` is global, so we should register it once in
    // AppModule but forFeature() is not global, so we should register it in each feature module.
    PostgresTypeormModule.forRootAsync(),
    PinoLoggerModule.forRootAsync(),

    // // shared modules
    SharedModule,

    // feature modules
    ProductsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
