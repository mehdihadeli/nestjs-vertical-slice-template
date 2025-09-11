import { HealthModule } from '@app/modules/health/health.module';
import { ProductsModule } from '@app/modules/products/products.module';
import { SharedModule } from '@app/modules/shared/shared.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
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
