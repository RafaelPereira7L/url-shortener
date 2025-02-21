import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
