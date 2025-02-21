import { ShortenedUrl } from '@domain/entities/shortened-url.entity';
import { ShortenedUrlRepository } from '@domain/repositories/shortened-url.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ShortenedUrlRepositoryImpl implements ShortenedUrlRepository {
  constructor(
    @InjectRepository(ShortenedUrl)
    private readonly shortenedUrlRepository: Repository<ShortenedUrl>,
  ) {}

  async findByShortUrl(shortUrl: string): Promise<ShortenedUrl | null> {
    return await this.shortenedUrlRepository.findOneBy({ shortUrl });
  }

  async create(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl> {
    return await this.shortenedUrlRepository.save(shortenedUrl);
  }

  async update(shortenedUrl: ShortenedUrl): Promise<boolean> {
    const updateResult = await this.shortenedUrlRepository.update(
      shortenedUrl.id,
      shortenedUrl,
    );
    return updateResult.affected === 1;
  }

  async delete(shortenedUrlId: string): Promise<boolean> {
    const deleteResult = await this.shortenedUrlRepository.softDelete({
      id: shortenedUrlId,
    });
    return deleteResult.affected === 1;
  }

  async findByOriginalUrl(originalUrl: string): Promise<ShortenedUrl | null> {
    return await this.shortenedUrlRepository.findOneBy({ originalUrl });
  }

  async findAllByUserId(userId: string): Promise<ShortenedUrl[]> {
    return await this.shortenedUrlRepository
      .createQueryBuilder('shortenedUrl')
      .loadRelationCountAndMap(
        'shortenedUrl.clicksCount',
        'shortenedUrl.clicks',
      ) // Carrega a contagem de cliques
      .select([
        'shortenedUrl.id',
        'shortenedUrl.originalUrl',
        'shortenedUrl.shortUrl',
        'shortenedUrl.createdAt',
        'shortenedUrl.updatedAt',
        'shortenedUrl.userId',
      ])
      .where('shortenedUrl.userId = :userId', { userId })
      .orderBy('shortenedUrl.createdAt', 'DESC')
      .getMany();
  }

  async findByShortUrlId(id: string): Promise<ShortenedUrl | null> {
    return await this.shortenedUrlRepository.findOneBy({ id });
  }
}
