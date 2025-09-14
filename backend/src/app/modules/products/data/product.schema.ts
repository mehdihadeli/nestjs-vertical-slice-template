import { EntitySchema } from 'typeorm';

import { Product } from '../entities/product.entity';

export const ProductSchema = new EntitySchema<Product>({
  name: 'Product',
  tableName: 'products',
  target: Product,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      name: 'id',
    },
    name: {
      type: String,
      length: 100,
      nullable: false,
    },
    description: {
      type: String,
      length: 10000,
      nullable: true,
    },
    price: {
      type: 'decimal',
      precision: 12,
      scale: 2,
      nullable: false,
      default: 0,
    },
    sku: {
      type: String,
      length: 50,
      nullable: false,
      unique: true,
    },
    // Audit fields
    createdAt: {
      type: Date,
      createDate: true,
      nullable: false,
      name: 'created_at',
    },
    createdBy: {
      type: 'uuid',
      nullable: false,
      name: 'created_by',
    },
    lastModifiedAt: {
      type: Date,
      updateDate: true,
      nullable: true,
      name: 'last_modified_at',
    },
    lastModifiedBy: {
      type: 'uuid',
      nullable: true,
      name: 'last_modified_by',
    },
    // Concurrency/version using `version:true`
    version: {
      type: 'integer',
      nullable: false,
      default: 1,
      version: true,
    },
    // Soft-delete
    deletedAt: {
      type: Date,
      nullable: true,
      name: 'deleted_at',
      // https://tripss.github.io/nestjs-query/docs/persistence/typeorm/soft-delete/
      // handling soft delete
      deleteDate: true,
    },
  },
});
