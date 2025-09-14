import { Product } from '@app/modules/products/entities/product.entity';
import { faker } from '@faker-js/faker';

export class FakeProduct {
  static generate(overrides: Partial<Product> = {}): Product {
    return {
      id: overrides.id ?? '',
      name: overrides.name ?? faker.commerce.productName(),
      price: overrides.price ?? parseFloat(faker.commerce.price({ min: 1, max: 1000, dec: 2 })),
      sku: overrides.sku ?? faker.commerce.isbn(),
      description: overrides.description ?? faker.commerce.productDescription(),
      createdAt: overrides.createdAt ?? faker.date.past(),
      createdBy: overrides.createdBy ?? faker.string.uuid(),
      lastModifiedAt: overrides.lastModifiedAt ?? undefined,
      lastModifiedBy: overrides.lastModifiedBy ?? undefined,
      version: overrides.version ?? 0,
      deletedAt: overrides.deletedAt ?? undefined,
    };
  }
}
