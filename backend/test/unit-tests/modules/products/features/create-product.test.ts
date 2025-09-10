import { IProductRepository } from '@app/modules/products/contracts/product-repository';
import {
  CreateProduct,
  CreateProductHandler,
  CreateProductResult,
} from '@app/modules/products/features/creating-product/create-product';
import { PRODUCT_REPOSITORY_TOKEN } from '@app/modules/products/products.tokens';
import { faker } from '@faker-js/faker';
import { Arg, Substitute, SubstituteOf } from '@fluffy-spoon/substitute';
import { ValidationException } from '@libs/core/validations/validation-exception';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { FakeProduct } from '../../../../shared/fakes/fake-porduct';

describe('CreateProductHandler', (): void => {
  let handler: CreateProductHandler;
  let repository: SubstituteOf<IProductRepository>;

  beforeEach(async () => {
    repository = Substitute.for<IProductRepository>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductHandler,
        {
          provide: PRODUCT_REPOSITORY_TOKEN,
          useValue: repository,
        },
      ],
    }).compile();

    handler = module.get<CreateProductHandler>(CreateProductHandler);
  });
  afterEach(async () => {
    // cleanup for each test
  });

  describe('Given valid product data', () => {
    it('should create product successfully and return result', async () => {
      // Arrange
      const productName = faker.commerce.productName();
      const productPrice = parseFloat(faker.commerce.price({ min: 0.01, max: 999.99, dec: 2 }));
      const productSku = faker.string.alphanumeric({ length: 10 }).toUpperCase();
      const productDescription = faker.commerce.productDescription();

      const command = CreateProduct.of(productName, productPrice, productSku, productDescription);

      const fakeProduct = FakeProduct.generate({
        name: productName,
        price: productPrice,
        sku: productSku,
        description: productDescription,
      });

      // simulate items doesn't exist before
      repository.findBySku(productSku).returns(Promise.resolve(null));
      repository
        .createProduct(productName, productPrice, productSku, productDescription)
        .returns(Promise.resolve(fakeProduct));

      // Act
      const result = await handler.execute(command);

      // Assert
      repository.received().findBySku(productSku);
      repository.received(1).createProduct(productName, productPrice, productSku, productDescription);

      expect(result).toBeInstanceOf(CreateProductResult);
      expect(result.name).toBe(productName);
      expect(result.sku).toBe(productSku);
      expect(result.price).toBe(productPrice);
      expect(result.description).toBe(productDescription);
    });
  });

  describe('Given SKU already exists', () => {
    it('should throw ConflictException', async () => {
      // Arrange
      const existingSku = faker.string.alphanumeric({ length: 8 }).toUpperCase();
      const existingProduct = FakeProduct.generate({ sku: existingSku });

      const command = CreateProduct.of(
        faker.commerce.productName(),
        parseFloat(faker.commerce.price({ min: 1, dec: 2 })),
        existingSku,
        faker.commerce.productDescription(),
      );

      // simulate item already exists
      repository.findBySku(existingSku).returns(Promise.resolve(existingProduct));

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(ConflictException);
      await expect(handler.execute(command)).rejects.toThrow(`Product with SKU '${existingSku}' already exists.`);

      repository.didNotReceive().createProduct(Arg.any(), Arg.any(), Arg.any(), Arg.any());
    });
  });

  describe('Given repository.createProduct throws an error', () => {
    it('should propagate the error', async () => {
      // Arrange
      const command = CreateProduct.of(
        faker.commerce.productName(),
        parseFloat(faker.commerce.price({ min: 1, dec: 2 })),
        faker.string.alphanumeric({ length: 8 }).toUpperCase(),
        faker.commerce.productDescription(),
      );

      repository.findBySku(command.sku).returns(Promise.resolve(null));
      repository
        .createProduct(Arg.any(), Arg.any(), Arg.any(), Arg.any())
        .throws(new Error('Database connection failed'));

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow('Database connection failed');
    });
  });

  describe('Given invalid name', () => {
    it('should throw validation error when name is null or whitespace', () => {
      // Act & Assert
      expect(() => CreateProduct.of('', 10, 'SKU-001')).toThrow(new ValidationException('Product name is required.'));
      expect(() => CreateProduct.of(null as any, 10, 'SKU-001')).toThrow(
        new ValidationException(`Product name is required.`),
      );
      expect(() => CreateProduct.of('   ', 10, 'SKU-001')).toThrow(
        new ValidationException(`Product name is required.`),
      );
    });
  });

  describe('Given invalid price', () => {
    it('should throw validation error when price is zero or negative', () => {
      // Act & Assert
      expect(() => CreateProduct.of('Product', 0, 'SKU-001')).toThrow(
        new ValidationException(`Price must be greater than zero.`),
      );
      expect(() => CreateProduct.of('Product', -5, 'SKU-001')).toThrow(
        new ValidationException(`Price must be greater than zero.`),
      );
      expect(() => CreateProduct.of('Product', -0.01, 'SKU-001')).toThrow(
        new ValidationException(`Price must be greater than zero.`),
      );
    });
  });

  describe('Given invalid SKU', () => {
    it('should throw validation error when SKU is null or whitespace', () => {
      // Act & Assert
      expect(() => CreateProduct.of('Product', 10, '')).toThrow(new ValidationException('SKU is required.'));
      expect(() => CreateProduct.of('Product', 10, null as any)).toThrow(new ValidationException('SKU is required.'));
      expect(() => CreateProduct.of('Product', 10, '   ')).toThrow(new ValidationException('SKU is required.'));
    });
  });
});
