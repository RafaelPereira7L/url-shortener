import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ShortenedUrlRepository } from "@domain/repositories/shortened-url.repository";
import { ShortenedUrl } from "@domain/entities/shortened-url.entity";

@Injectable()
export class FindShortenedUrlUseCase {
  constructor(
    private readonly shortenedUrlRepository: ShortenedUrlRepository,
  ) { }

  async execute(url: string): Promise<ShortenedUrl> {
    if (!url) {
      throw new BadRequestException('Shortened URL is required');
    }

    const shortenedUrl = await this.shortenedUrlRepository.findByShortUrl(url);

    if (!shortenedUrl) {
      throw new NotFoundException('Shortened URL not found');
    }
    return shortenedUrl;
  }
}