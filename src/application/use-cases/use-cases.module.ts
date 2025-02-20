import { Module } from '@nestjs/common';
import { FindUserByEmailUseCase } from './user/find-user-by-email.usecase';
import { CreateUserUseCase } from './user/create-user.usecase';
import { SignInUseCase } from './auth/signin.usecase';
import { CreateShortenedUrlUseCase } from './shortened-url/create-shortened-url.usecase';
import { RepositoriesModule } from '../../infra/repositories.module';

@Module({
  imports: [RepositoriesModule],
  providers: [FindUserByEmailUseCase, CreateUserUseCase, SignInUseCase, CreateShortenedUrlUseCase],
  exports: [FindUserByEmailUseCase, CreateUserUseCase, SignInUseCase, CreateShortenedUrlUseCase],
})
export class UseCasesModule {}