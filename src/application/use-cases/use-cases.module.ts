import { Module } from '@nestjs/common';
import { FindUserByEmailUseCase } from './user/find-user-by-email.usecase';
import { CreateUserUseCase } from './user/create-user.usecase';
import { SignInUseCase } from './auth/signin.usecase';
import { CreateShortenedUrlUseCase } from './shortened-url/create-shortened-url.usecase';
import { RepositoriesModule } from '@infra/repositories/repositories.module';
import { AuthModule } from '@infra/auth/auth.module';

@Module({
  imports: [RepositoriesModule, AuthModule],
  providers: [FindUserByEmailUseCase, CreateUserUseCase, SignInUseCase, CreateShortenedUrlUseCase],
  exports: [FindUserByEmailUseCase, CreateUserUseCase, SignInUseCase, CreateShortenedUrlUseCase],
})
export class UseCasesModule {}