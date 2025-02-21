import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@domain/repositories/user.repository';
import { CreateUserUseCase } from '@application/use-cases/user/create-user.usecase';
import { InMemoryUserRepository } from '@infra/in-memory/in-memory-user.repository';
import { ConflictException } from '@nestjs/common';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserRepository,
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get<InMemoryUserRepository>(UserRepository);
  });

  it('should create a user', async () => {
    const createUserPayload = {
      name: 'User',
      email: 'user@email.com',
      password: 'randomPassword',
    };

    const result = await createUserUseCase.execute(createUserPayload);
    expect(result).toBeDefined();
    expect(result.name).toBe(createUserPayload.name);
    expect(result.email).toBe(createUserPayload.email);

    const savedUser = await userRepository.findByEmail(createUserPayload.email);
    expect(savedUser).toBeDefined();
    expect(savedUser?.name).toBe(createUserPayload.name);
  });

  it('should throw an exception if user already exists', async () => {
    const createUserPayload = {
      name: 'User',
      email: 'user@email.com',
      password: 'randomPassword',
    };

    await createUserUseCase.execute(createUserPayload);
    expect(async () => {
      await createUserUseCase.execute(createUserPayload);
    }).rejects.toThrow(ConflictException);
  })
});