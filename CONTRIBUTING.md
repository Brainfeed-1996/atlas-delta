# Contributing to Atlas Delta

Thank you for your interest in contributing to Atlas Delta! This guide will help you get started with contributing to our project.

## Table of Contents

- [Code of Conduct](#code-of-coderconduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guide](#style-guide)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our full [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

### Key Points

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0
- **Git**
- **Docker** (optional, for containerized development)

### Installation

1. **Fork the repository**

   Click the "Fork" button on the [repository page](https://github.com/Brainfeed-1996/atlas-delta).

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/atlas-delta.git
   cd atlas-delta
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/Brainfeed-1996/atlas-delta.git
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

---

## Development Setup

### Environment Configuration

Create a `.env` file in the root directory:

```bash
# API Configuration
PORT=8094
NODE_ENV=development
DATABASE_URL=file:./data/atlas-delta.db
LOG_LEVEL=debug
CORS_ORIGINS=*
```

### Database Setup

```bash
# Generate Prisma Client
pnpm --filter @atlas-delta/api db:generate

# Push schema to database
pnpm --filter @atlas-delta/api db:push

# (Optional) Open Prisma Studio
pnpm --filter @atlas-delta/api db:studio
```

### Running the Project

#### Development Mode

```bash
# Run all services
pnpm dev

# Or run individual services
pnpm --filter @atlas-delta/api dev
pnpm --filter @atlas-delta/web dev
```

#### Docker Development

```bash
# Start all services with Docker
docker-compose up -d
```

---

## Making Changes

### Finding Issues

1. Check the [issue tracker](https://github.com/Brainfeed-1996/atlas-delta/issues) for open issues
2. Look for issues tagged with `good first issue` for beginners
3. Create a new issue if you find a bug or have a feature request

### Creating a Branch

```bash
# Ensure you're on the latest main
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Coding Guidelines

#### TypeScript

- Use TypeScript for all new code
- Avoid `any` - use `unknown` if type is truly unknown
- Prefer interfaces over types for object shapes
- Use strict null checking

#### Example

```typescript
// ✅ Good
interface Dataset {
  id: string;
  name: string;
  status: 'active' | 'deprecated' | 'archived';
  createdAt: Date;
}

// ❌ Avoid
type Dataset = {
  id: any;
  name: any;
  // ...
};
```

#### React Components

- Use functional components with hooks
- Use TypeScript interfaces for props
- Keep components small and focused
- Use meaningful names

```typescript
// ✅ Good
interface DatasetCardProps {
  dataset: Dataset;
  onDelete: (id: string) => void;
}

export function DatasetCard({ dataset, onDelete }: DatasetCardProps) {
  return (
    <div className="card">
      <h3>{dataset.name}</h3>
      <button onClick={() => onDelete(dataset.id)}>Delete</button>
    </div>
  );
}
```

#### Error Handling

- Use custom error classes for domain errors
- Always handle promises with try/catch or .catch()
- Log errors appropriately

```typescript
// ✅ Good
try {
  const result = await datasetService.findById(id);
  return result;
} catch (error) {
  logger.error('Failed to find dataset', error);
  throw new NotFoundError('Dataset');
}
```

---

## Submitting Changes

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

#### Examples

```bash
# Good commit messages
git commit -m "feat(datasets): add freshnes tracking"
git commit -m "fix(api): resolve validation error"
git commit -m "docs(readme): update installation guide"
```

### Creating a Pull Request

1. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**

   Go to the GitHub repository and click "New Pull Request".

3. **Fill in the template**

   ```markdown
   ## Description
   [Describe your changes]

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   [Describe testing performed]

   ## Checklist
   - [ ] Tests pass
   - [ ] Code follows style guidelines
   - [ ] Documentation updated
   ```

4. **Review Process**

   - Maintainers will review your code
   - Address any feedback promptly
   - Keep the PR updated with new commits

### Keeping Your PR Updated

```bash
# Update from upstream
git fetch upstream
git rebase upstream/main
git push --force-with-lease
```

---

## Style Guide

### ESLint & Prettier

We use ESLint and Prettier for code formatting:

```bash
# Check for errors
pnpm lint

# Format code
pnpm prettier --write .
```

### Pre-commit Hooks

We recommend installing pre-commit hooks:

```bash
# Enable pre-commit hooks
npx husky install
# or
pnpm prepare
```

### Import Organization

```typescript
// 1. External libraries
import React from 'react';
import { useState } from 'react';

// 2. Internal packages
import { logger } from '@atlas-delta/core';
import type { Dataset } from '@atlas-delta/models';

// 3. Relative imports
import { datasetService } from '../services/dataset.service';
import { validate } from '../middleware/validation';

// 4. Types
import type { Request, Response } from 'express';
```

### File Naming

- **TypeScript files**: `kebab-case.ts` or `camelCase.ts`
- **React components**: `PascalCase.tsx`
- **Tests**: `name.test.ts` or `name.spec.ts`

---

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test --coverage

# Watch mode
pnpm test --watch

# Specific package
pnpm --filter @atlas-delta/api test
```

### Writing Tests

#### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { datasetService } from './dataset.service';

describe('DatasetService', () => {
  it('should create a dataset', async () => {
    const dataset = await datasetService.create({
      name: 'test-dataset',
      sourceType: 'api'
    });
    
    expect(dataset.name).toBe('test-dataset');
    expect(dataset.id).toBeDefined();
  });
});
```

#### Integration Tests

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from './app';

describe('API', () => {
  it('should return health check', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
```

### Test Coverage

We aim for:
- **Unit tests**: 80%+ coverage
- **Integration tests**: All API endpoints
- **E2E tests**: Critical user flows

---

## Documentation

### Updating Documentation

When you make changes, update the relevant documentation:

1. **README.md** - Overview and setup
2. **docs/** - Detailed technical docs
3. **Inline comments** - Complex logic
4. **JSDoc** - Public APIs

### API Documentation

If you add or modify API endpoints, update the [API Reference](README.md#api-reference) in README.md.

### Example Documentation

```typescript
/**
 * Creates a new dataset.
 * 
 * @param data - The dataset creation data
 * @param data.name - Unique name for the dataset
 * @param data.sourceType - Type of data source
 * @returns The created dataset
 * 
 * @throws {BadRequestError} If validation fails
 * @throws {ConflictError} If dataset name already exists
 * 
 * @example
 * const dataset = await datasetService.create({
 *   name: 'customer-data',
 *   sourceType: 'api'
 * });
 */
async create(data: CreateDatasetInput): Promise<Dataset> {
  // Implementation
}
```

---

## Recognition

Contributors will be recognized in:

- README.md contributors section
- GitHub release notes
- Project documentation

---

## Getting Help

- **Discord**: [Join our community](https://discord.gg/atlas-delta)
- **GitHub Issues**: [Open an issue](https://github.com/Brainfeed-1996/atlas-delta/issues)
- **Discussions**: [Ask questions](https://github.com/Brainfeed-1996/atlas-delta/discussions)

---

## Thank You!

Your contributions make Atlas Delta better. We appreciate every contribution, whether it's:

- 🐛 Reporting a bug
- 💡 Suggesting a feature
- 📝 Writing documentation
- 💻 Coding a new feature
- 🎨 Designing user interfaces
- 🔍 Testing the application

Thank you for being part of our community!