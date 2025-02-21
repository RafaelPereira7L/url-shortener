import { ListUserShortenedUrlsUseCase } from "@application/use-cases/shortened-url/list-user-shortened-urls.usecase";
import { ShortenedUrl } from "@domain/entities/shortened-url.entity";
import { User } from "@domain/entities/user.entity";
import { ShortenedUrlRepository } from "@domain/repositories/shortened-url.repository";
import { InMemoryShortenedUrlRepository } from "@infra/in-memory/in-memory-shortened-url.repository";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { randomUUID } from "crypto";

describe('ListUserShortenedUrlsUseCase', () => {
  let listUserShortenedUrlsUseCase: ListUserShortenedUrlsUseCase;
  let shortenedUrlRepository: ShortenedUrlRepository;
  let configService: ConfigService;

  const user = new User();
  user.id = randomUUID();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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
        ListUserShortenedUrlsUseCase,
        {
          provide: ShortenedUrlRepository,
          useClass: InMemoryShortenedUrlRepository,
        }
      ],
    }).compile();

    listUserShortenedUrlsUseCase = module.get<ListUserShortenedUrlsUseCase>(ListUserShortenedUrlsUseCase);
    shortenedUrlRepository = module.get<InMemoryShortenedUrlRepository>(ShortenedUrlRepository);
    configService = module.get<ConfigService>(ConfigService);

    const baseUrl = configService.get('BASE_URL') as string;

    for (let i = 0; i < 10; i++) {
      const shortenedUrl = new ShortenedUrl(baseUrl);
      shortenedUrl.id = randomUUID();
      shortenedUrl.originalUrl = `https://example.com/${i}`;
      shortenedUrl.clicksCount = 0;
      shortenedUrl.createdAt = new Date();
      shortenedUrl.updatedAt = new Date();
      shortenedUrl.deletedAt = null;
      shortenedUrl.userId = user.id;

      await shortenedUrlRepository.create(shortenedUrl);
    }
  });

  it('should throw an exception if user is not provided', async () => {
    expect(async () => {
      await listUserShortenedUrlsUseCase.execute('');
    }).rejects.toThrow('User ID is required');
  });

  it('should list user shortened urls', async () => {
    const result = await listUserShortenedUrlsUseCase.execute(user.id);
    expect(result).toBeDefined();
    expect(result.length).toBe(10);
  });

  it('should list user shortened urls with clicks', async () => {
    const result = await listUserShortenedUrlsUseCase.execute(user.id);
    expect(result).toBeDefined();
    expect(result.length).toBe(10);
    expect(result[0].clicksCount).toBe(0);
  });

  it('should list only user shortened urls with deletedAt equals null', async () => {
    const result = await listUserShortenedUrlsUseCase.execute(user.id);
    expect(result).toBeDefined();
    expect(result.length).toBe(10);
    
    await shortenedUrlRepository.delete(result[0].id);

    const resultAfterDelete = await listUserShortenedUrlsUseCase.execute(user.id);
    expect(resultAfterDelete).toBeDefined();
    expect(resultAfterDelete.length).toBe(9);
  });
});