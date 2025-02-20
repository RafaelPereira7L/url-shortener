import { CreateShortenedUrlResponseDto } from '@application/dtos/shortened-url/create-shortened-url-response.dto';
import { CreateShortenedUrlDto } from '@application/dtos/shortened-url/create-shortened-url.dto';
import { CreateShortenedUrlUseCase } from '@application/use-cases/shortened-url/create-shortened-url.usecase';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('short-url')
export class ShortUrlController {
  constructor(private readonly createShortenedUrlUseCase: CreateShortenedUrlUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiBody({ type: CreateShortenedUrlDto })
  @ApiResponse({
    status: 201,
    description: 'Shortened URL created successfully',
    type: CreateShortenedUrlResponseDto,
  })
  async createShortenedUrl(@Body() createShortenedUrlDto: CreateShortenedUrlDto): Promise<CreateShortenedUrlResponseDto> {
    return await this.createShortenedUrlUseCase.execute(createShortenedUrlDto);
  }
}
