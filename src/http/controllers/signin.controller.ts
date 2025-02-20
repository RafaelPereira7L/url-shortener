import { SignInResponseDto } from '@application/dtos/sign-in/signin-response.dto';
import { SignInDto } from '@application/dtos/sign-in/signin.dto';
import { SignInUseCase } from '@application/use-cases/auth/signin.usecase';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('sign-in')
export class SignInController {
  constructor(private readonly signInUseCase: SignInUseCase) { }

  @Post()
  @ApiOperation({ summary: 'Authenticate user and generate access token' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully',
    type: SignInResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async auth(@Body() credentials: SignInDto): Promise<SignInResponseDto> { 
    return await this.signInUseCase.execute(credentials);
  }
}
