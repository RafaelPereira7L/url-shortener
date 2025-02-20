import { Injectable } from "@nestjs/common";
import { ShortenedUrl } from "@domain/entities/shortened-url.entity";
import { CreateShortenedUrlDto } from "@application/dtos/shortened-url/create-shortened-url.dto";
import { CreateShortenedUrlResponseDto } from "@application/dtos/shortened-url/create-shortened-url-response.dto";
import { ConfigService } from "@nestjs/config";
import { ShortenedUrlRepository } from "@domain/repositories/shortened-url.repository";

@Injectable()
export class CreateShortenedUrlUseCase {
  constructor(
    private readonly configService: ConfigService, private readonly shortenedUrlRepository: ShortenedUrlRepository,
  ) { }

  async execute(createShortenedUrlDto: CreateShortenedUrlDto, userId: string | null): Promise<CreateShortenedUrlResponseDto> {
    const baseUrl = this.configService.get('BASE_URL');
    if (!baseUrl) {
      throw new Error('BASE_URL environment variable is not set');
    }
    const shortenedUrl = new ShortenedUrl(baseUrl);

    shortenedUrl.originalUrl = createShortenedUrlDto.originalUrl;
    shortenedUrl.userId = userId ?? null;
    
    return await this.shortenedUrlRepository.create(shortenedUrl);
  }
}