import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserSchema } from '@infra/schemas/user.schema';
import { UserController } from './http/controllers/user.controller';
import { FindUserByEmailUseCase } from '@application/use-cases/user/find-user-by-email.usecase';
import { UserRepositoryImpl } from '@infra/repositories/user-repository.impl';
import { CreateUserUseCase } from '@application/use-cases/user/create-user.usecase';
import { JwtModule } from '@nestjs/jwt';
import { SignInController } from '@http/controllers/signin.controller';
import { SignInUseCase } from '@application/use-cases/auth/signin.usecase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([UserSchema]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UserController, SignInController],
  providers: [FindUserByEmailUseCase, CreateUserUseCase, SignInUseCase, UserRepositoryImpl],
})
export class AppModule { }
