# Atlas Delta Roadmap

## Version History

- [v0.x](#v0x---legacy) - Legacy version (deprecated)
- [v1.0.0](#v100---current) - Current stable release
- [v1.1.0](#v110---planned) - Next planned release
- [v1.2.0](#v120---planned) - Future release
- [v2.0.0](#v200---vision) - Long-term vision

---

## v0.x - Legacy

> ⚠️ **Deprecated** - This version is no longer maintained.

Initial scaffold with basic functionality:

- Simple HTTP server
- Basic dataset model
- Minimal documentation
- No database persistence

---

## v1.0.0 - Current

> ✅ **Current Stable** - Released April 2025

### Completed Features

#### Core Platform

- [x] **Dataset Management**
  - CRUD operations
  - Multiple source types (API, Database, File, Stream, Webhook)
  - Status tracking (active, deprecated, archived)
  - Freshness monitoring

- [x] **Data Transformation**
  - Transformation types (filter, aggregate, enrich, validate, normalize, join)
  - Configuration management
  - Enable/disable toggle
  - Order-based execution

- [x] **Pipeline Orchestration**
  - Create and manage pipelines
  - Schedule configuration (cron)
  - Run history tracking
  - Status monitoring

- [x] **Data Lineage**
  - Graph-based lineage tracking
  - Node and edge management
  - Data flow visualization (future UI)
  - Dependency tracking

- [x] **Quality Checks**
  - Rule types (not_null, unique, range, regex, custom)
  - Automated execution
  - Status tracking (passed, failed, warning)
  - Failed record counting

- [x] **Alert System**
  - Severity levels (info, warning, error, critical)
  - Read/unread tracking
  - Bulk actions
  - Association with datasets and pipelines

#### Technical Features

- [x] **TypeScript** - Full type safety
- [x] **Database** - SQLite with Prisma ORM
- [x] **API** - RESTful Express.js API
- [x] **Validation** - Zod schema validation
- [x] **Security** - Helmet, CORS, rate limiting
- [x] **Web Dashboard** - React SPA
- [x] **Docker** - Containerization
- [x] **CI/CD** - GitHub Actions pipeline

### Architecture

```
atlas-delta/
├── apps/
│   ├── api/          # Express.js API
│   └── web/          # React Dashboard
├── packages/
│   ├── core/         # Shared utilities
│   └── models/       # Domain types
└── docs/             # Documentation
```

### Breaking Changes from v0.x

- Migration from JavaScript to TypeScript
- New database schema (Prisma)
- Updated API endpoints
- New web application

---

## v1.1.0 - Planned

> 📅 **Target: Q3 2025**

### Features

#### Authentication & Authorization

- [ ] **JWT Authentication**
  - User registration and login
  - Token refresh mechanism
  - Password hashing (bcrypt)

- [ ] **Role-Based Access Control**
  - Roles: Admin, Operator, Viewer
  - Permission system
  - API endpoint protection

#### Real-time Features

- [ ] **WebSocket Support**
  - Live metrics updates
  - Alert notifications
  - Pipeline status changes

#### Lineage Visualization

- [ ] **Interactive Graph UI**
  - Drag and drop nodes
  - Zoom and pan
  - Node details on click
  - Edge highlighting

#### API Enhancements

- [ ] **OpenAPI/Swagger Documentation**
  - Auto-generated API docs
  - Interactive API explorer
  - Schema definitions

- [ ] **Bulk Operations**
  - Bulk dataset create/update
  - Batch quality checks
  - Bulk delete with confirmation

### Technical Improvements

- [ ] **Error Handling Refinement**
  - Custom error classes
  - Global error boundaries (React)
  - Error tracking integration

- [ ] **Performance Optimization**
  - Database query optimization
  - Response caching
  - Pagination improvements

---

## v1.2.0 - Planned

> 📅 **Target: Q4 2025**

### Features

#### Data Connectors

- [ ] **PostgreSQL Connector**
  - Native PostgreSQL support
  - Connection pooling
  - Query optimization

- [ ] **S3 Connector**
  - CSV/JSON/Parquet support
  - Partition handling
  - Incremental sync

- [ ] **REST API Connector**
  - Configurable endpoints
  - Pagination handling
  - Authentication support

#### Data Export

- [ ] **Export Formats**
  - CSV export
  - JSON export
  - SQL dump

- [ ] **Scheduled Exports**
  - Cron-based export jobs
  - Export to S3
  - Email notifications

#### Analytics Dashboard

- [ ] **Metrics Visualization**
  - Time-series charts
  - Dataset growth trends
  - Quality score tracking
  - Pipeline duration graphs

- [ ] **Custom Reports**
  - Report builder
  - Scheduled reports
  - PDF export

---

## v2.0.0 - Vision

> 🔮 **Long-term Vision** - 2026+

### Architecture Overhaul

#### Distributed Processing

- [ ] **Message Queue Integration**
  - Apache Kafka support
  - Event-driven architecture
  - Async pipeline execution

- [ ] **Worker Nodes**
  - Horizontal scaling
  - Distributed transformations
  - Fault tolerance

#### Data Warehouse

- [ ] **PostgreSQL Warehouse**
  - Columnar storage
  - Advanced analytics
  - Time-series support

- [ ] **Data Lake**
  - S3-based storage
  - Multiple format support
  - Tiered storage

### Advanced Features

#### ML Pipeline Integration

- [ ] **Model Registry**
  - Model versioning
  - Metadata tracking
  - A/B testing support

- [ ] **Feature Store**
  - Feature engineering
  - Feature sharing
  - Online/offline features

#### GraphQL API

- [ ] **GraphQL Gateway**
  - Schema stitching
  - Federation
  - Real-time subscriptions

### Platform Enhancements

#### Multi-tenant Support

- [ ] **Tenant Isolation**
  - Namespace management
  - Resource quotas
  - Usage metering

#### Marketplace

- [ ] **Plugin System**
  - Custom transformations
  - Source connectors
  - Visualization widgets

---

## Feature Priority Matrix

| Priority | Feature | Version | Status |
|----------|---------|---------|--------|
| P0 | Dataset CRUD | 1.0.0 | ✅ |
| P0 | Pipeline Orchestration | 1.0.0 | ✅ |
| P0 | Quality Checks | 1.0.0 | ✅ |
| P1 | Authentication | 1.1.0 | 📋 |
| P1 | WebSocket Updates | 1.1.0 | 📋 |
| P1 | Lineage Visualization | 1.1.0 | 📋 |
| P2 | PostgreSQL Connector | 1.2.0 | 📋 |
| P2 | Analytics Dashboard | 1.2.0 | 📋 |
| P3 | Kafka Integration | 2.0.0 | 🔮 |
| P3 | GraphQL API | 2.0.0 | 🔮 |

### Priority Legend

- **P0** - Must have (MVP)
- **P1** - Should have (v1.x)
- **P2** - Nice to have (v1.2)
- **P3** - Future vision (v2.0)

---

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH
```

- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes

### Release Schedule

| Version | Type | Target |
|---------|------|--------|
| 1.0.0 | Major | April 2025 |
| 1.0.1 | Patch | May 2025 |
| 1.1.0 | Minor | Q3 2025 |
| 1.2.0 | Minor | Q4 2025 |
| 2.0.0 | Major | 2026 |

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog entries added
- [ ] Version bump in package.json
- [ ] Git tag created
- [ ] Docker image published
- [ ] npm packages published (if applicable)

---

## Contributing to Roadmap

We welcome community input! To propose features:

1. **Open an Issue** - Describe your feature request
2. **Discussion** - Community and maintainers discuss
3. **Priority Assignment** - Team assigns priority
4. **Implementation** - Feature is scheduled and implemented

### Feature Request Template

```markdown
## Feature Name
### Description
[Clear description of the feature]

### Use Case
[Why is this needed?]

### Alternatives Considered
[Other solutions considered]

### Priority
[P0/P1/P2/P3]
```

---

## Historical Releases

### v0.1.0 (March 2024)
- Initial scaffold
- Basic HTTP server
- Sample datasets
- Minimal documentation

### v0.2.0 (June 2024)
- Added transformations
- Added lineage basics
- Improved documentation

---

## Future Considerations

### Potential Features

These are under consideration but not yet scheduled:

- [ ] Graph-based transformations
- [ ] Version control for transformations
- [ ] Data masking/anonymization
- [ ] Data sharing between tenants
- [ ] Audit trail
- [ ] Data retention policies

---

## Contact

For roadmap discussions:
- GitHub Issues: https://github.com/Brainfeed-1996/atlas-delta/issues
- Discord: https://discord.gg/atlas-delta
- Email: contact@atlas-delta.dev

---

<div align="center">

**Last Updated:** April 2025  
**Next Release:** v1.1.0 (Q3 2025)

</div>