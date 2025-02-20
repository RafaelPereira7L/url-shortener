import { CreateUserDto } from '@application/dtos/user/create-user.dto';
import { CreateUserUseCase } from '@application/use-cases/user/create-user.usecase';
import { FindUserByEmailUseCase } from '@application/use-cases/user/find-user-by-email.usecase';
import { User } from '@domain/entities/user.entity';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase) { }

  @Get(':email')
  async findUserByEmail(@Param('email') email: string): Promise<User | null> {
    return await this.findUserByEmailUseCase.execute(email);
  }

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.createUserUseCase.execute(user);
  }
}
