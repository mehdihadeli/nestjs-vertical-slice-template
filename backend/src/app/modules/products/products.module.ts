import { SharedModule } from '@app/modules/shared/shared.module';
import { PostgresTypeormModule } from '@libs/postgres-typeorm/postgres-typeorm.module';
import { Module } from '@nestjs/common';

import { ProductSchema } from './data/product.schema';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [SharedModule, PostgresTypeormModule.forFeature([ProductSchema])],
})
export class ProductsModule {}
