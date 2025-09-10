import { IProductRepository } from '@app/modules/products/contracts/product-repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createProduct(name: string, price: number, sku: string, description?: string): Promise<Product> {
    const product: Product = new Product(name, price, sku, description);
    const saved = await this.productRepo.save(product);

    return saved;
  }

  async findById(id: string): Promise<Product | null> {
    return await this.productRepo.findOne({
      where: { id, isDeleted: false },
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return await this.productRepo.findOne({
      where: { sku, isDeleted: false },
    });
  }

  async findAllActive(): Promise<Product[]> {
    return await this.productRepo.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async softDeleteById(id: string): Promise<boolean> {
    // will handle by soft delete in `soft-delete-subscriber`
    const result = await this.productRepo.delete(id);
    return result.affected !== 0;
  }

  async updateProduct(id: string, name?: string, price?: number, description?: string): Promise<Product | null> {
    const product = await this.findById(id); // Reuses safe find
    if (!product) return null;

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;

    return await this.productRepo.save(product);
  }

  async getByPageAndTotalCount(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ items: Product[]; totalCount: number }> {
    const skip = (pageNumber - 1) * pageSize;

    const totalCount = await this.productRepo.count({
      where: { isDeleted: false },
    });

    const items = await this.productRepo.find({
      where: { isDeleted: false },
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { items, totalCount };
  }
}
