import { HealthModule } from '@app/modules/health/health.module';
import { ProductsModule } from '@app/modules/products/products.module';
import { SharedModule } from '@app/modules/shared/shared.module';
import { ConfigModule } from '@libs/configurations/config.module';
import { OpenTelemetryModule } from '@libs/opentelemetry/opentelemetry.module';
import { PostgresTypeormModule } from '@libs/postgres-typeorm/postgres-typeorm.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // Global modules
    // https://docs.nestjs.com/modules#dynamic-modules
    // https://docs.nestjs.com/fundamentals/dynamic-modules
    ConfigModule.forRoot(),
    OpenTelemetryModule.forRoot(),
    // // `TypeOrmCoreModule` is global and create by `forRootAsync` and `forRoot` in `PostgresTypeormModule` but
    //`PostgresTypeormModule` itself is not global.`TypeOrmCoreModule` is global, so we should register it once in
    // AppModule but forFeature() is not global, so we should register it in each feature module.
    PostgresTypeormModule.forRoot(),

    // shared modules
    SharedModule,

    // feature modules
    ProductsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
