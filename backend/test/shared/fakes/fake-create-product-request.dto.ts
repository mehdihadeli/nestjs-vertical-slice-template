import { CreateProductRequestDto } from '@app/modules/products/features/creating-product/create-product.controller';
import { faker } from '@faker-js/faker';

export class FakeCreateProductRequestDto {
  static generate(overrides: Partial<CreateProductRequestDto> = {}): CreateProductRequestDto {
    return {
      name: overrides.name ?? faker.commerce.productName(),
      price: overrides.price ?? parseFloat(faker.commerce.price({ min: 0.01, max: 999.99, dec: 2 })),
      sku: overrides.sku ?? faker.commerce.isbn(), // or use faker.string.alphanumeric({ length: 10 }).toUpperCase()
      description: overrides.description ?? faker.commerce.productDescription(),
    };
  }
}
