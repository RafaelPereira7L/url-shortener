import { BadRequestException, Injectable } from "@nestjs/common";
import { ShortenedUrlRepository } from "@domain/repositories/shortened-url.repository";
import { ShortenedUrlWithClicksDto } from "@application/dtos/shortened-url/shortened-url-with-clicks.dto";

@Injectable()
export class ListUserShortenedUrlsUseCase {
  constructor(
    private readonly shortenedUrlRepository: ShortenedUrlRepository,
  ) { }

  async execute(userId: string | null): Promise<ShortenedUrlWithClicksDto[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.shortenedUrlRepository.findAllByUserId(userId);
  }
}