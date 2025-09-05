import { AuditableSoftDeleteEntity } from '@libs/core/entity/auditable-entity';

export class Product extends AuditableSoftDeleteEntity {
  name: string;
  description?: string;
  price: number;
  sku: string;
}
