import { Test, TestingModule } from '@nestjs/testing';
import { ShortenedUrlRepository } from '@domain/repositories/shortened-url.repository';
import { InMemoryShortenedUrlRepository } from '@infra/in-memory/in-memory-shortened-url.repository';
import { FindShortenedUrlUseCase } from '@application/use-cases/shortened-url/find-shortened-url.usecase';
import { ShortenedUrl } from '@domain/entities/shortened-url.entity';
import { ConfigService } from '@nestjs/config';

describe('FindShortenedUrlUseCase', () => {
  let findShortenedUrlUseCase: FindShortenedUrlUseCase;
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
        FindShortenedUrlUseCase,
        {
          provide: ShortenedUrlRepository,
          useClass: InMemoryShortenedUrlRepository,
        }
      ],
    }).compile();

    findShortenedUrlUseCase = module.get<FindShortenedUrlUseCase>(FindShortenedUrlUseCase);
    shortenedUrlRepository = module.get<InMemoryShortenedUrlRepository>(ShortenedUrlRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should find a shortened url by short url', async () => {
    const baseUrl = configService.get('BASE_URL') as string;
    const originalUrl = 'https://random-url.com';

    const shortenedUrl = new ShortenedUrl(baseUrl);
    shortenedUrl.originalUrl = originalUrl;
    const createdShortenedUrl = await shortenedUrlRepository.create(shortenedUrl);

    const result = await findShortenedUrlUseCase.execute(createdShortenedUrl.shortUrl);
    expect(result).toBeDefined();
    expect(result.originalUrl).toBe(originalUrl);
    expect(result.shortUrl).toBe(createdShortenedUrl.shortUrl);
  });
});