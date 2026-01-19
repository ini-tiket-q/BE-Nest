import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalApiGuard implements CanActivate {
    private readonly logger = new Logger(InternalApiGuard.name);
    private readonly apiKey: string;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('INTERNAL_API_KEY')!;

        if (!this.apiKey) {
        throw new Error('INTERNAL_API_KEY environment variable is required');
        }
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-internal-api-key'];

        if (!apiKey) {
        this.logger.warn('Request missing X-Internal-API-Key header');
        throw new UnauthorizedException('Missing API key');
        }

        if (apiKey !== this.apiKey) {
        this.logger.warn('Request with invalid X-Internal-API-Key');
        throw new UnauthorizedException('Invalid API key');
        }

        return true;
    }
}
