import { Product } from '@app/modules/products/entities/product.entity';

export interface IProductRepository {
  createProduct(name: string, price: number, sku: string, description?: string | null): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findAllActive(): Promise<Product[]>;
  softDeleteById(id: string): Promise<boolean>;
  updateProduct(id: string, name?: string, price?: number, description?: string): Promise<Product | null>;
  getByPageAndTotalCount(pageNumber: number, pageSize: number): Promise<{ items: Product[]; totalCount: number }>;
}
