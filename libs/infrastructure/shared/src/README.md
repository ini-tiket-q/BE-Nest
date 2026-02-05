# Shared Infrastructure Library

> **Package**: `@tiketq-be/shared`  
> **Squad**: Gajah Mada  
> **Purpose**: Shared infrastructure components for internal service security and common utilities

---

## Overview

This library provides shared infrastructure components used across all microservices in the TiketQ backend system. Currently includes:

- **InternalApiGuard**: Authentication guard for internal service-to-service communication
- **@Internal() Decorator**: Convenient decorator combining guard, Swagger docs, and metadata

---

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage - InternalApiGuard](#usage---internalapiaguard)
- [Usage - @Internal() Decorator](#usage---internal-decorator)
- [Testing Instructions](#testing-instructions)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)

---

## Installation

This library is part of the monorepo. Import it using the path alias:

```typescript
import { InternalApiGuard, Internal } from '@tiketq-be/shared';
```

---

## Environment Variables

### Required Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `INTERNAL_API_KEY` | ✅ Yes | Secret key for internal service authentication | `my-super-secret-internal-key-2026` |

### Setup

Create or update your `.env` file:

```env
# Internal Service Authentication
INTERNAL_API_KEY=your-secret-internal-api-key-here
```

⚠️ **Important**: 
- Use a strong, random key (minimum 32 characters recommended)
- Never commit this key to git
- Share securely with other services that need to call internal endpoints

---

## Usage - InternalApiGuard

### Basic Usage

Apply the guard directly to a controller or method:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { InternalApiGuard } from '@tiketq-be/shared';

@Controller('internal/transactions')
@UseGuards(InternalApiGuard)
export class InternalTransactionsController {
  
  @Get(':id')
  getTransaction(@Param('id') id: string) {
    // This endpoint requires X-Internal-API-Key header
    return { id, status: 'paid' };
  }
}
```

### Method-Level Guard

Apply to specific methods only:

```typescript
@Controller('transactions')
export class TransactionsController {
  
  @Get(':id')
  @UseGuards(InternalApiGuard)
  getInternalTransaction(@Param('id') id: string) {
    // Protected endpoint
  }
  
  @Get('public/:id')
  getPublicTransaction(@Param('id') id: string) {
    // Public endpoint (no guard)
  }
}
```

### Module-Level Configuration

Register globally in your module:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { InternalApiGuard } from '@tiketq-be/shared';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: APP_GUARD,
      useClass: InternalApiGuard,
    },
  ],
})
export class AppModule {}
```

---

## Usage - @Internal() Decorator

The `@Internal()` decorator is a convenient shortcut that combines:
1. `@UseGuards(InternalApiGuard)` - Apply authentication
2. `@ApiSecurity('internal-api-key')` - Swagger documentation
3. `@SetMetadata(INTERNAL_KEY, true)` - Mark as internal endpoint

### Basic Usage

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { Internal } from '@tiketq-be/shared';

@Controller('internal/transactions')
export class InternalTransactionsController {
  
  @Internal()
  @Get(':id')
  getTransaction(@Param('id') id: string) {
    // Automatically protected with InternalApiGuard
    // Documented in Swagger with security requirement
    return { id, status: 'paid' };
  }
}
```

### With Other Decorators

Combine with standard NestJS decorators:

```typescript
@Controller('internal/tickets')
export class InternalTicketsController {
  
  @Internal()
  @Post('issue')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Issue flight ticket' })
  issueTicket(@Body() dto: IssueTicketDto) {
    // Multiple decorators work together
    return this.ticketService.issue(dto);
  }
}
```

### Swagger Configuration

Add security definition to your Swagger setup:

```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('Transaction Service API')
  .setVersion('1.0')
  .addApiKey(
    { 
      type: 'apiKey', 
      name: 'X-Internal-API-Key', 
      in: 'header' 
    },
    'internal-api-key'
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

---

## Testing Instructions

### Manual Testing with cURL

#### 1. Test Missing Header (Expect 401)

```bash
curl -X GET http://localhost:3001/internal/transactions/123
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Missing API key",
  "error": "Unauthorized"
}
```

#### 2. Test Invalid Key (Expect 401)

```bash
curl -X GET http://localhost:3001/internal/transactions/123 \
  -H "X-Internal-API-Key: wrong-key"
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Invalid API key",
  "error": "Unauthorized"
}
```

#### 3. Test Valid Key (Expect 200)

```bash
# Get your key from .env file
export INTERNAL_API_KEY="your-key-here"

curl -X GET http://localhost:3001/internal/transactions/123 \
  -H "X-Internal-API-Key: $INTERNAL_API_KEY"
```

**Expected Response:**
```json
{
  "id": "123",
  "status": "paid"
}
```

### Automated Testing

#### Unit Test Example

```typescript
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InternalApiGuard } from '@tiketq-be/shared';

describe('InternalApiGuard', () => {
  let guard: InternalApiGuard;
  const mockApiKey = 'test-api-key';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InternalApiGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(mockApiKey),
          },
        },
      ],
    }).compile();

    guard = module.get<InternalApiGuard>(InternalApiGuard);
  });

  it('should reject request without header', () => {
    const context = createMockContext({ headers: {} });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should reject request with invalid key', () => {
    const context = createMockContext({ 
      headers: { 'x-internal-api-key': 'wrong-key' } 
    });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should allow request with valid key', () => {
    const context = createMockContext({ 
      headers: { 'x-internal-api-key': mockApiKey } 
    });
    expect(guard.canActivate(context)).toBe(true);
  });
});

function createMockContext(request: any): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}
```

#### E2E Test Example

```typescript
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Internal API Guard (e2e)', () => {
  let app: INestApplication;
  const apiKey = process.env.INTERNAL_API_KEY;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/internal/transactions/:id (GET) - missing header', () => {
    return request(app.getHttpServer())
      .get('/internal/transactions/123')
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe('Missing API key');
      });
  });

  it('/internal/transactions/:id (GET) - invalid key', () => {
    return request(app.getHttpServer())
      .get('/internal/transactions/123')
      .set('X-Internal-API-Key', 'wrong-key')
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe('Invalid API key');
      });
  });

  it('/internal/transactions/:id (GET) - valid key', () => {
    return request(app.getHttpServer())
      .get('/internal/transactions/123')
      .set('X-Internal-API-Key', apiKey)
      .expect(200);
  });
});
```

### Testing Startup Validation

Test that app fails to start without `INTERNAL_API_KEY`:

```bash
# Remove or comment out INTERNAL_API_KEY in .env
# Then try to start the service
npm run start:dev

# Expected output:
# Error: INTERNAL_API_KEY environment variable is required
# Application failed to start
```

---

## Error Handling

### Error Scenarios

| Scenario | HTTP Status | Error Message | Log Level |
|----------|-------------|---------------|-----------|
| Missing `INTERNAL_API_KEY` env | N/A (startup crash) | `INTERNAL_API_KEY environment variable is required` | Fatal |
| Missing header | 401 | `Missing API key` | Warn |
| Invalid key | 401 | `Invalid API key` | Warn |
| Valid key | N/A | N/A | N/A |

### Security Logging

The guard logs security-related events:

```typescript
// Missing header
this.logger.warn('Request missing X-Internal-API-Key header');

// Invalid key
this.logger.warn('Request with invalid X-Internal-API-Key');
```

These logs can be integrated with observability tools (Jaeger, Prometheus) for security monitoring.

---

## Troubleshooting

### Issue: App crashes on startup

**Error:**
```
Error: INTERNAL_API_KEY environment variable is required
```

**Solution:**
1. Check your `.env` file exists in the project root
2. Verify `INTERNAL_API_KEY=your-key-here` is present
3. Restart the application

---

### Issue: Always getting 401 with valid key

**Possible Causes:**
1. **Case sensitivity**: Header must be `X-Internal-API-Key` (not `x-internal-api-key`)
2. **Whitespace**: Key has leading/trailing spaces
3. **Wrong service**: Key is different between services

**Debug Steps:**
```typescript
// Add temporary logging in your controller
@Internal()
@Get('test')
testEndpoint(@Headers() headers: any) {
  console.log('Received headers:', headers);
  console.log('API Key from header:', headers['x-internal-api-key']);
  console.log('Expected key:', process.env.INTERNAL_API_KEY);
  return { status: 'ok' };
}
```

---

### Issue: Swagger not showing security requirement

**Solution:**
Ensure you've added the security definition in `main.ts`:

```typescript
const config = new DocumentBuilder()
  .addApiKey(
    { 
      type: 'apiKey', 
      name: 'X-Internal-API-Key', 
      in: 'header' 
    },
    'internal-api-key' // This name must match @ApiSecurity() parameter
  )
  .build();
```

---

### Issue: Guard not being applied

**Check:**
1. Guard is imported correctly: `import { InternalApiGuard } from '@tiketq-be/shared';`
2. ConfigModule is imported: `ConfigModule.forRoot({ isGlobal: true })`
3. Decorator is placed correctly (before route decorators like `@Get()`)

---

## Best Practices

### ✅ DO

- Use strong, randomly generated API keys (32+ characters)
- Rotate API keys periodically
- Apply `@Internal()` to all internal-only endpoints
- Monitor logs for failed authentication attempts
- Use environment-specific keys (dev/staging/prod)

### ❌ DON'T

- Commit API keys to git
- Share keys via email or chat
- Use the same key across all environments
- Disable the guard in production
- Log the actual API key value

---

## Service-to-Service Communication Example

### Calling Service (API Gateway)

```typescript
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export class TransactionClient {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getTransaction(id: string) {
    const apiKey = this.configService.get('INTERNAL_API_KEY');
    
    return this.httpService.get(
      `http://transactions-service:3001/internal/transactions/${id}`,
      {
        headers: {
          'X-Internal-API-Key': apiKey,
        },
      }
    ).toPromise();
  }
}
```

### Receiving Service (Transaction Service)

```typescript
@Controller('internal/transactions')
export class InternalTransactionsController {
  
  @Internal()
  @Get(':id')
  getTransaction(@Param('id') id: string) {
    // Automatically protected
    return this.transactionService.findOne(id);
  }
}
```

---

## Support

For issues or questions:
- **Squad**: Gajah Mada
- **Maintainer**: Muhammad Irfan Dzaky
- **Sprint**: 3
- **Date**: January 2026

---

## Changelog

### v1.0.0 (Sprint 3 - January 2026)
- Initial release
- InternalApiGuard implementation
- @Internal() decorator
- Documentation and testing guide
