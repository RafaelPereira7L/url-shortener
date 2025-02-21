import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract create(user: User): Promise<User>;
  abstract update(user: User): Promise<boolean>;
}
