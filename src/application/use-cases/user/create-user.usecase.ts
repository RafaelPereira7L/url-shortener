import { CreateUserResponseDto } from '@application/dtos/user/create-user-response.dto';
import { CreateUserDto } from '@application/dtos/user/create-user.dto';
import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const userAlreadyExists = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = await this.userRepository.create(user);

    const { password, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }
}
