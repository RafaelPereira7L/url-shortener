import { CreateUserResponseDto } from '@application/dtos/user/create-user-response.dto';
import { CreateUserDto } from '@application/dtos/user/create-user.dto';
import { CreateUserUseCase } from '@application/use-cases/user/create-user.usecase';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) { }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async createUser(@Body() user: CreateUserDto): Promise<CreateUserResponseDto> {
    return await this.createUserUseCase.execute(user);
  }
}
