import { ProductRepository } from '@app/modules/products/data/product.repository';
import { CreateProductHandler } from '@app/modules/products/features/creating-product/create-product';
import { CreateProductController } from '@app/modules/products/features/creating-product/create-product.controller';
import { GetProductByIdHandler } from '@app/modules/products/features/getting-product-by-id/get-product-by-id';
import { GetProductByIdController } from '@app/modules/products/features/getting-product-by-id/get-product-by-id-controller';
import { GetProductsByPageHandler } from '@app/modules/products/features/getting-products/get-products-by-page';
import { GetProductsByPageController } from '@app/modules/products/features/getting-products/get-products-by-page-controller';
import { PRODUCT_REPOSITORY_TOKEN } from '@app/modules/products/products.tokens';
import { PostgresTypeormModule } from '@libs/postgres-typeorm/postgres-typeorm.module';
import { Module } from '@nestjs/common';

import { ProductSchema } from './data/product.schema';

const CommandHandlers = [CreateProductHandler, GetProductsByPageHandler, GetProductByIdHandler];
const Controllers = [CreateProductController, GetProductsByPageController, GetProductByIdController];

@Module({
  providers: [
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: ProductRepository,
    },
    ...CommandHandlers,
  ],
  controllers: [...Controllers],
  imports: [
    //SharedModule,
    PostgresTypeormModule.forFeature([ProductSchema]),
  ],
})
export class ProductsModule {}
