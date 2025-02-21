import { ShortenedUrl } from '@domain/entities/shortened-url.entity';
import { ShortenedUrlRepository } from '@domain/repositories/shortened-url.repository';
import { randomUUID } from 'crypto';

export class InMemoryShortenedUrlRepository implements ShortenedUrlRepository {
  private shortenedUrls: ShortenedUrl[] = [];

  async findAllByUserId(userId: string): Promise<ShortenedUrl[]> {
    return this.shortenedUrls.filter((shortenedUrl) => shortenedUrl.userId === userId);
  }

  async findByShortUrl(shortUrl: string): Promise<ShortenedUrl | null> {
    return this.shortenedUrls.find((shortenedUrl) => shortenedUrl.shortUrl === shortUrl) || null;
  }

  async findByOriginalUrl(originalUrl: string): Promise<ShortenedUrl | null> {
    return this.shortenedUrls.find((shortenedUrl) => shortenedUrl.originalUrl === originalUrl) || null;
  }

  async findByShortUrlId(id: string): Promise<ShortenedUrl | null> {
    return this.shortenedUrls.find((shortenedUrl) => shortenedUrl.id === id) || null;
  }

  async create(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl> {
    shortenedUrl.id = randomUUID();
    shortenedUrl.clicksCount = 0;

    this.shortenedUrls.push(shortenedUrl);
    return shortenedUrl;
  }

  async update(shortenedUrl: ShortenedUrl): Promise<boolean> {
    const index = this.shortenedUrls.findIndex((u) => u.id === shortenedUrl.id);
    if (index === -1) {
      throw new Error('ShortenedUrl not found');
    }
    this.shortenedUrls[index] = shortenedUrl;
    
    return true;
  }

  async delete(shortenedUrlId: string): Promise<boolean> {
    const index = this.shortenedUrls.findIndex((u) => u.id === shortenedUrlId);
    if (index === -1) {
      throw new Error('ShortenedUrl not found');
    }

    this.shortenedUrls[index].deletedAt = new Date();

    return true;
  }

}