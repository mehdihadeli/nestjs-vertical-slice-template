import { ISoftDelete } from '@libs/core/entity/entity';
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';

@EventSubscriber()
export class SoftDeleteSubscriber implements EntitySubscriberInterface<ISoftDelete> {
  listenTo(): ObjectConstructor {
    return Object;
  }

  beforeRemove(event: RemoveEvent<ISoftDelete>): void {
    const entity = event.entity;
    if (entity && 'isDeleted' in entity && 'deletedAt' in entity) {
      // Instead of removing: soft-delete!
      entity.isDeleted = true;
      entity.deletedAt = new Date();
    }
  }
}
