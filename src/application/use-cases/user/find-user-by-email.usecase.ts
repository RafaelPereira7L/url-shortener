import { User } from "@domain/entities/user.entity";
import { UserRepositoryImpl } from "@infra/repositories/user-repository.impl";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepositoryImpl) {}

  async execute(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}