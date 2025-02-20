import { BadRequestException, Injectable } from "@nestjs/common";
import { ShortenedUrlRepository } from "@domain/repositories/shortened-url.repository";
import { ListUserShortenedUrlsResponseDto } from "@application/dtos/shortened-url/list-user-shortened-urls-response.dto";

@Injectable()
export class ListUserShortenedUrlsUseCase {
  constructor(
    private readonly shortenedUrlRepository: ShortenedUrlRepository,
  ) { }

  async execute(userId: string | null): Promise<ListUserShortenedUrlsResponseDto> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return {
      shortenedUrls: await this.shortenedUrlRepository.findAllByUserId(userId),
    }
  }
}