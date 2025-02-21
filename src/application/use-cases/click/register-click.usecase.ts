import { Click } from "@domain/entities/click.entity";
import { ClickRepository } from "@domain/repositories/click.repository";
import { ShortenedUrlRepository } from "@domain/repositories/shortened-url.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RegisterClickUseCase {
  constructor(private readonly clickRepository: ClickRepository, private readonly shortenedUrlRepository: ShortenedUrlRepository) { }

  async execute(url: string, userAgent?: string): Promise<void> {
    const shortenedUrl = await this.shortenedUrlRepository.findByShortUrl(url);
    if (!shortenedUrl) {
      throw new Error('Shortened URL not found');
    }

    const click = new Click();
    click.shortenedUrl = shortenedUrl;
    click.userAgent = userAgent;

    await this.clickRepository.create(click);
  }
}