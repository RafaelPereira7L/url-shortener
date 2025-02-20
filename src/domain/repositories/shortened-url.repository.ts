import { ShortenedUrl } from "@domain/entities/shortened-url.entity";

export interface ShortenedUrlRepository {
  findAll(userId: string): Promise<ShortenedUrl[]>;
  findByShortUrl(shortUrl: string): Promise<ShortenedUrl | null>;
  findByOriginalUrl(originalUrl: string): Promise<ShortenedUrl | null>;
  create(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl>;
  update(shortenedUrl: ShortenedUrl): Promise<boolean>;
  delete(shortenedUrlId: string): Promise<boolean>;
}