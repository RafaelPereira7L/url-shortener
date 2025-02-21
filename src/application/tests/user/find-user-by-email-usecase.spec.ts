import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@domain/repositories/user.repository';
import { InMemoryUserRepository } from '@infra/in-memory/in-memory-user.repository';
import { FindUserByEmailUseCase } from '@application/use-cases/user/find-user-by-email.usecase';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

describe('FindUserByEmailUseCase', () => {
  let findUserByEmailUseCase: FindUserByEmailUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByEmailUseCase,
        {
          provide: UserRepository,
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    findUserByEmailUseCase = module.get<FindUserByEmailUseCase>(FindUserByEmailUseCase);
    userRepository = module.get<InMemoryUserRepository>(UserRepository);
  });

  it('should find the user created by email', async () => {
    const createUserPayload = {
      id: randomUUID(),
      name: 'User',
      email: 'user@email.com',
      password: 'randomPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await userRepository.create(createUserPayload);
    const result = await findUserByEmailUseCase.execute(createUserPayload.email);
    expect(result).toBeDefined();
    expect(result?.name).toBe(createUserPayload.name);
    expect(result?.email).toBe(createUserPayload.email);
  });

  it('should throw an exception if user not found', async () => {
    const randomEmail = Math.random().toString(36).substring(7) + '@email.com';
    
    expect(async () => {
      await findUserByEmailUseCase.execute(randomEmail);
    }).rejects.toThrow(NotFoundException);
  });
});