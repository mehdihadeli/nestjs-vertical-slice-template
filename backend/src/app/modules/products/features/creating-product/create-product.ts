import type { IProductRepository } from '@app/modules/products/contracts/product-repository';
import { ProductsMapper } from '@app/modules/products/products.mapper';
import { PRODUCT_REPOSITORY_TOKEN } from '@app/modules/products/products.tokens';
import { Guard } from '@libs/core/validations/guard';
import { ConflictException, Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

export class CreateProduct implements ICommand {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly sku: string,
    public readonly description?: string | null,
  ) {}

  /**
   * Factory method to create a valid CreateProduct command.
   */
  static of(
    name: string | undefined,
    price: number | undefined,
    sku: string | undefined,
    description?: string,
  ): CreateProduct {
    const validatedName = Guard.notNullOrWhiteSpace(name, 'name', 'Product name is required.');
    const validatedPrice = Guard.notNegativeOrZero(price, 'price', 'Price must be greater than zero.');
    const validatedSku = Guard.notNullOrWhiteSpace(sku, 'sku', 'SKU is required.');

    return new CreateProduct(validatedName.trim(), validatedPrice, validatedSku.trim(), description);
  }
}

export class CreateProductResult {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly sku: string,
    public readonly description: string | null,
    public readonly createdAt: Date,
  ) {}
}

@CommandHandler(CreateProduct)
export class CreateProductHandler implements ICommandHandler<CreateProduct, CreateProductResult> {
  // will get the global internal logger instance that set by `app.useLogger()`
  private readonly logger = new Logger(CreateProductHandler.name);

  constructor(@Inject(PRODUCT_REPOSITORY_TOKEN) private readonly repository: IProductRepository) {}

  async execute(command: CreateProduct): Promise<CreateProductResult> {
    const { name, price, sku, description } = command;

    const existingBySku = await this.repository.findBySku(sku);
    if (existingBySku) {
      throw new ConflictException(`Product with SKU '${sku}' already exists.`);
    }

    const savedProduct = await this.repository.createProduct(name, price, sku, description);

    this.logger.log(`Created product ${savedProduct.id} with name '${name}'`);

    return ProductsMapper.productToCreateResult(savedProduct);
  }
}
