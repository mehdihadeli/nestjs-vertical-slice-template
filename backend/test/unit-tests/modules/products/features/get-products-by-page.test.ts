import { IProductRepository } from '@app/modules/products/contracts/product-repository';
import {
  GetProductsByPageHandler,
  GetProductsByPageQuery,
  GetProductsByPageResult,
} from '@app/modules/products/features/getting-products/get-products-by-page';
import { PRODUCT_REPOSITORY_TOKEN } from '@app/modules/products/products.tokens';
import { Substitute, SubstituteOf } from '@fluffy-spoon/substitute';
import { ValidationException } from '@libs/core/validations/validation-exception';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { FakeProduct } from '../../../../shared/fakes/fake-porduct';

describe('GetProductsByPageHandler', (): void => {
  let handler: GetProductsByPageHandler;
  let repository: SubstituteOf<IProductRepository>;

  beforeEach(async () => {
    repository = Substitute.for<IProductRepository>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsByPageHandler,
        {
          provide: PRODUCT_REPOSITORY_TOKEN,
          useValue: repository,
        },
      ],
    }).compile();

    handler = module.get<GetProductsByPageHandler>(GetProductsByPageHandler);
  });

  afterEach(() => {
    // Optional cleanup
  });

  describe('Given valid pagination parameters', () => {
    it('should return paginated products with correct metadata', async () => {
      // Arrange
      const pageNumber = 2;
      const pageSize = 5;
      const totalCount = 23;
      const products = Array.from({ length: 5 }, () => FakeProduct.generate());

      const query = GetProductsByPageQuery.of(pageNumber, pageSize);

      repository.getByPageAndTotalCount(pageNumber, pageSize).returns(Promise.resolve({ items: products, totalCount }));

      // Act
      const result = await handler.execute(query);

      // Assert
      repository.received(1).getByPageAndTotalCount(pageNumber, pageSize);

      expect(result).toBeInstanceOf(GetProductsByPageResult);
      expect(result.products).toHaveLength(5);
      expect(result.pageSize).toBe(pageSize);
      expect(result.pageCount).toBe(5);
    });

    it('should handle empty product list gracefully', async () => {
      // Arrange
      const pageNumber = 1;
      const pageSize = 10;
      const totalCount = 0;

      const query = GetProductsByPageQuery.of(pageNumber, pageSize);

      repository.getByPageAndTotalCount(pageNumber, pageSize).returns(Promise.resolve({ items: [], totalCount }));

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result.products).toHaveLength(0);
      expect(result.pageCount).toBe(0);
      expect(result.totalCount).toBe(0);
    });
  });

  describe('Given invalid pageNumber', () => {
    it('should throw validation error when pageNumber is zero or negative', () => {
      // Act & Assert
      expect(() => GetProductsByPageQuery.of(0, 5)).toThrow(new ValidationException('Page number must be at least 1.'));
      expect(() => GetProductsByPageQuery.of(-1, 5)).toThrow(
        new ValidationException('Page number must be at least 1.'),
      );
      expect(() => GetProductsByPageQuery.of(-0.5, 5)).toThrow(
        new ValidationException('Page number must be at least 1.'),
      );
    });
  });

  describe('Given invalid pageSize', () => {
    it('should throw validation error when pageSize is zero or negative', () => {
      // Act & Assert
      expect(() => GetProductsByPageQuery.of(1, 0)).toThrow(new ValidationException('Page size must be at least 1.'));
      expect(() => GetProductsByPageQuery.of(1, -5)).toThrow(new ValidationException('Page size must be at least 1.'));
      expect(() => GetProductsByPageQuery.of(1, -0.1)).toThrow(
        new ValidationException('Page size must be at least 1.'),
      );
    });
  });

  describe('Given repository.getByPageAndTotalCount throws an error', () => {
    it('should propagate the error', async () => {
      // Arrange
      const query = GetProductsByPageQuery.of(1, 5);
      repository.getByPageAndTotalCount(1, 5).throws(new Error('Database timeout'));

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow('Database timeout');
    });
  });

  describe('Given totalCount is not divisible by pageSize', () => {
    it('should calculate pageCount correctly using ceiling', async () => {
      // Arrange
      const pageNumber = 1;
      const pageSize = 3;
      const totalCount = 7;
      const products = Array.from({ length: 3 }, () => FakeProduct.generate());

      const query = GetProductsByPageQuery.of(pageNumber, pageSize);

      repository.getByPageAndTotalCount(pageNumber, pageSize).returns(Promise.resolve({ items: products, totalCount }));

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result.pageCount).toBe(3);
    });
  });

  describe('Given default parameters (no args passed to .of())', () => {
    it('should use defaults: pageNumber=1, pageSize=5', async () => {
      // Arrange
      const query = GetProductsByPageQuery.of(); // defaults

      const products = Array.from({ length: 5 }, () => FakeProduct.generate());
      const totalCount = 15;

      repository.getByPageAndTotalCount(1, 5).returns(Promise.resolve({ items: products, totalCount }));

      // Act
      const result = await handler.execute(query);

      // Assert
      repository.received(1).getByPageAndTotalCount(1, 5);
      expect(result.pageSize).toBe(5);
      expect(result.pageCount).toBe(3);
    });
  });

  describe('Given page number exceeds available pages', () => {
    it('should return empty array but correct metadata', async () => {
      // Arrange
      const pageNumber = 999;
      const pageSize = 10;
      const totalCount = 50;

      const query = GetProductsByPageQuery.of(pageNumber, pageSize);

      repository.getByPageAndTotalCount(pageNumber, pageSize).returns(Promise.resolve({ items: [], totalCount }));

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result.products).toHaveLength(0);
      expect(result.pageCount).toBe(5);
      expect(result.totalCount).toBe(50);
    });
  });
});
