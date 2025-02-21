import { ShortenedUrl } from './shortened-url.entity';

export class Click {
  id: string;
  shortenedUrlId: string;
  accessedAt: Date;
  userAgent?: string;
  shortenedUrl: ShortenedUrl;
}
