import { Click } from '@domain/entities/click.entity';
import { EntitySchema } from 'typeorm';

export const ClickSchema = new EntitySchema<Click>({
  name: 'Click',
  target: Click,
  columns: {
    id: {
      type: 'uuid',
      default: () => 'gen_random_uuid()',
      primary: true,
    },
    shortenedUrlId: {
      type: 'uuid',
      nullable: false,
    },
    accessedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      createDate: true,
    },
    userAgent: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
  },
  relations: {
    shortenedUrl: {
      type: 'many-to-one',
      target: 'ShortenedUrl',
      joinColumn: {
        name: 'shortenedUrlId',
        referencedColumnName: 'id',
      },
      inverseSide: 'clicks',
    },
  },
});