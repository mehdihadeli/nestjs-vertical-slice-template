// src/libs/core/entity/audit.subscriber.ts
import { AuditableEntity, AuditableSoftDeleteEntity } from '@libs/core/entity/auditable-entity';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<AuditableEntity<any>> {
  listenTo(): typeof AuditableEntity {
    return AuditableEntity;
  }

  beforeInsert(event: InsertEvent<AuditableEntity<any>>): void {
    const entity = event.entity;
    if (!entity) return;
    const now = new Date();
    entity.createdAt = now;
    entity.lastModifiedAt = now;
    entity.version = 1;
    // TODO: Set "createdBy" from request context (e.g. CLS, tracing, etc)
    // entity.createdBy = getCurrentUserId();
  }

  beforeUpdate(event: UpdateEvent<AuditableEntity<any>>): void {
    const entity = event.entity;
    if (!entity) return;
    entity.lastModifiedAt = new Date();
    // TODO: Set "lastModifiedBy" from request context (e.g. CLS, tracing, etc)
    // entity.lastModifiedBy = getCurrentUserId();
    // The version increment is handled by TypeORM's @VersionColumn or entitySchema: { version: true }
  }
}
