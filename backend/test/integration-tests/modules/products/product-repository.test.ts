import { IProductRepository } from '@app/modules/products/contracts/product-repository';
import { PRODUCT_REPOSITORY_TOKEN } from '@app/modules/products/products.tokens';

import { AppSharedFixture } from '../../../shared/app-shared-fixture';
import { FakeProduct } from '../../../shared/fakes/fake-porduct';

const sharedFixture = new AppSharedFixture();
const logger = sharedFixture.getLogger();

describe('ProductRepository', () => {
  let repo: IProductRepository;

  beforeAll(async () => {
    logger.log('beforeAll');
    await sharedFixture.initialize();
    repo = sharedFixture.getHandler(PRODUCT_REPOSITORY_TOKEN);
  });

  afterEach(async () => {
    logger.log('afterEach');
    await sharedFixture.cleanup();
  });

  afterAll(async () => {
    logger.log('afterAll');
    await sharedFixture.dispose();
  });

  it('should save and retrieve a product', async () => {
    const product = FakeProduct.generate();

    // Act
    const saved = await repo.createProduct(product.name, product.price, product.sku, product.description);
    const found = await repo.findById(saved.id);

    // Assert
    expect(found).toBeDefined();
    expect(found!.name).toBe(product.name);
    expect(found!.sku).toBe(product.sku);
  });
});
