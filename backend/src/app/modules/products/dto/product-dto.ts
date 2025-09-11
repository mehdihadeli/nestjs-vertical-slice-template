import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 'prod_123', description: 'Unique product ID' })
  id: string;

  @ApiProperty({ example: 'Organic Avocado', description: 'Name of the product' })
  name: string;

  @ApiProperty({ example: 2.99, description: 'Price in USD' })
  price: number;

  @ApiProperty({ example: 'AVO-ORG-001', description: 'Stock Keeping Unit' })
  sku: string;

  @ApiPropertyOptional({ example: 'Fresh from California', description: 'Optional description' })
  description?: string | null;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Creation date' })
  createdAt: Date;

  constructor(id: string, name: string, price: number, sku: string, createdAt: Date, description?: string | null) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.sku = sku;
    this.createdAt = createdAt;
    this.description = description ?? null;
  }
}
