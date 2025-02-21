import { Click } from '@domain/entities/click.entity';
import { ClickRepository } from '@domain/repositories/click.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ClickRepositoryImpl implements ClickRepository {
  constructor(
    @InjectRepository(Click)
    private readonly clickRepository: Repository<Click>,
  ) {}

  async create(click: Click): Promise<Click> {
    return await this.clickRepository.save(click);
  }

  async findByShortenedUrl(shortenedUrlId: string): Promise<Click[]> {
    return await this.clickRepository.find({ where: { shortenedUrlId } });
  }

  async countByShortenedUrl(shortenedUrlId: string): Promise<number> {
    return await this.clickRepository.count({ where: { shortenedUrlId } });
  }
}
