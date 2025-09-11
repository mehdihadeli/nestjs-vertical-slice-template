import { IProductRepository } from '@app/modules/products/contracts/product-repository';
import { ProductDto } from '@app/modules/products/dto/product-dto';
import {
  GetProductsByPageQuery,
  GetProductsByPageResult,
} from '@app/modules/products/features/getting-products/get-products-by-page';
import { PRODUCT_REPOSITORY_TOKEN } from '@app/modules/products/products.tokens';
import { ValidationException } from '@libs/core/validations/validation-exception';
import { QueryBus } from '@nestjs/cqrs';

import { AppSharedFixture } from '../../../../shared/app-shared-fixture';
import { FakeProduct } from '../../../../shared/fakes/fake-porduct';

const sharedFixture = new AppSharedFixture();
const logger = sharedFixture.getLogger();

describe('GetProductsByPageHandler (Integration)', () => {
  let queryBus: QueryBus;
  let repo: IProductRepository;

  beforeAll(async () => {
    logger.log('Initializing GetProductsByPageHandler integration test...');
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

  describe('Given no products exist', () => {
    it('should return empty list with zero total count', async () => {
      // Arrange
      const query = GetProductsByPageQuery.of(1, 10);

      // Act
      const result = await queryBus.execute<GetProductsByPageQuery, GetProductsByPageResult>(query);

      // Assert
      expect(result).toBeInstanceOf(GetProductsByPageResult);
      expect(result.products).toHaveLength(0);
      expect(result.totalCount).toBe(0);
      expect(result.pageCount).toBe(0);
      expect(result.pageSize).toBe(10);
    });
  });

  describe('Given products exist and page is within range', () => {
    it('should return correct page of products with accurate pagination metadata', async () => {
      // Arrange
      const products = [
        FakeProduct.generate({ name: 'Product A', sku: 'SKU-001', price: 10.5 }),
        FakeProduct.generate({ name: 'Product B', sku: 'SKU-002', price: 20.75 }),
        FakeProduct.generate({ name: 'Product C', sku: 'SKU-003', price: 30.0 }),
        FakeProduct.generate({ name: 'Product D', sku: 'SKU-004', price: 40.99 }),
        FakeProduct.generate({ name: 'Product E', sku: 'SKU-005', price: 50.25 }),
      ];
      for (const product of products) {
        await repo.createProduct(product.name, product.price, product.sku, product.description);
      }

      const query = GetProductsByPageQuery.of(1, 3);

      // Act
      const result = await queryBus.execute<GetProductsByPageQuery, GetProductsByPageResult>(query);

      // Assert
      expect(result).toBeInstanceOf(GetProductsByPageResult);
      expect(result.products).toHaveLength(3);
      expect(result.totalCount).toBe(5);
      expect(result.pageCount).toBe(2);
      expect(result.pageSize).toBe(3);

      // Validate DTOs
      const firstProduct = result.products[0];
      const firstExistingProduct = products.find(x => x.sku === firstProduct.sku);

      expect(firstProduct).toBeInstanceOf(ProductDto);
      expect(firstProduct.name).toBe(firstExistingProduct!.name);
      expect(firstProduct.sku).toBe(firstExistingProduct!.sku);
      expect(parseFloat(firstProduct.price as any)).toBeCloseTo(firstExistingProduct!.price, 2);
    });
  });

  describe('Given page number is out of range (too high)', () => {
    it('should return empty product list but correct metadata', async () => {
      // Arrange
      const product = FakeProduct.generate();
      await repo.createProduct(product.name, product.price, product.sku, product.description);

      const query = GetProductsByPageQuery.of(999, 10);

      // Act
      const result = await queryBus.execute<GetProductsByPageQuery, GetProductsByPageResult>(query);

      // Assert
      expect(result.products).toHaveLength(0);
      expect(result.totalCount).toBe(1);
      expect(result.pageCount).toBe(1);
      expect(result.pageSize).toBe(10);
    });
  });

  describe('Given invalid page number (<=0)', () => {
    it('should throw ValidationException', () => {
      // Act & Assert
      expect(() => GetProductsByPageQuery.of(0, 10)).toThrow(
        new ValidationException('Page number must be at least 1.'),
      );
      expect(() => GetProductsByPageQuery.of(-1, 10)).toThrow(
        new ValidationException('Page number must be at least 1.'),
      );
    });
  });

  describe('Given invalid page size (<=0)', () => {
    it('should throw ValidationException', () => {
      // Act & Assert
      expect(() => GetProductsByPageQuery.of(1, 0)).toThrow(new ValidationException('Page size must be at least 1.'));
      expect(() => GetProductsByPageQuery.of(1, -5)).toThrow(new ValidationException('Page size must be at least 1.'));
    });
  });
});
