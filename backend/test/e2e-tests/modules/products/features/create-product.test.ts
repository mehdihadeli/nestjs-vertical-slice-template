import { IProductRepository } from '@app/modules/products/contracts/product-repository';
import { PRODUCT_REPOSITORY_TOKEN } from '@app/modules/products/products.tokens';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppSharedFixture } from '../../../../shared/app-shared-fixture';
import { FakeCreateProductRequestDto } from '../../../../shared/fakes/fake-create-product-request.dto';

const sharedFixture = new AppSharedFixture();
const logger = sharedFixture.getLogger();

describe('CreateProductController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    logger.log('Initializing CreateProductController e2e test...');
    await sharedFixture.initialize();
    app = sharedFixture.app!;
    await app.init();
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
    it('should create product and return 201 with product ID', async () => {
      // Arrange
      const dto = FakeCreateProductRequestDto.generate();

      // Act
      const response = await request(app.getHttpServer()).post('/api/v1/products').send(dto).expect(HttpStatus.CREATED);

      // Assert
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('productId');
      expect(response.body.productId).toMatch(/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i); // UUID format

      // Optional: verify product actually exists in DB
      const repo = sharedFixture.getHandler<IProductRepository>(PRODUCT_REPOSITORY_TOKEN);
      const saved = await repo.findBySku(dto.sku);
      expect(saved).toBeDefined();
      expect(saved!.name).toBe(dto.name);
      expect(parseFloat(saved!.price as any)).toBeCloseTo(dto.price, 2);
    });
  });

  describe('Given invalid name (empty)', () => {
    it('should return 400 Bad Request', async () => {
      // Arrange
      const dto = FakeCreateProductRequestDto.generate({ name: '' });

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/api/v1/products')
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);

      sharedFixture.assertProblemDetails(response.body, HttpStatus.BAD_REQUEST, 'Product name is required.');
    });
  });

  describe('Given invalid price (zero)', () => {
    it('should return 400 Bad Request', async () => {
      // Arrange
      const dto = FakeCreateProductRequestDto.generate({ price: 0 });

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/api/v1/products')
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);

      sharedFixture.assertProblemDetails(response.body, HttpStatus.BAD_REQUEST, 'Price must be greater than zero.');
    });
  });

  describe('Given invalid SKU (whitespace)', () => {
    it('should return 400 Bad Request', async () => {
      // Arrange
      const dto = FakeCreateProductRequestDto.generate({ sku: '   ' });

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/api/v1/products')
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);

      sharedFixture.assertProblemDetails(response.body, HttpStatus.BAD_REQUEST, 'SKU is required.');
    });
  });

  describe('Given missing required fields', () => {
    it('should return 400 Bad Request for missing name', async () => {
      const { name, ...dtoWithoutName } = FakeCreateProductRequestDto.generate();

      const response = await request(app.getHttpServer())
        .post('/api/v1/products')
        .send(dtoWithoutName)
        .expect(HttpStatus.BAD_REQUEST);

      sharedFixture.assertProblemDetails(response.body, HttpStatus.BAD_REQUEST, 'Product name is required.');
    });

    it('should return 400 Bad Request for missing price', async () => {
      const { price, ...dtoWithoutPrice } = FakeCreateProductRequestDto.generate();

      const response = await request(app.getHttpServer())
        .post('/api/v1/products')
        .send(dtoWithoutPrice)
        .expect(HttpStatus.BAD_REQUEST);

      sharedFixture.assertProblemDetails(response.body, HttpStatus.BAD_REQUEST, 'Price must be greater than zero.');
    });

    it('should return 400 Bad Request for missing SKU', async () => {
      const { sku, ...dtoWithoutSku } = FakeCreateProductRequestDto.generate();

      const response = await request(app.getHttpServer())
        .post('/api/v1/products')
        .send(dtoWithoutSku)
        .expect(HttpStatus.BAD_REQUEST);

      sharedFixture.assertProblemDetails(response.body, HttpStatus.BAD_REQUEST, 'SKU is required.');
    });
  });
});
