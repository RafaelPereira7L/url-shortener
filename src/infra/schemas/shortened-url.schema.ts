import { ShortenedUrl } from '@domain/entities/shortened-url.entity';
import { EntitySchema } from 'typeorm';

export const ShortenedUrlSchema = new EntitySchema<ShortenedUrl>({
  name: 'ShortenedUrl',
  target: ShortenedUrl,
  columns: {
    id: {
      type: 'uuid',
      default: () => 'gen_random_uuid()',
      primary: true,
    },
    originalUrl: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    shortUrl: {
      type: 'varchar',
      length: 255,
      nullable: false,
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
    deletedAt: {
      type: 'timestamp',
      nullable: true,
      deleteDate: true,
    },
    userId: {
      type: 'uuid',
      nullable: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
      },
    },
    clicks: {
      type: 'one-to-many',
      target: 'Click',
      inverseSide: 'shortenedUrl',
      cascade: true,
    },
  },
});
