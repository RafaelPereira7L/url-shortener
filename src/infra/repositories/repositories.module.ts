import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from '@infra/schemas/user.schema';
import { UserRepositoryImpl } from './user-repository.impl';
import { ShortenedUrlSchema } from '@infra/schemas/shortened-url.schema';
import { ShortenedUrlRepositoryImpl } from './shortened-url-repository.impl';
import { ShortenedUrlRepository } from '@domain/repositories/shortened-url.repository';
import { UserRepository } from '@domain/repositories/user.repository';
import { ClickRepository } from '@domain/repositories/click.repository';
import { ClickRepositoryImpl } from './click-repository.impl';
import { ClickSchema } from '@infra/schemas/click.schema';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema, ShortenedUrlSchema, ClickSchema]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: ShortenedUrlRepository,
      useClass: ShortenedUrlRepositoryImpl,
    },
    {
      provide: ClickRepository,
      useClass: ClickRepositoryImpl,
    },
  ],
  exports: [UserRepository, ShortenedUrlRepository, ClickRepository],
})
export class RepositoriesModule {}
