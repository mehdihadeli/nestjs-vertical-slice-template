// src/libs/core/entity/audit.subscriber.ts
import { AuditableEntity } from '@libs/core/entity/auditable-entity';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<any> {
  private fakeUserId = 'd8f7a3c9-4b21-4f8e-9c6a-1e5b3d7f2a0c';

  beforeInsert(event: InsertEvent<any>): void {
    const entity: AuditableEntity = event.entity;
    // Runtime type guard
    if (!entity && !this.isAuditableEntity(entity)) {
      throw new Error('AuditSubscriber received non-AuditableEntity object');
    }

    const now = new Date();
    entity.createdAt = now;
    entity.lastModifiedAt = now;
    entity.createdBy = this.fakeUserId;
    // TODO: Set "createdBy" from request context (e.g. CLS, tracing, etc)
    // entity.createdBy = getCurrentUserId();
  }

  beforeUpdate(event: UpdateEvent<AuditableEntity>): void {
    const entity = event.databaseEntity;
    if (!entity) return;
    entity.lastModifiedAt = new Date();
    entity.lastModifiedBy = this.fakeUserId;
    // TODO: Set "lastModifiedBy" from request context (e.g. CLS, tracing, etc)
    // entity.lastModifiedBy = getCurrentUserId();
    // The version increment is handled by TypeORM's @VersionColumn or entitySchema: { version: true }
  }

  private isAuditableEntity(obj: any): obj is AuditableEntity {
    return obj instanceof AuditableEntity;
  }
}
