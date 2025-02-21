import { Test, TestingModule } from '@nestjs/testing';
import { CreateShortenedUrlUseCase } from '@application/use-cases/shortened-url/create-shortened-url.usecase';
import { ShortenedUrlRepository } from '@domain/repositories/shortened-url.repository';
import { InMemoryShortenedUrlRepository } from '@infra/in-memory/in-memory-shortened-url.repository';
import { ConfigService } from '@nestjs/config';
import { User } from '@domain/entities/user.entity';
import { randomUUID } from 'crypto';

describe('CreateShortenedUrlUseCase', () => {
  let createShortenedUrlUseCase: CreateShortenedUrlUseCase;
  let shortenedUrlRepository: ShortenedUrlRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const envVars = {
                BASE_URL: 'http://localhost:3000',
              };
              return envVars[key] || null;
            }),
          },
        },
        CreateShortenedUrlUseCase,
        {
          provide: ShortenedUrlRepository,
          useClass: InMemoryShortenedUrlRepository,
        }
      ],
    }).compile();

    createShortenedUrlUseCase = module.get<CreateShortenedUrlUseCase>(CreateShortenedUrlUseCase);
    shortenedUrlRepository = module.get<InMemoryShortenedUrlRepository>(ShortenedUrlRepository);
  });

  it('should create a shortened url without user logged in', async () => {
    const createShortenedUrlPayload = {
      originalUrl: 'https://random-url.com',
    };

    const result = await createShortenedUrlUseCase.execute(createShortenedUrlPayload, null);
    expect(result).toBeDefined();
    expect(result.originalUrl).toBe(createShortenedUrlPayload.originalUrl);

    const savedShortenedUrl = await shortenedUrlRepository.findByOriginalUrl(createShortenedUrlPayload.originalUrl);
    expect(savedShortenedUrl).toBeDefined();
    expect(savedShortenedUrl?.originalUrl).toBe(createShortenedUrlPayload.originalUrl);
    expect(savedShortenedUrl?.userId).toBeNull();
  });

  it('should create a shortened url with user logged in', async () => {
    const user = new User()
    user.id = randomUUID()

    const createShortenedUrlPayload = {
      originalUrl: 'https://random-url.com',
    };

    const result = await createShortenedUrlUseCase.execute(createShortenedUrlPayload, user.id);
    expect(result).toBeDefined();
    expect(result.originalUrl).toBe(createShortenedUrlPayload.originalUrl);

    const savedShortenedUrl = await shortenedUrlRepository.findByOriginalUrl(createShortenedUrlPayload.originalUrl);
    expect(savedShortenedUrl).toBeDefined();
    expect(savedShortenedUrl?.originalUrl).toBe(createShortenedUrlPayload.originalUrl);
    expect(savedShortenedUrl?.userId).toBe(user.id)
  });
});