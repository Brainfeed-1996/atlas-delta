# Atlas Delta Architecture

## Overview

Atlas Delta is a production-grade operational data platform designed for reliability, observability, and maintainability. It provides a complete pipeline for ingesting, transforming, versioning, and serving operational intelligence datasets.

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Atlas Delta Platform                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐        │
│  │   Ingestion    │     │  Transformation │     │    Serving     │        │
│  │    Workers     │────▶│      Engine     │────▶│       API       │        │
│  └─────────────────┘     └─────────────────┘     └────────┬────────┘        │
│                                                           │                   │
│                           ┌───────────────────────────────┴───────────────┐  │
│                           │              Data Layer (Prisma/SQLite)       │  │
│                           │  ┌─────────┐  ┌─────────┐  ┌─────────┐       │  │
│                           │  │Datasets │  │Snapshots│  │ Lineage │       │  │
│                           │  └─────────┘  └─────────┘  └─────────┘       │  │
│                           └───────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │                         Web Dashboard (React)                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐ │    │
│  │  │Dashboard │  │ Datasets  │  │Pipelines │  │ Lineage  │  │Alerts │ │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └───────┘ │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### API Layer (`apps/api`)

The API layer follows a layered architecture pattern:

```
src/
├── controllers/        # Request handlers (thin layer)
├── middleware/         # Express middleware (validation, errors)
├── routes/            # Route definitions
├── services/          # Business logic (thick layer)
└── lib/              # Utilities (Prisma client)
```

#### Key Components

**Controllers** (`src/controllers/`)
- Handle HTTP requests and responses
- Delegate to services
- Minimal business logic

**Services** (`src/services/`)
- Contain all business logic
- Handle data manipulation
- Throw domain-specific errors

**Middleware** (`src/middleware/`)
- Request validation (Zod schemas)
- Error handling
- Authentication (future)
- Rate limiting

### Data Layer (`apps/api/prisma`)

Uses Prisma ORM with SQLite for persistence:

- **Migrations** - Version-controlled schema
- **Models** - Type-safe database access
- **Transactions** - ACID compliance

#### Schema Overview

```prisma
Dataset ─────┬─────▶ DatasetSnapshot
     │
     ├─────▶ QualityCheck
     │
     ├─────▶ Alert
     │
     └─────▶ Transformation ◀── Pipeline

LineageGraph ──▶ LineageNode ◀── LineageEdge
```

### Web Layer (`apps/web`)

React SPA with modern architecture:

```
src/
├── components/     # Reusable UI components
├── pages/         # Route-specific views
├── services/      # API client
├── types/        # TypeScript definitions
└── App.tsx       # Router setup
```

#### State Management

- React hooks (useState, useEffect) for local state
- API service layer for server state
- No external state management needed for current scope

## Design Patterns

### 1. Service Repository Pattern

```typescript
// Service contains business logic
class DatasetService {
  async findAll(): Promise<Dataset[]> {
    return prisma.dataset.findMany({...});
  }
  
  async create(data: CreateDatasetInput): Promise<Dataset> {
    // Business logic here
    return prisma.dataset.create({...});
  }
}
```

### 2. Middleware Pipeline

```typescript
// Validation → Business Logic → Error Handling
app.use('/datasets', 
  validate(datasetCreateSchema),
  datasetController.create,
  errorHandler
);
```

### 3. Result Type

```typescript
// Explicit error handling without exceptions
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };
```

### 4. Dependency Injection

Services are instantiated and injected:

```typescript
// Constructor injection
class DatasetController {
  constructor(private readonly datasetService: DatasetService) {}
}
```

## Data Flow

### Write Operations

```
User Input → Validation → Controller → Service → Prisma → SQLite
                     ↓
              Error Handling ← Response
```

### Read Operations

```
Request → Controller → Service → Prisma → SQLite → Response
              ↓
         Error Handling
```

### Real-time Updates (Future)

```
Database → WebSocket → Client Update
```

## Security

### Implemented

1. **Helmet** - Security headers
2. **CORS** - Origin control
3. **Rate Limiting** - DoS protection
4. **Input Validation** - Zod schemas
5. **SQL Injection Prevention** - Prisma parameterized queries

### Future

1. **JWT Authentication**
2. **Role-based Access Control**
3. **API Key Management**
4. **Audit Logging**

## Scalability

### Current Limitations

- SQLite (single writer)
- Single API instance
- Synchronous processing

### Scaling Strategy

1. **Read Replicas** - Prisma read replicas
2. **Caching** - Redis for hot data
3. **Microservices** - Split by domain
4. **Message Queues** - Async processing with Kafka

## Performance

### Optimization Techniques

1. **Connection Pooling** - Prisma connection pool
2. **Pagination** - Limit query results
3. **Indexing** - Database indexes on frequent queries
4. **Lazy Loading** - React code splitting

### Benchmarks (Target)

- API response time: < 100ms (p95)
- Concurrent connections: 1000+
- Database queries: < 50ms

## Observability

### Logging

- Structured JSON logs
- Log levels: debug, info, warn, error
- Contextual information (request ID, user ID)

### Metrics

- Request duration
- Error rate
- Database query time
- Custom business metrics

### Tracing (Future)

- OpenTelemetry integration
- Distributed tracing
- Performance profiling

## Deployment

### Development

```bash
docker-compose up
```

### Production

```bash
# Build
docker build -t atlas-delta:latest .

# Run
docker run -p 8094:8094 -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=file:/app/data/atlas-delta.db \
  atlas-delta:latest
```

### Kubernetes (Future)

- Horizontal pod autoscaling
- Rolling updates
- Health checks

## Technology Decisions

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Runtime | Node.js 20 | LTS, performance |
| Framework | Express | Minimal, flexible |
| ORM | Prisma | Type safety, migrations |
| Database | SQLite | Zero config, portable |
| Validation | Zod | Schema validation |
| API Docs | OpenAPI (future) | Standard specification |
| Frontend | React 18 | Component-based |
| Build | Vite | Fast HMR |
| Package Manager | pnpm | Workspace support |
| Build System | Turborepo | Caching, parallel |

## Future Architecture

### v2.0 Vision

```
┌─────────────────────────────────────────────────────────────────┐
│                        Atlas Delta v2.0                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │  Kafka  │  │   S3    │  │  PostgreSQL │ │  Redis   │        │
│  │ Streams │  │ Storage │  │  Warehouse  │  │  Cache   │        │
│  └────┬────┘  └────┬────┘  └──────┬─────┘  └────┬────┘         │
│       │            │             │            │               │
│       ▼            ▼             ▼            ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Distributed Processing Layer                │   │
│  │        (Worker Nodes / Spark / Flink / etc.)             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    GraphQL API Gateway                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐            │
│         ▼                    ▼                    ▼            │
│  ┌──────────┐        ┌──────────┐        ┌──────────┐        │
│  │  Web UI  │        │ Mobile   │        │  CLI     │        │
│  └──────────┘        └──────────┘        └──────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Conclusion

Atlas Delta provides a solid foundation for operational data management with:

- **Reliability** - Type-safe, tested code
- **Observability** - Logging, metrics, health checks
- **Maintainability** - Clean architecture, good docs
- **Extensibility** - Plugin system, modular design

The architecture is designed to evolve with growing requirements while maintaining stability and performance.