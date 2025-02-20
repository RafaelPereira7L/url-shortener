import { EntitySchema } from 'typeorm';
import { User } from '@domain/entities/user.entity';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  columns: {
    id: {
      type: 'uuid',
      default: () => 'gen_random_uuid()',
      primary: true,
    },
    name: {
      type: 'varchar',
      nullable: false,
      length: 255,
    },
    email: {
      type: 'varchar',
      unique: true,
      nullable: false,
      length: 255,
    },
    password: {
      type: 'varchar',
      nullable: false,
      length: 255,
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      updateDate: true,
    },
  },
});