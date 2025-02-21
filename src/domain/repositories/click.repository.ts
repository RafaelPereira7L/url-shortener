import { Click } from '@domain/entities/click.entity';

export abstract class ClickRepository {
  abstract create(click: Click): Promise<Click>;
  abstract findByShortenedUrl(shortenedUrlId: string): Promise<Click[]>;
  abstract countByShortenedUrl(shortenedUrlId: string): Promise<number>;
}
