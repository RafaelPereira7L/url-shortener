import { ApiProperty } from '@nestjs/swagger';

export class CreateShortenedUrlResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the shortened URL' })
  id: string;

  @ApiProperty({
    example: 'https://example.com',
    description: 'The original URL',
  })
  originalUrl: string;

  @ApiProperty({
    example: 'http://localhost:3000/ABCDEF',
    description:
      'The short URL for the original URL with a random 6 character code',
  })
  shortUrl: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The date the shortened URL was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The date the shortened URL was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The date the shortened URL was deleted',
  })
  deletedAt: Date | null;

  @ApiProperty({
    example: '1',
    description: 'The ID of the user who created the shortened URL',
  })
  userId: string | null;
}
