import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class CreateShortenedUrlDto {
  @ApiProperty()
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  @MaxLength(255)
  originalUrl: string;
}
