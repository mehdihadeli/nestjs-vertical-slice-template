import { Product } from '@app/modules/products/entities/product.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Product, faker => {
  const now = new Date();
  const systemUserId = faker.string.uuid();

  const product: Partial<Product> = {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price({ min: 0.5, max: 20, dec: 2 })),
    sku: faker.string.alphanumeric({ length: 10, casing: 'upper' }),
    createdAt: now,
    createdBy: systemUserId,
    lastModifiedAt: now,
    lastModifiedBy: systemUserId,
    version: 1,
    isDeleted: false,
  };

  return product;
});
