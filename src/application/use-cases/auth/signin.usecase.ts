import { SignInDto } from "@application/dtos/user/signin.dto";
import { UserRepositoryImpl } from "@infra/repositories/user-repository.impl";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignInUseCase {
  constructor(private readonly jwtService: JwtService, private readonly userRepository: UserRepositoryImpl) { }

  async execute(credentials: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!bcrypt.compareSync(credentials.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { access_token: accessToken };
  }

}