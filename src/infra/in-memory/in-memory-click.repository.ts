import { Click } from "@domain/entities/click.entity";
import { ClickRepository } from "@domain/repositories/click.repository";
import { randomUUID } from "crypto";

export class InMemoryClickRepository implements ClickRepository {
  private readonly clicks: Click[] = [];

  async create(click: Click): Promise<Click> {
    click.id = randomUUID();
    this.clicks.push(click);
    return click;
  }
  async findByShortenedUrl(shortenedUrlId: string): Promise<Click[]> {
    return this.clicks.filter((click) => click.shortenedUrlId === shortenedUrlId);
  }
  async countByShortenedUrl(shortenedUrlId: string): Promise<number> {
    return this.clicks.filter((click) => click.shortenedUrlId === shortenedUrlId).length;
  }
}