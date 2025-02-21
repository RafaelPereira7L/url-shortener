import { RegisterClickUseCase } from "@application/use-cases/click/register-click.usecase";
import { ShortenedUrl } from "@domain/entities/shortened-url.entity";
import { ClickRepository } from "@domain/repositories/click.repository";
import { ShortenedUrlRepository } from "@domain/repositories/shortened-url.repository";
import { InMemoryClickRepository } from "@infra/in-memory/in-memory-click.repository";
import { InMemoryShortenedUrlRepository } from "@infra/in-memory/in-memory-shortened-url.repository";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";

describe('RegisterClickUseCase', () => {
  let registerClickUseCase: RegisterClickUseCase;
  let shortenedUrlRepository: ShortenedUrlRepository;
  let clickRepository: ClickRepository;
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
        RegisterClickUseCase,
        {
          provide: ShortenedUrlRepository,
          useClass: InMemoryShortenedUrlRepository,
        },
        {
          provide: ClickRepository,
          useClass: InMemoryClickRepository,
        }
      ],
    }).compile();

    registerClickUseCase = module.get<RegisterClickUseCase>(RegisterClickUseCase);
    shortenedUrlRepository = module.get<InMemoryShortenedUrlRepository>(ShortenedUrlRepository);
    clickRepository = module.get<InMemoryClickRepository>(ClickRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should register a click', async () => {
    const baseUrl = configService.get('BASE_URL') as string;
    const userId = randomUUID();
    const originalUrl = 'https://random-url.com';

    const shortenedUrl = new ShortenedUrl(baseUrl);
    shortenedUrl.id = randomUUID();
    shortenedUrl.originalUrl = originalUrl;
    shortenedUrl.userId = userId;
    await shortenedUrlRepository.create(shortenedUrl);

    await registerClickUseCase.execute(shortenedUrl.shortUrl);
    const result = await clickRepository.findByShortenedUrl(shortenedUrl.id);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  it('should throw an exception if shortened url not found', async () => {
    const randomShortenedUrlId = randomUUID();

    expect(async () => {
      await registerClickUseCase.execute(randomShortenedUrlId);
    }).rejects.toThrow('Shortened URL not found');
  });
});