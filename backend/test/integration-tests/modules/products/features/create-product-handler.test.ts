import { CreateProduct, CreateProductResult } from '@app/modules/products/features/creating-product/create-product';
import { ConflictException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AppSharedFixture } from '../../../../shared/app-shared-fixture';
import { FakeProduct } from '../../../../shared/fakes/fake-porduct';

const sharedFixture = new AppSharedFixture();
const logger = sharedFixture.getLogger();

describe('CreateProductHandler (Integration)', () => {
  let commandBus: CommandBus;

  beforeAll(async () => {
    logger.log('Initializing CreateProductHandler integration test...');
    await sharedFixture.initialize();
    commandBus = sharedFixture.getHandler(CommandBus);
  });

  afterEach(async () => {
    logger.log('Cleaning up database...');
    await sharedFixture.cleanup();
  });

  afterAll(async () => {
    logger.log('Disposing test infrastructure...');
    await sharedFixture.dispose();
  });

  describe('Given valid product data', () => {
    it('should create product successfully and return result', async () => {
      // Arrange
      const fake = FakeProduct.generate();
      const command = new CreateProduct(fake.name, fake.price, fake.sku, fake.description);

      // Act
      const result = await commandBus.execute<CreateProduct, CreateProductResult>(command);

      // Assert
      expect(result).toBeInstanceOf(CreateProductResult);
      expect(result.name).toBe(fake.name);
      expect(result.sku).toBe(fake.sku);
      expect(Number(result.price)).toBe(fake.price);
      expect(result.description).toBe(fake.description ?? null);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Given SKU already exists', () => {
    it('should throw ConflictException', async () => {
      // Arrange
      const existing = FakeProduct.generate();
      const firstCommand = new CreateProduct(existing.name, existing.price, existing.sku, existing.description);

      await commandBus.execute(firstCommand);

      // Try to create another with same SKU
      const secondFake = FakeProduct.generate({ sku: existing.sku }); // Force same SKU
      const secondCommand = new CreateProduct(
        secondFake.name,
        secondFake.price,
        secondFake.sku,
        secondFake.description,
      );

      // Act & Assert
      await expect(commandBus.execute(secondCommand)).rejects.toThrow(ConflictException);
      await expect(commandBus.execute(secondCommand)).rejects.toThrow(
        `Product with SKU '${existing.sku}' already exists.`,
      );
    });
  });
});
