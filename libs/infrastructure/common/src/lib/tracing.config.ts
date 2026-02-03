/**
 * OpenTelemetry Tracing Configuration
 * 
 * This module configures distributed tracing using OpenTelemetry and exports traces to Jaeger.
 * 
 * Key Concepts:
 * - Trace: A collection of spans that represents a complete request flow across services
 * - Span: A single operation within a trace (e.g., HTTP request, database query)
 * - Context Propagation: How trace context is passed between services via HTTP headers
 * 
 * How it works:
 * 1. When a request comes in, OpenTelemetry creates a trace
 * 2. Each service operation creates a span
 * 3. When making HTTP calls, trace context is automatically propagated via headers
 * 4. All spans are sent to Jaeger for visualization
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

/**
 * Initialize OpenTelemetry tracing
 * 
 * This MUST be called BEFORE importing any NestJS modules or application code
 * to ensure proper instrumentation.
 * 
 * @param serviceName - The name of the service (e.g., 'flight-service', 'transactions-service')
 * @param serviceVersion - The version of the service (optional)
 */
export function initializeTracing(serviceName: string, serviceVersion?: string): void {
  // Check if tracing is already initialized to avoid double initialization
  if (process.env['OTEL_SDK_DISABLED'] === 'true') {
    console.log(`[Tracing] Disabled for ${serviceName}`);
    return;
  }

  // Get Jaeger endpoint from environment or use default
  const jaegerEndpoint = process.env['JAEGER_ENDPOINT'] || 'http://localhost:4318/v1/traces';
  
  // Create the trace exporter that sends traces to Jaeger
  const traceExporter = new OTLPTraceExporter({
    url: jaegerEndpoint,
    // Optional: Add headers if your Jaeger requires authentication
    // headers: {},
  });

  // Create the OpenTelemetry SDK
  const sdk = new NodeSDK({
    // Resource attributes help identify your service in Jaeger UI
    resource: resourceFromAttributes({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion || '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env['NODE_ENV'] || 'development',
    }),
    
    // Auto-instrumentations automatically create spans for common operations:
    // - HTTP requests (incoming and outgoing)
    // - Database queries (if using supported ORMs)
    // - Express/NestJS routes
    // - File system operations
    // - And more...
    instrumentations: [
      getNodeAutoInstrumentations({
        // Configure which instrumentations to enable
        '@opentelemetry/instrumentation-http': {
          enabled: true,
          // Ignore health check endpoints to reduce noise
          ignoreIncomingRequestHook: (req) => {
            const url = req.url || '';
            return url.includes('/health') || url.includes('/metrics');
          },
        },
        '@opentelemetry/instrumentation-fs': {
          enabled: false, // Disable file system tracing to reduce noise
        },
      }),
    ],
    
    // The exporter that sends traces to Jaeger
    traceExporter,
  });

  // Start the SDK
  sdk.start();

  console.log(`[Tracing] Initialized for ${serviceName}`);
  console.log(`[Tracing] Jaeger endpoint: ${jaegerEndpoint}`);
  console.log(`[Tracing] View traces at: http://localhost:16686`);

  // Gracefully shutdown tracing on process exit
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('[Tracing] Shutdown complete'))
      .catch((error) => console.error('[Tracing] Error during shutdown', error))
      .finally(() => process.exit(0));
  });
}

