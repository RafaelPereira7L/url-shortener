import { SignInDto } from '@application/dtos/user/signin.dto';
import { SignInUseCase } from '@application/use-cases/auth/signin.usecase';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('sign-in')
export class SignInController {
  constructor(private readonly signInUseCase: SignInUseCase) { }

  @Post()
  async auth(@Body() credentials: SignInDto): Promise<{access_token:string}> { 
    return await this.signInUseCase.execute(credentials);
  }
}
