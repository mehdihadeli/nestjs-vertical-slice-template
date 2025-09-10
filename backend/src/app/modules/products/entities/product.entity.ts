import { AuditableSoftDeleteEntity } from '@libs/core/entity/auditable-entity';

export class Product extends AuditableSoftDeleteEntity {
  name: string;
  description?: string | null;
  price: number;
  sku: string;

  constructor(name: string, price: number, sku: string, description?: string | null) {
    super();
    this.name = name;
    this.price = price;
    this.sku = sku;
    this.description = description ?? null;
  }
}
