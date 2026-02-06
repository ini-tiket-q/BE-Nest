export const HttpResilienceConfig = {
  timeout: 5000,
  retry: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    exponentialBackoff: true,
  },
  retryableStatusCodes: [500, 502, 503, 504],
  nonRetryableStatusCodes: [400, 401, 403, 404],
};
