import { CreateShortenedUrlResponseDto } from '@application/dtos/shortened-url/create-shortened-url-response.dto';
import { CreateShortenedUrlDto } from '@application/dtos/shortened-url/create-shortened-url.dto';
import { ShortenedUrlWithClicksDto } from '@application/dtos/shortened-url/shortened-url-with-clicks.dto';
import { UpdateShortenedUrlResponseDto } from '@application/dtos/shortened-url/update-shortened-url-response.dto';
import { UpdateShortenedUrlDto } from '@application/dtos/shortened-url/update-shortened-url.dto';
import { CreateShortenedUrlUseCase } from '@application/use-cases/shortened-url/create-shortened-url.usecase';
import { ListUserShortenedUrlsUseCase } from '@application/use-cases/shortened-url/list-user-shortened-urls.usecase';
import { SoftDeleteShortenedUrlUseCase } from '@application/use-cases/shortened-url/soft-delete-shortened-url.usecase';
import { UpdateUserShortenedUrlsUseCase } from '@application/use-cases/shortened-url/update-shortened-url.usecase';
import { JwtAuthGuard, JwtOptionalGuard } from '@infra/auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('shorten-url')
export class ShortUrlController {
  constructor(
    private readonly listShortenedUrlsUseCase: ListUserShortenedUrlsUseCase,
    private readonly createShortenedUrlUseCase: CreateShortenedUrlUseCase,
    private readonly updateShortenedUrlUseCase: UpdateUserShortenedUrlsUseCase,
    private readonly softDeleteShortenedUrlUseCase: SoftDeleteShortenedUrlUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List all shortened URLs for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of shortened URLs',
    type: ShortenedUrlWithClicksDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async listShortenedUrls(
    @Request() req,
  ): Promise<ShortenedUrlWithClicksDto[]> {
    return await this.listShortenedUrlsUseCase.execute(req.user?.userId);
  }

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
  async createShortenedUrl(
    @Body() createShortenedUrlDto: CreateShortenedUrlDto,
    @Request() req,
  ): Promise<CreateShortenedUrlResponseDto> {
    const userId = req.user?.userId;
    return await this.createShortenedUrlUseCase.execute(
      createShortenedUrlDto,
      userId,
    );
  }

  @Patch(':shortUrlId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update a shortened URL' })
  @ApiBody({ type: UpdateShortenedUrlDto })
  @ApiResponse({
    status: 200,
    description: 'Shortened URL updated successfully',
    type: CreateShortenedUrlResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not authorized to update this shortened URL',
  })
  @ApiResponse({
    status: 404,
    description: 'Shortened URL not found',
  })
  async updateShortenedUrl(
    @Param('shortUrlId') shortUrlId: string,
    @Body() updateShortenedUrlDto: UpdateShortenedUrlDto,
    @Request() req,
  ): Promise<UpdateShortenedUrlResponseDto> {
    const userId = req.user?.userId;
    return await this.updateShortenedUrlUseCase.execute(
      shortUrlId,
      userId,
      updateShortenedUrlDto,
    );
  }

  @Delete(':shortUrlId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete a shortened URL' })
  @ApiResponse({
    status: 204,
    description: 'Shortened URL deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not authorized to delete this shortened URL',
  })
  @ApiResponse({
    status: 404,
    description: 'Shortened URL not found',
  })
  async softDeleteShortenedUrl(
    @Param('shortUrlId') shortUrlId: string,
    @Request() req,
  ): Promise<void> {
    const userId = req.user?.userId;
    await this.softDeleteShortenedUrlUseCase.execute(shortUrlId, userId);
  }
}
