import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ShortenedUrlRepository } from "@domain/repositories/shortened-url.repository";

@Injectable()
export class SoftDeleteShortenedUrlUseCase {
  constructor(
    private readonly shortenedUrlRepository: ShortenedUrlRepository,
  ) { }

  async execute(shortenedUrlId: string, userId: string): Promise<boolean> {
    if (!shortenedUrlId) {
      throw new BadRequestException('Shortened URL ID is required');
    }

    const shortenedUrl = await this.shortenedUrlRepository.findByShortUrlId(shortenedUrlId);
    if (!shortenedUrl) {
      throw new NotFoundException('Shortened URL not found');
    }

    if (shortenedUrl.userId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this shortened URL');
    }

    return await this.shortenedUrlRepository.delete(shortenedUrlId);
  }
}