import { ShortenedUrl } from '@domain/entities/shortened-url.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ListUserShortenedUrlsResponseDto {
  @ApiProperty({
    example: [
      {
        id: '1',
        originalUrl: 'https://example.com',
        shortUrl: 'http://localhost:3000/ABCDEF',
        createdAt: '2023-10-01T00:00:00.000Z',
        updatedAt: '2023-10-01T00:00:00.000Z',
        deletedAt: null,
        userId: '1',
      },
    ],
    description: 'List of shortened URLs',
  })
  shortenedUrls: ShortenedUrl[];
}
