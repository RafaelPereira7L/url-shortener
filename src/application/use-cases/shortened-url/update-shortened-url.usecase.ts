import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ShortenedUrlRepository } from "@domain/repositories/shortened-url.repository";
import { UpdateShortenedUrlDto } from "@application/dtos/shortened-url/update-shortened-url.dto";
import { UpdateShortenedUrlResponseDto } from "@application/dtos/shortened-url/update-shortened-url-response.dto";

@Injectable()
export class UpdateUserShortenedUrlsUseCase {
  constructor(
    private readonly shortenedUrlRepository: ShortenedUrlRepository,
  ) { }

  async execute(shortenedUrlId: string, userId: string, updateShortenedUrlDto: UpdateShortenedUrlDto): Promise<UpdateShortenedUrlResponseDto> {
    if (!shortenedUrlId) {
      throw new BadRequestException('Shortened URL ID is required');
    }

    const shortenedUrl = await this.shortenedUrlRepository.findByShortUrlId(shortenedUrlId);
    if (!shortenedUrl) {
      throw new NotFoundException('Shortened URL not found');
    }

    if (shortenedUrl.userId !== userId) {
      throw new ForbiddenException('You are not authorized to update this shortened URL');
    }

    shortenedUrl.originalUrl = updateShortenedUrlDto.originalUrl;

    await this.shortenedUrlRepository.update(shortenedUrl);
    return shortenedUrl;
  }
}