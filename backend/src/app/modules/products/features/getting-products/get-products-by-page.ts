import type { IProductRepository } from '@app/modules/products/contracts/product-repository';
import { ProductDto } from '@app/modules/products/dto/product-dto';
import { ProductsMapper } from '@app/modules/products/products.mapper';
import { PRODUCT_REPOSITORY_TOKEN } from '@app/modules/products/products.tokens';
import { Guard } from '@libs/core/validations/guard';
import { Inject, Logger } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetProductsByPageQuery implements IQuery {
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number,
  ) {}

  static of(pageNumber: number = 1, pageSize: number = 5): GetProductsByPageQuery {
    const validatedPageNumber = Guard.notNegativeOrZero(pageNumber, 'pageNumber', 'Page number must be at least 1.');
    const validatedPageSize = Guard.notNegativeOrZero(pageSize, 'pageSize', 'Page size must be at least 1.');

    return new GetProductsByPageQuery(validatedPageNumber, validatedPageSize);
  }
}
export class GetProductsByPageResult {
  constructor(
    public readonly products: ProductDto[],
    public readonly pageSize: number,
    public readonly pageCount: number,
    public readonly totalCount: number,
  ) {}
}

@QueryHandler(GetProductsByPageQuery)
export class GetProductsByPageHandler implements IQueryHandler<GetProductsByPageQuery, GetProductsByPageResult> {
  private readonly logger = new Logger(GetProductsByPageHandler.name);

  constructor(@Inject(PRODUCT_REPOSITORY_TOKEN) private readonly repository: IProductRepository) {}

  async execute(query: GetProductsByPageQuery): Promise<GetProductsByPageResult> {
    const { pageNumber, pageSize } = query;

    const { items: products, totalCount } = await this.repository.getByPageAndTotalCount(pageNumber, pageSize);

    const pageCount = Math.ceil(totalCount / pageSize);

    const productDtos = products.map(p => ProductsMapper.productToProductDto(p));

    this.logger.debug(`Fetched page ${pageNumber} of ${pageCount} (total: ${totalCount} products)`);

    return new GetProductsByPageResult(productDtos, pageSize, pageCount, totalCount);
  }
}
