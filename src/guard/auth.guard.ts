import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromHeader(request);
    if (!token) {
      return false;
    }
    try {
      this.authService.verifyToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  private getTokenFromHeader(request): string {
    if (!request.headers.authorization) {
      return null;
    }
    const [bearer, token] = request.headers.authorization.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return null;
    }
    return token;
  }
}
