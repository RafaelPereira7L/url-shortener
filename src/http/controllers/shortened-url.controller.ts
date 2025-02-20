import { CreateShortenedUrlResponseDto } from '@application/dtos/shortened-url/create-shortened-url-response.dto';
import { CreateShortenedUrlDto } from '@application/dtos/shortened-url/create-shortened-url.dto';
import { CreateShortenedUrlUseCase } from '@application/use-cases/shortened-url/create-shortened-url.usecase';
import { JwtOptionalGuard } from '@infra/auth/auth.guard';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('shorten-url')
export class ShortUrlController {
  constructor(private readonly createShortenedUrlUseCase: CreateShortenedUrlUseCase) {}

  @Post()
  @UseGuards(JwtOptionalGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiBody({ type: CreateShortenedUrlDto })
  @ApiResponse({
    status: 201,
    description: 'Shortened URL created successfully',
    type: CreateShortenedUrlResponseDto,
  })
  async createShortenedUrl(@Body() createShortenedUrlDto: CreateShortenedUrlDto, @Request() req): Promise<CreateShortenedUrlResponseDto> {
    const userId = req.user?.userId;
    return await this.createShortenedUrlUseCase.execute(createShortenedUrlDto, userId);
  }
}
