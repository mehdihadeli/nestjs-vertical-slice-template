import { IProductRepository } from '@app/modules/products/contracts/product-repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createProduct(name: string, price: number, sku: string, description?: string): Promise<Product> {
    const product: Product = new Product(name, price, sku, description);

    return await this.productRepo.save(product);
  }

  async findById(id: string): Promise<Product | null> {
    return await this.productRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return await this.productRepo.findOne({
      where: { sku, deletedAt: IsNull() },
    });
  }

  async findAllActive(): Promise<Product[]> {
    return await this.productRepo.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async softDeleteById(id: string): Promise<boolean> {
    const result = await this.productRepo.delete(id);
    return result.affected !== 0;
  }

  async updateProduct(id: string, name?: string, price?: number, description?: string): Promise<Product | null> {
    const product = await this.findById(id);
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
      where: { deletedAt: IsNull() },
    });

    const items = await this.productRepo.find({
      where: { deletedAt: IsNull() },
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { items, totalCount };
  }

  async restoreById(id: string): Promise<boolean> {
    const result = await this.productRepo.update(id, { deletedAt: null });
    return result.affected !== 0;
  }
}
