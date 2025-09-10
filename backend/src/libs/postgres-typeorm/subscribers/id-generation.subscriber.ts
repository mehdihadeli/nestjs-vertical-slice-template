import { Entity } from '@libs/core/entity/entity';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

/**
 * Automatically generates UUIDv7 for entities before insert
 * if their `id` property is not set.
 */
@EventSubscriber()
export class IdGenerationSubscriber implements EntitySubscriberInterface<any> {
  beforeInsert(event: InsertEvent<any>): void {
    const entity: Entity = event.entity;

    // Runtime type guard
    if (!entity && !this.isEntity(entity)) {
      throw new Error('IdGenerationSubscriber received non-Entity object');
    }

    if (entity.id) return;
    entity.id = uuidv7();
  }

  private isEntity(obj: any): obj is Entity {
    return obj instanceof Entity;
  }
}
