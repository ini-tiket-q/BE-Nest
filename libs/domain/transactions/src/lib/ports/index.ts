/**
 * PORTS - Interface definitions for external dependencies
 * 
 * In Hexagonal Architecture:
 * - Domain Layer defines WHAT it needs (interfaces = PORTS)
 * - Infrastructure Layer provides HOW to do it (implementations = ADAPTERS)
 * 
 * This keeps domain layer independent from technical details.
 */

export * from './repository.port';
