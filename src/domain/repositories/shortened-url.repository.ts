import { ShortenedUrl } from '@domain/entities/shortened-url.entity';

export abstract class ShortenedUrlRepository {
  abstract findByShortUrlId(id: string): Promise<ShortenedUrl | null>;
  abstract findAllByUserId(userId: string): Promise<ShortenedUrl[]>;
  abstract findByShortUrl(shortUrl: string): Promise<ShortenedUrl | null>;
  abstract findByOriginalUrl(originalUrl: string): Promise<ShortenedUrl | null>;
  abstract create(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl>;
  abstract update(shortenedUrl: ShortenedUrl): Promise<boolean>;
  abstract delete(shortenedUrlId: string): Promise<boolean>;
}
