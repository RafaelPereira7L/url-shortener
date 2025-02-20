import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from '@infra/schemas/user.schema';
import { UserRepositoryImpl } from './repositories/user-repository.impl';
import { ShortenedUrlSchema } from '@infra/schemas/shortened-url.schema';
import { ShortenedUrlRepositoryImpl } from './repositories/shortened-url-repository.impl';
import { ShortenedUrlRepository } from '@domain/repositories/shortened-url.repository';
import { UserRepository } from '@domain/repositories/user.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema, ShortenedUrlSchema]),
  ],
  providers: [{
    provide: UserRepository,
    useClass: UserRepositoryImpl,
  }, {
    provide: ShortenedUrlRepository,
    useClass: ShortenedUrlRepositoryImpl,
  }],
  exports: [UserRepository, ShortenedUrlRepository],
})
export class RepositoriesModule {}