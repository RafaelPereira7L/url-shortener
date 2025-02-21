import { SignInUseCase } from "@application/use-cases/auth/signin.usecase";
import { UserRepository } from "@domain/repositories/user.repository";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import * as bcrypt from "bcrypt";

describe('SignInUseCase', () => {
  let signInUseCase: SignInUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SignInUseCase,
        {
          provide: JwtService,
          useValue: new JwtService({
            secret: 'SECRET',
            signOptions: { expiresIn: '1h' },
          }),
        },
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn((email: string) => {
              const user = {
                id: '1',
                name: 'User',
                email: 'user@email.com',
                password: bcrypt.hashSync('password', 10),
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              return user;
            }),
          },
        },
      ],
    }).compile();

    signInUseCase = module.get<SignInUseCase>(SignInUseCase);
  });
  
  it('should throw an exception credential is invalid', async () => {
    const credentials = {
      email: 'invalid_user@email.com',
      password: 'invalid_password',
    };

    expect(async () => {
      await signInUseCase.execute(credentials);
    }).rejects.toThrow('Invalid credentials');
  });

  it('should sign in a user and return an access token', async () => {
    const credentials = {
      email: 'user@email.com',
      password: 'password',
    };

    const result = await signInUseCase.execute(credentials);
    expect(result).toBeDefined();
    expect(result.access_token).toBeDefined();
  });
});