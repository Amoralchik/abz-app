import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';

@Injectable()
export class AuthService {
  private readonly secretKey = process.env.SECRET_KEY;

  generateToken(): string {
    return jwt.sign({ color: faker.color.human() }, this.secretKey, {
      expiresIn: '1h',
    });
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
