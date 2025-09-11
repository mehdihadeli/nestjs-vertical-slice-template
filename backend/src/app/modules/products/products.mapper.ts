import { ProductDto } from '@app/modules/products/dto/product-dto';
import { Product } from '@app/modules/products/entities/product.entity';
import { CreateProductResult } from '@app/modules/products/features/creating-product/create-product';

export class ProductsMapper {
  static productToCreateResult(product: Product): CreateProductResult {
    return new CreateProductResult(
      product.id,
      product.name,
      product.price,
      product.sku,
      product.description ?? null,
      product.createdAt,
    );
  }
  static productToProductDto(entity: Product): ProductDto {
    return new ProductDto(entity.id, entity.name, entity.price, entity.sku, entity.createdAt, entity.description);
  }
}
