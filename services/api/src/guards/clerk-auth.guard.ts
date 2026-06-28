import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private clerkClient;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    this.clerkClient = createClerkClient({ secretKey });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const sessionClaims = await this.clerkClient.verifyToken(token);
      
      // Attach user info to the request
      request.user = {
        id: sessionClaims.sub,
        ...sessionClaims,
      };
      
      return true;
    } catch (e) {
      console.error('[ClerkAuthGuard] Token verification failed:', e.message);
      throw new UnauthorizedException(
        'something went wrong! please ensure you are using our SDK',
      );
    }
  }
}
