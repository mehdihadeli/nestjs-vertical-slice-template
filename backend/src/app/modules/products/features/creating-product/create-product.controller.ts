import { CreateProduct, CreateProductResult } from '@app/modules/products/features/creating-product/create-product';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiProperty, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';

export class CreateProductRequestDto {
  @ApiProperty({
    description: 'Name of the food product (e.g. dish, ingredient, or packaged item)',
    example: 'Organic Avocado',
    minLength: 1,
    maxLength: 255,
  })
  readonly name: string;

  @ApiProperty({
    description: 'Price of the food item in USD',
    example: 2.99,
    minimum: 0.01,
    type: Number,
    format: 'decimal',
  })
  readonly price: number;

  @ApiProperty({
    description: 'Unique Stock Keeping Unit (SKU) for tracking inventory',
    example: 'AVO-ORG-001',
    minLength: 1,
    maxLength: 100,
  })
  readonly sku: string;

  @ApiPropertyOptional({
    description: 'Optional description of the food product (e.g. origin, organic status, allergens)',
    example: 'Fresh organic avocado from California. Contains no additives.',
    nullable: true,
    maxLength: 1000,
  })
  readonly description?: string;
}

export class CreateProductResponseDto {
  constructor(public readonly productId: string) {}
}

@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class CreateProductController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create product', description: 'Creates a new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    type: CreateProductRequestDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async create(@Body() dto: CreateProductRequestDto): Promise<CreateProductResponseDto> {
    const command = CreateProduct.of(dto.name, dto.price, dto.sku, dto.description);
    const result = await this.commandBus.execute<CreateProduct, CreateProductResult>(command);

    return new CreateProductResponseDto(result.id);
  }
}
