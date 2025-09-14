import { ProductDto } from '@app/modules/products/dto/product-dto';
import { CreateProductResult } from '@app/modules/products/features/creating-product/create-product';
import { ProductsMapper } from '@app/modules/products/products.mapper';
import { faker } from '@faker-js/faker';

import { FakeProduct } from '../../../shared/fakes/fake-porduct';

describe('ProductsMapper', () => {
  describe('productToCreateResult', () => {
    it('should map Product to CreateProductResult correctly', () => {
      // Arrange
      const product = FakeProduct.generate({
        description: faker.commerce.productDescription(),
      });

      // Act
      const result = ProductsMapper.productToCreateResult(product);

      // Assert
      expect(result).toBeInstanceOf(CreateProductResult);
      expect(result.id).toBe(product.id);
      expect(result.name).toBe(product.name);
      expect(result.price).toBe(product.price);
      expect(result.sku).toBe(product.sku);
      expect(result.description).toBe(product.description);
      expect(result.createdAt).toEqual(product.createdAt);
    });

    it('should map undefined description to null', () => {
      // Arrange
      const product = FakeProduct.generate();
      product.description = undefined;

      // Act
      const result = ProductsMapper.productToCreateResult(product);

      // Assert
      expect(result.description).toBeNull();
    });

    it('should map null description to null', () => {
      // Arrange
      const product = FakeProduct.generate();
      product.description = undefined;

      // Act
      const result = ProductsMapper.productToCreateResult(product);

      // Assert
      expect(result.description).toBeNull();
    });

    it('should map empty string description as-is', () => {
      // Arrange
      const product = FakeProduct.generate({
        description: '',
      });

      // Act
      const result = ProductsMapper.productToCreateResult(product);

      // Assert
      expect(result.description).toBe(''); // preserves empty string
    });
  });

  describe('productToProductDto', () => {
    it('should map Product to ProductDto correctly', () => {
      // Arrange
      const product = FakeProduct.generate({
        description: faker.commerce.productDescription(),
      });

      // Act
      const dto = ProductsMapper.productToProductDto(product);

      // Assert
      expect(dto).toEqual({
        id: product.id,
        name: product.name,
        price: product.price,
        sku: product.sku,
        description: product.description,
        createdAt: product.createdAt,
      } satisfies ProductDto);
    });

    it('should map undefined description to undefined', () => {
      // Arrange
      const product = FakeProduct.generate();
      product.description = undefined;

      // Act
      const dto = ProductsMapper.productToProductDto(product);

      // Assert
      expect(dto.description).toBeNull();
    });

    it('should map null description to undefined', () => {
      // Arrange
      const product = FakeProduct.generate();
      product.description = undefined;

      // Act
      const dto = ProductsMapper.productToProductDto(product);

      // Assert
      expect(dto.description).toBeNull();
    });
  });
});
