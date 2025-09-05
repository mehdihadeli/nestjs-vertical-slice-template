export abstract class Entity<TId = string> {
  id: TId;
}

export interface ISoftDelete {
  isDeleted: boolean;
  deletedAt?: Date;
}
