import { RegisterClickUseCase } from '@application/use-cases/click/register-click.usecase';
import { FindShortenedUrlUseCase } from '@application/use-cases/shortened-url/find-shortened-url.usecase';
import { Controller, Get, Request, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@Controller()
export class RedirectController {
  constructor(
    private readonly registerClickUseCase: RegisterClickUseCase,
    private readonly findShortenedUrlUseCase: FindShortenedUrlUseCase,
  ) {}

  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiParam({ name: 'code', description: 'The shortened URL code' })
  @ApiResponse({ status: 200, description: 'Redirects to the original URL' })
  @ApiResponse({ status: 404, description: 'Shortened URL not found' })
  @Get(':code')
  async redirect(@Request() req, @Res() res: Response): Promise<void> {
    const userAgent = req.headers['user-agent'];
    const protocol = req.protocol;
    const host = req.get('host');
    const originalUrl = req.originalUrl;

    const fullUrl = `${protocol}://${host}${originalUrl}`;

    const shortenedUrl = await this.findShortenedUrlUseCase.execute(fullUrl);
    await this.registerClickUseCase.execute(shortenedUrl.shortUrl, userAgent);

    return res.redirect(shortenedUrl.originalUrl);
  }
}
