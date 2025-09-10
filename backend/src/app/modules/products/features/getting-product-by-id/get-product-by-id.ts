import type { IProductRepository } from '@app/modules/products/contracts/product-repository';
import { ProductDto } from '@app/modules/products/dto/product-dto';
import { ProductsMapper } from '@app/modules/products/products.mapper';
import { PRODUCT_REPOSITORY_TOKEN } from '@app/modules/products/products.tokens';
import { Guard } from '@libs/core/validations/guard';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetProductByIdQuery implements IQuery {
  constructor(public readonly id: string) {}

  static of(id: string | undefined): GetProductByIdQuery {
    const validatedId = Guard.notNullOrWhiteSpace(id, 'id', 'Product ID is required.');
    return new GetProductByIdQuery(validatedId.trim());
  }
}

export class GetProductByIdResult {
  constructor(public readonly product: ProductDto) {}
}

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery, GetProductByIdResult> {
  private readonly logger = new Logger(GetProductByIdHandler.name);

  constructor(@Inject(PRODUCT_REPOSITORY_TOKEN) private readonly repository: IProductRepository) {}

  async execute(query: GetProductByIdQuery): Promise<GetProductByIdResult> {
    const { id } = query;

    const product = await this.repository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found.`);
    }

    this.logger.log(`Fetched product ${product.id} - ${product.name}`);

    return new GetProductByIdResult(ProductsMapper.productToProductDto(product));
  }
}
