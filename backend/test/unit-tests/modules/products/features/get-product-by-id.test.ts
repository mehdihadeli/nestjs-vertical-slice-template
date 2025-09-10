import { IProductRepository } from '@app/modules/products/contracts/product-repository';
import {
  GetProductByIdHandler,
  GetProductByIdQuery,
  GetProductByIdResult,
} from '@app/modules/products/features/getting-product-by-id/get-product-by-id';
import { ProductsMapper } from '@app/modules/products/products.mapper';
import { PRODUCT_REPOSITORY_TOKEN } from '@app/modules/products/products.tokens';
import { faker } from '@faker-js/faker';
import { Substitute, SubstituteOf } from '@fluffy-spoon/substitute';
import { ValidationException } from '@libs/core/validations/validation-exception';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { FakeProduct } from '../../../../shared/fakes/fake-porduct';

describe('GetProductByIdHandler', (): void => {
  let handler: GetProductByIdHandler;
  let repository: SubstituteOf<IProductRepository>;

  beforeEach(async () => {
    repository = Substitute.for<IProductRepository>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductByIdHandler,
        {
          provide: PRODUCT_REPOSITORY_TOKEN,
          useValue: repository,
        },
      ],
    }).compile();

    handler = module.get<GetProductByIdHandler>(GetProductByIdHandler);
  });

  afterEach(() => {
    // Optional cleanup
  });

  describe('Given valid product ID and product exists', () => {
    it('should return mapped product DTO', async () => {
      // Arrange
      const productId = faker.string.uuid();
      const product = FakeProduct.generate({ id: productId });

      const query = GetProductByIdQuery.of(productId);

      repository.findById(productId).returns(Promise.resolve(product));

      // Act
      const result = await handler.execute(query);

      // Assert
      repository.received(1).findById(productId);
      expect(result).toBeInstanceOf(GetProductByIdResult);

      // Verify
      const expectedDto = ProductsMapper.productToProductDto(product);
      expect(result.product).toEqual(expectedDto);

      expect(result.product.id).toBe(product.id);
      expect(result.product.name).toBe(product.name);
      expect(result.product.sku).toBe(product.sku);
      expect(result.product.price).toBe(product.price);
      expect(result.product.description).toBe(product.description || null);
      expect(result.product.createdAt).toEqual(product.createdAt);
    });
  });

  describe('Given product does not exist', () => {
    it('should throw NotFoundException', async () => {
      // Arrange
      const productId = faker.string.uuid();
      const query = GetProductByIdQuery.of(productId);

      repository.findById(productId).returns(Promise.resolve(null));

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow(`Product with ID '${productId}' not found.`);
    });
  });

  describe('Given invalid ID', () => {
    it('should throw validation error when ID is null or whitespace', () => {
      // Act & Assert
      expect(() => GetProductByIdQuery.of('')).toThrow(new ValidationException('Product ID is required.'));
      expect(() => GetProductByIdQuery.of(null as any)).toThrow(new ValidationException('Product ID is required.'));
      expect(() => GetProductByIdQuery.of('   ')).toThrow(new ValidationException('Product ID is required.'));
    });
  });

  describe('Given repository.findById throws an error', () => {
    it('should propagate the error', async () => {
      // Arrange
      const productId = faker.string.uuid();
      const query = GetProductByIdQuery.of(productId);

      repository.findById(productId).throws(new Error('Database connection failed'));

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow('Database connection failed');
    });
  });

  describe('Given ID with surrounding whitespace', () => {
    it('should trim whitespace and find product', async () => {
      // Arrange
      const rawId = `  ${faker.string.uuid()}  `;
      const trimmedId = rawId.trim();
      const product = FakeProduct.generate({ id: trimmedId });

      const query = GetProductByIdQuery.of(rawId); // with whitespace

      repository.findById(trimmedId).returns(Promise.resolve(product));

      // Act
      const result = await handler.execute(query);

      // Assert
      repository.received(1).findById(trimmedId); // called with trimmed ID
      expect(result.product.id).toBe(trimmedId);
    });
  });
});
