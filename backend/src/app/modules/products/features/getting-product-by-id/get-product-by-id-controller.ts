import { ProductDto } from '@app/modules/products/dto/product-dto';
import {
  GetProductByIdQuery,
  GetProductByIdResult,
} from '@app/modules/products/features/getting-product-by-id/get-product-by-id';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

export class GetProductByIdResponseDto {
  @ApiProperty({ type: () => ProductDto, description: 'The requested product' })
  product: ProductDto;

  constructor(productDto: ProductDto) {
    this.product = productDto;
  }
}

@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class GetProductByIdController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieves a single product by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique product ID',
    example: 'prod_abc123',
    type: String,
  })
  @ApiOkResponse({
    type: GetProductByIdResponseDto,
    description: 'Successfully retrieved product',
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid ID format' })
  async getProductById(@Param('id') id: string): Promise<GetProductByIdResponseDto> {
    const query = GetProductByIdQuery.of(id);
    const result = await this.queryBus.execute<GetProductByIdQuery, GetProductByIdResult>(query);

    return new GetProductByIdResponseDto(result.product);
  }
}
