import { Entity } from '@libs/core/entity/entity';
import { ISoftDelete } from '@libs/core/entity/soft-delete';

export abstract class AuditableEntity<TId = string> extends Entity<TId> {
  createdAt: Date;
  createdBy: TId;
  lastModifiedAt?: Date;
  lastModifiedBy?: TId;
  version: number;
}

export abstract class AuditableSoftDeleteEntity<TId = string> extends AuditableEntity<TId> implements ISoftDelete {
  deletedAt: Date;
  isDeleted: boolean;
}
