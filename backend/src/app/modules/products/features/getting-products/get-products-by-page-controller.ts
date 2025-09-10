import { ProductDto } from '@app/modules/products/dto/product-dto';
import {
  GetProductsByPageQuery,
  GetProductsByPageResult,
} from '@app/modules/products/features/getting-products/get-products-by-page';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

export class GetProductsByPageResponseDto {
  @ApiProperty({ type: [ProductDto], description: 'List of products on current page' })
  products: ProductDto[];

  @ApiProperty({ example: 5, description: 'Number of items per page' })
  pageSize: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  pageCount: number;

  @ApiProperty({ example: 47, description: 'Total number of products available' })
  totalCount: number;

  constructor(result: GetProductsByPageResult) {
    this.products = result.products;
    this.pageSize = result.pageSize;
    this.pageCount = result.pageCount;
    this.totalCount = result.totalCount;
  }
}

@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class GetProductsByPageController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({
    summary: 'Get products by page',
    description:
      'Fetches a paginated list of products. Includes product details like ID, name, price, SKU, and creation date.',
  })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 5 })
  @ApiOkResponse({
    type: GetProductsByPageResponseDto,
    description: 'Successfully retrieved paginated products',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid pagination parameters' })
  async getProductsByPage(
    @Query('pageNumber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 5,
  ): Promise<GetProductsByPageResponseDto> {
    const query = GetProductsByPageQuery.of(pageNumber, pageSize);
    const result = await this.queryBus.execute<GetProductsByPageQuery, GetProductsByPageResult>(query);

    return new GetProductsByPageResponseDto(result);
  }
}
