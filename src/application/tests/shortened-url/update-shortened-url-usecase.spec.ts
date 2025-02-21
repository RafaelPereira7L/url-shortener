import { Test, TestingModule } from '@nestjs/testing';
import { ShortenedUrlRepository } from '@domain/repositories/shortened-url.repository';
import { InMemoryShortenedUrlRepository } from '@infra/in-memory/in-memory-shortened-url.repository';
import { ShortenedUrl } from '@domain/entities/shortened-url.entity';
import { ConfigService } from '@nestjs/config';
import { UpdateUserShortenedUrlsUseCase } from '@application/use-cases/shortened-url/update-shortened-url.usecase';
import { randomUUID } from 'crypto';

describe('UpdateShortenedUrlUseCase', () => {
  let updateShortenedUrlUseCase: UpdateUserShortenedUrlsUseCase;
  let shortenedUrlRepository: ShortenedUrlRepository;
  let configService: ConfigService;

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
        UpdateUserShortenedUrlsUseCase,
        {
          provide: ShortenedUrlRepository,
          useClass: InMemoryShortenedUrlRepository,
        }
      ],
    }).compile();

    updateShortenedUrlUseCase = module.get<UpdateUserShortenedUrlsUseCase>(UpdateUserShortenedUrlsUseCase);
    shortenedUrlRepository = module.get<InMemoryShortenedUrlRepository>(ShortenedUrlRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should update a shortened url', async () => {
    const baseUrl = configService.get('BASE_URL') as string;
    const userId = randomUUID();
    const originalUrl = 'https://random-url.com';

    const shortenedUrl = new ShortenedUrl(baseUrl);
    shortenedUrl.id = randomUUID();
    shortenedUrl.originalUrl = originalUrl;
    shortenedUrl.userId = userId;
    await shortenedUrlRepository.create(shortenedUrl);

    const updateShortenedUrlPayload = {
      originalUrl: 'https://updated-url.com',
    };

    const result = await updateShortenedUrlUseCase.execute(shortenedUrl.id, shortenedUrl.userId, updateShortenedUrlPayload);

    expect(result).toBeDefined();
    expect(result.originalUrl).toBe(updateShortenedUrlPayload.originalUrl);
  });

  it('should throw an exception if shortened url not found', async () => {
    const randomShortenedUrlId = randomUUID();
    const userId = randomUUID();

    expect(async () => {
      await updateShortenedUrlUseCase.execute(randomShortenedUrlId, userId, {
        originalUrl: 'https://updated-url.com',
      });
    }).rejects.toThrow('Shortened URL not found');
  });

  it('should throw an exception if user is not authorized', async () => {
    const baseUrl = configService.get('BASE_URL') as string;
    const userId = randomUUID();
    const originalUrl = 'https://random-url.com';

    const shortenedUrl = new ShortenedUrl(baseUrl);
    shortenedUrl.id = randomUUID();
    shortenedUrl.originalUrl = originalUrl;
    shortenedUrl.userId = userId;
    await shortenedUrlRepository.create(shortenedUrl);

    const updateShortenedUrlPayload = {
      originalUrl: 'https://updated-url.com',
    };

    expect(async () => {
      await updateShortenedUrlUseCase.execute(shortenedUrl.id, randomUUID(), updateShortenedUrlPayload);
    }).rejects.toThrow('You are not authorized to update this shortened URL');
  });
});