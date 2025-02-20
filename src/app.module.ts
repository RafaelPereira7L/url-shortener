import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './http/controllers/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { SignInController } from '@http/controllers/signin.controller';
import { ShortUrlController } from '@http/controllers/shortened-url.controller';
import { RepositoriesModule } from './infra/repositories.module';
import { UseCasesModule } from './application/use-cases/use-cases.module';

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
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    RepositoriesModule,
    UseCasesModule,
  ],
  controllers: [UserController, SignInController, ShortUrlController],
  providers: [],
})
export class AppModule { }
