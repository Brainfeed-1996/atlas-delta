# Atlas Delta

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/Brainfeed-1996/atlas-delta)
![GitHub forks](https://img.shields.io/github/forks/Brainfeed-1996/atlas-delta)
![GitHub issues](https://img.shields.io/github/issues/Brainfeed-1996/atlas-delta)
![GitHub license](https://img.shields.io/github/license/Brainfeed-1996/atlas-delta)
![CI](https://github.com/Brainfeed-1996/atlas-delta/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/node/v/atlas-delta)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.14-blue)

**Operational Data and Decision Platform** for ingesting, transforming, versioning, and serving operational intelligence datasets.

[Documentation](https://atlas-delta.dev) • [API Reference](#api-reference) • [Contributing](CONTRIBUTING.md) • [Discord](https://discord.gg/atlas-delta)

</div>

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Docker](#docker)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

### Core Capabilities

- **Dataset Management** - Create, update, delete, and version control datasets with support for multiple source types (API, Database, File, Stream, Webhook)
- **Data Transformation** - Define and execute transformation pipelines (filter, aggregate, enrich, validate, normalize, join)
- **Data Lineage** - Track data flow and dependencies across datasets and transformations with visual graphs
- **Quality Checks** - Implement data quality rules (not_null, unique, range, regex, custom) with automated execution
- **Pipeline Orchestration** - Schedule and run data pipelines with execution history and status tracking
- **Alert System** - Monitor dataset freshness, pipeline failures, and quality issues with intelligent alerting

### Platform Features

- **RESTful API** - Full CRUD operations with pagination, filtering, and validation
- **Real-time Dashboard** - Modern React-based UI with live metrics and alerts
- **Database Persistence** - SQLite with Prisma ORM for reliable data storage
- **Docker Support** - Containerized development and production environments
- **TypeScript** - Complete type safety across all layers
- **Monorepo** - Efficient dependency management with pnpm workspaces and Turborepo

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Atlas Delta Platform                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Datasets   │    │Transformations│   │  Pipelines   │      │
│  │   Management │    │    Engine     │   │ Orchestrator │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Data Layer (Prisma)                   │   │
│  │    SQLite │ Migrations │ Versioning │ Snapshots         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    REST API (Express)                    │   │
│  │   Validation │ Authentication │ Rate Limiting            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐            │
│         ▼                    ▼                    ▼            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Web UI     │    │  Lineage UI  │    │  Alerts UI   │      │
│  │  (React)     │    │  (Graphs)    │    │ (Dashboard) │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Reliability** - Every operation is validated and error-handled
2. **Observability** - Comprehensive logging and metrics
3. **Reproducibility** - Versioned snapshots and lineage tracking
4. **Maintainability** - Clean separation of concerns with TypeScript

---

## Quick Start

### One-liner Installation

```bash
# Clone and run
git clone https://github.com/Brainfeed-1996/atlas-delta.git
cd atlas-delta
pnpm install
pnpm dev
```

### Docker Quick Start

```bash
docker-compose up -d
```

Access the dashboard at `http://localhost:3000` and API at `http://localhost:8094`

---

## Project Structure

```
atlas-delta/
├── apps/
│   ├── api/                 # Express.js REST API
│   │   ├── prisma/          # Database schema and migrations
│   │   ├── src/
│   │   │   ├── controllers/ # Route handlers
│   │   │   ├── middleware/  # Express middleware (auth, validation, errors)
│   │   │   ├── routes/      # API route definitions
│   │   │   ├── services/     # Business logic
│   │   │   └── lib/         # Utilities (Prisma client)
│   │   └── package.json
│   │
│   └── web/                  # React dashboard
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── pages/       # Route pages
│       │   ├── services/    # API client
│       │   └── types/       # TypeScript definitions
│       └── package.json
│
├── packages/
│   ├── core/                # Shared utilities
│   │   ├── src/
│   │   │   ├── config.ts    # Configuration management
│   │   │   ├── logger.ts    # Structured logging
│   │   │   └── result.ts    # Result/Either type
│   │   └── package.json
│   │
│   └── models/              # Domain models and Zod schemas
│       ├── src/
│       │   └── index.ts     # All TypeScript interfaces and schemas
│       └── package.json
│
├── docs/                   # Documentation
│   ├── architecture.md      # Detailed architecture
│   └── roadmap.md          # Feature roadmap
│
├── .github/
│   └── workflows/           # CI/CD pipelines
│       └── ci.yml
│
├── docker-compose.yml       # Docker development environment
├── Dockerfile               # Production Docker image
├── turbo.json               # Turborepo configuration
├── package.json             # Root workspace configuration
├── tsconfig.json            # TypeScript base configuration
└── README.md
```

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express.js | 4.19 | Web framework |
| TypeScript | 5.4 | Type safety |
| Prisma | 5.14 | ORM |
| SQLite | - | Database |
| Zod | 3.23 | Validation |
| Helmet | 7.1 | Security headers |
| express-rate-limit | 7.2 | Rate limiting |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI framework |
| TypeScript | 5.4 | Type safety |
| Vite | 5.2 | Build tool |
| React Router | 6.23 | Routing |
| Recharts | 2.12 | Charts |
| CSS | - | Styling |

### DevOps

| Technology | Purpose |
|------------|---------|
| pnpm | Package manager |
| Turborepo | Build orchestration |
| Docker | Containerization |
| GitHub Actions | CI/CD |
| ESLint | Linting |
| Prettier | Formatting |
| Vitest | Testing |

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0
- **Docker** (optional, for containerized development)

### Installation

```bash
# Clone the repository
git clone https://github.com/Brainfeed-1996/atlas-delta.git
cd atlas-delta

# Install dependencies
pnpm install

# Generate Prisma client
pnpm --filter @atlas-delta/api db:generate

# Push database schema
pnpm --filter @atlas-delta/api db:push
```

### Development

#### Run all services

```bash
pnpm dev
```

#### Run API only

```bash
pnpm --filter @atlas-delta/api dev
```

#### Run web only

```bash
pnpm --filter @atlas-delta/web dev
```

#### Environment variables

Create `.env` files as needed:

```bash
# API (.env)
PORT=8094
NODE_ENV=development
DATABASE_URL=file:./data/atlas-delta.db
LOG_LEVEL=debug
CORS_ORIGINS=*

# Web (.env.local)
VITE_API_URL=http://localhost:8094/api/v1
```

### Docker

#### Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Production

```bash
# Build and run
docker build -t atlas-delta:latest .
docker run -p 8094:8094 -p 3000:3000 atlas-delta:latest
```

---

## API Reference

### Base URL

```
http://localhost:8094/api/v1
```

### Endpoints

#### Datasets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/datasets` | List all datasets (paginated) |
| POST | `/datasets` | Create a new dataset |
| GET | `/datasets/:id` | Get dataset by ID |
| PUT | `/datasets/:id` | Update dataset |
| DELETE | `/datasets/:id` | Delete dataset |
| GET | `/datasets/metrics` | Get system metrics |
| GET | `/datasets/:id/snapshots` | Get dataset snapshots |
| POST | `/datasets/:id/snapshots` | Create new snapshot |

#### Transformations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transformations` | List all transformations |
| POST | `/transformations` | Create transformation |
| GET | `/transformations/:id` | Get transformation |
| PUT | `/transformations/:id` | Update transformation |
| DELETE | `/transformations/:id` | Delete transformation |

#### Pipelines

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pipelines` | List all pipelines |
| POST | `/pipelines` | Create pipeline |
| GET | `/pipelines/:id` | Get pipeline details |
| PUT | `/pipelines/:id` | Update pipeline |
| DELETE | `/pipelines/:id` | Delete pipeline |
| POST | `/pipelines/:id/run` | Trigger pipeline run |
| GET | `/pipelines/:id/runs` | Get pipeline runs |

#### Quality Checks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quality-checks/dataset/:datasetId` | Get checks for dataset |
| POST | `/quality-checks` | Create quality check |
| POST | `/quality-checks/:id/execute` | Execute check |
| DELETE | `/quality-checks/:id` | Delete check |

#### Lineage

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lineage` | List lineage graphs |
| POST | `/lineage` | Create lineage graph |
| GET | `/lineage/:id` | Get graph details |
| DELETE | `/lineage/:id` | Delete graph |
| POST | `/lineage/:id/nodes` | Add node to graph |
| POST | `/lineage/:id/edges` | Add edge to graph |

#### Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/alerts` | List alerts |
| GET | `/alerts/count` | Get unread count |
| GET | `/alerts/:id` | Get alert |
| PATCH | `/alerts/:id/read` | Mark as read |
| POST | `/alerts/read-all` | Mark all as read |
| DELETE | `/alerts/:id` | Delete alert |

### Response Format

```json
// Success
{
  "data": { ... }
}

// Paginated
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}

// Error
{
  "error": "Error message",
  "statusCode": 400
}
```

---

## Testing

### Run all tests

```bash
pnpm test
```

### Run tests with coverage

```bash
pnpm test --coverage
```

### Run tests in watch mode

```bash
pnpm test --watch
```

### Run specific package tests

```bash
pnpm --filter @atlas-delta/api test
pnpm --filter @atlas-delta/core test
```

---

## Deployment

### Production Build

```bash
# Build all packages
pnpm build

# Generate Prisma client for production
pnpm --filter @atlas-delta/api db:generate
```

### Docker Production

```bash
# Build image
docker build -t atlas-delta:latest .

# Run container
docker run -d \
  -p 8094:8094 \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=file:/app/data/atlas-delta.db \
  atlas-delta:latest
```

### Kubernetes (Coming Soon)

Example k8s deployment manifests will be added in a future release.

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation for API changes

---

## Roadmap

### v1.0.0 (Current)

- [x] Dataset management with CRUD operations
- [x] Data transformation pipeline
- [x] Lineage graph tracking
- [x] Quality check system
- [x] Pipeline orchestration
- [x] Alert management
- [x] React dashboard
- [x] Docker support
- [x] TypeScript everywhere
- [x] CI/CD pipeline

### v1.1.0 (Planned)

- [ ] Authentication and authorization
- [ ] WebSocket real-time updates
- [ ] Advanced lineage visualization
- [ ] Scheduled pipeline execution

### v1.2.0 (Planned)

- [ ] Multi-source connector framework
- [ ] Data export/import features
- [ ] Advanced analytics dashboard
- [ ] API rate limiting and quotas

### v2.0.0 (Future)

- [ ] Distributed processing
- [ ] Kafka/Stream integration
- [ ] GraphQL API
- [ ] Advanced ML pipelines

---

## License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## Support

- **Documentation**: [atlas-delta.dev](https://atlas-delta.dev)
- **Issues**: [GitHub Issues](https://github.com/Brainfeed-1996/atlas-delta/issues)
- **Discord**: [Join our community](https://discord.gg/atlas-delta)

---

## Acknowledgments

- [Prisma](https://prisma.io) - Amazing ORM
- [Express](https://expressjs.com) - Web framework
- [React](https://react.dev) - UI library
- [Turborepo](https://turbo.build) - Build system
- [pnpm](https://pnpm.io) - Package manager

---

<div align="center">

**Made with ❤️ by the Atlas Delta Team**

*Stars are welcome! ⭐*

</div>