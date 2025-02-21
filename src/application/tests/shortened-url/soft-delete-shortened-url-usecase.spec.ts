import { SoftDeleteShortenedUrlUseCase } from "@application/use-cases/shortened-url/soft-delete-shortened-url.usecase";
import { ShortenedUrl } from "@domain/entities/shortened-url.entity";
import { ShortenedUrlRepository } from "@domain/repositories/shortened-url.repository";
import { InMemoryShortenedUrlRepository } from "@infra/in-memory/in-memory-shortened-url.repository";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";

describe('SoftDeleteShortenedUrlUseCase', () => {
  let softDeleteShortenedUrlUseCase: SoftDeleteShortenedUrlUseCase;
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
        SoftDeleteShortenedUrlUseCase,
        {
          provide: ShortenedUrlRepository,
          useClass: InMemoryShortenedUrlRepository,
        }
      ],
    }).compile();
    softDeleteShortenedUrlUseCase = module.get<SoftDeleteShortenedUrlUseCase>(SoftDeleteShortenedUrlUseCase);
    shortenedUrlRepository = module.get<InMemoryShortenedUrlRepository>(ShortenedUrlRepository);
    configService = module.get<ConfigService>(ConfigService);

  });

  it('should soft delete a shortened url', async () => {
    const baseUrl = configService.get('BASE_URL') as string;
    const userId = randomUUID();
    const originalUrl = 'https://random-url.com';

    const shortenedUrl = new ShortenedUrl(baseUrl);
    shortenedUrl.id = randomUUID();
    shortenedUrl.originalUrl = originalUrl;
    shortenedUrl.userId = userId;
    await shortenedUrlRepository.create(shortenedUrl);

    const result = await softDeleteShortenedUrlUseCase.execute(shortenedUrl.id, userId);
    expect(result).toBeDefined();
    expect(result).toBeTruthy();

    const deletedShortenedUrl = await shortenedUrlRepository.findByShortUrlId(shortenedUrl.id);
    expect(deletedShortenedUrl).toBeNull();
  });

  it('should throw an exception if shortened url not found', async () => {
    const randomShortenedUrlId = randomUUID();
    const userId = randomUUID();

    expect(async () => {
      await softDeleteShortenedUrlUseCase.execute(randomShortenedUrlId, userId);
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

    expect(async () => {
      await softDeleteShortenedUrlUseCase.execute(shortenedUrl.id, randomUUID());
    }).rejects.toThrow('You are not authorized to delete this shortened URL');
  });

});