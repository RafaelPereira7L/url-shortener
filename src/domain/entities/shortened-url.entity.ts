import { Click } from './click.entity';
import { User } from './user.entity';

export class ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  userId: string | null;
  user: User | null;
  clicksCount: number;
  clicks: Click[];

  constructor(baseUrl: string) {
    this.shortUrl = this.generateShortUrl(baseUrl);
  }

  private generateShortCode(): string {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charsLength = chars.length;
    const codeLength = 6;
    let result = '';

    const randomValues = new Uint32Array(codeLength);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < codeLength; i++) {
      result += chars[randomValues[i] % charsLength];
    }

    return result;
  }

  public generateShortUrl(baseUrl: string): string {
    return `${baseUrl}/${this.generateShortCode()}`;
  }
}
