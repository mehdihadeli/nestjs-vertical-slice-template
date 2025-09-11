import { IProductRepository } from '@app/modules/products/contracts/product-repository';
import { ProductDto } from '@app/modules/products/dto/product-dto';
import {
  GetProductByIdQuery,
  GetProductByIdResult,
} from '@app/modules/products/features/getting-product-by-id/get-product-by-id';
import { PRODUCT_REPOSITORY_TOKEN } from '@app/modules/products/products.tokens';
import { ValidationException } from '@libs/core/validations/validation-exception';
import { NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { v7 as uuidv7 } from 'uuid';

import { AppSharedFixture } from '../../../../shared/app-shared-fixture';
import { FakeProduct } from '../../../../shared/fakes/fake-porduct';

const sharedFixture = new AppSharedFixture();
const logger = sharedFixture.getLogger();

describe('GetProductByIdHandler (Integration)', () => {
  let queryBus: QueryBus;
  let repo: IProductRepository;

  beforeAll(async () => {
    logger.log('Initializing GetProductByIdHandler integration test...');
    await sharedFixture.initialize();
    queryBus = sharedFixture.getHandler(QueryBus);
    repo = sharedFixture.getHandler(PRODUCT_REPOSITORY_TOKEN);
  });

  afterEach(async () => {
    logger.log('Cleaning up database...');
    await sharedFixture.cleanup();
  });

  afterAll(async () => {
    logger.log('Disposing test infrastructure...');
    await sharedFixture.dispose();
  });

  describe('Given product exists', () => {
    it('should return product DTO successfully', async () => {
      // Arrange
      const fake = FakeProduct.generate();
      const saved = await repo.createProduct(fake.name, fake.price, fake.sku, fake.description);

      const query = GetProductByIdQuery.of(saved.id);

      // Act
      const result = await queryBus.execute<GetProductByIdQuery, GetProductByIdResult>(query);

      // Assert
      expect(result).toBeInstanceOf(GetProductByIdResult);
      expect(result.product).toBeInstanceOf(ProductDto);

      const dto = result.product;
      expect(dto.id).toBe(saved.id);
      expect(dto.name).toBe(fake.name);
      expect(dto.sku).toBe(fake.sku);
      expect(parseFloat(dto.price as any)).toBeCloseTo(fake.price, 2);
      expect(dto.description).toBe(fake.description ?? null);
      expect(dto.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Given product does not exist', () => {
    it('should throw NotFoundException', async () => {
      // Arrange
      const nonExistentId = uuidv7();
      const query = GetProductByIdQuery.of(nonExistentId);

      // Act & Assert
      await expect(queryBus.execute(query)).rejects.toThrow(NotFoundException);
      await expect(queryBus.execute(query)).rejects.toThrow(`Product with ID '${nonExistentId}' not found.`);
    });
  });

  describe('Given invalid ID (null or whitespace)', () => {
    it('should throw ValidationException', () => {
      // Act & Assert
      expect(() => GetProductByIdQuery.of(null as any)).toThrow(new ValidationException('Product ID is required.'));
      expect(() => GetProductByIdQuery.of('')).toThrow(new ValidationException('Product ID is required.'));
      expect(() => GetProductByIdQuery.of('   ')).toThrow(new ValidationException('Product ID is required.'));
    });
  });
});
