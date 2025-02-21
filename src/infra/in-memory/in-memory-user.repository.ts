import { User } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';
import { randomUUID } from 'crypto';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async create(user: User): Promise<User> {
    user.id = randomUUID();
    this.users.push(user);
    return user;
  }

  async update(user: User): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users[index] = user;
    
    return true;
  }
}