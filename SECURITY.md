# Security Policy

## Reporting Security Vulnerabilities

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### Reporting Process

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. **Email** the security team at: security@atlas-delta.dev
3. **Include** the following information:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (optional)

### Response Timeline

| Timeline | Action |
|----------|--------|
| 24 hours | Acknowledge receipt of report |
| 7 days | Initial assessment and triage |
| 30 days | Status update and remediation plan |

## Scope

This security policy covers:

- Atlas Delta API (`apps/api`)
- Atlas Delta Web Dashboard (`apps/web`)
- Core packages (`packages/core`, `packages/models`)
- CI/CD pipelines (`.github/workflows/`)

### Out of Scope

- Third-party dependencies (report to upstream maintainers)
- Social engineering attacks
- Physical security

## Security Measures

### Implemented Protections

1. **Input Validation**
   - Zod schema validation on all inputs
   - SQL injection prevention via Prisma
   - XSS prevention via React

2. **Security Headers**
   - Helmet.js for HTTP security headers
   - CORS configuration
   - Content Security Policy

3. **Rate Limiting**
   - Express rate limiter configured
   - Configurable thresholds

4. **Data Protection**
   - SQLite database with file-level encryption (optional)
   - No sensitive data in logs

### Future Security Features

- JWT authentication
- Role-based access control
- Audit logging
- API key management

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x | ✅ |
| 0.x.x | ⚠️ Security updates only |

## Security Best Practices for Deployment

### Production Checklist

- [ ] Use strong database passwords
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set appropriate rate limits
- [ ] Enable security headers
- [ ] Monitor for anomalies
- [ ] Regular security updates
- [ ] Backup database regularly

### Environment Variables

```bash
# Required for production
NODE_ENV=production
DATABASE_URL=file:/path/to/secure/db
CORS_ORIGINS=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=warn
```

## Vulnerability Disclosure

We support coordinated vulnerability disclosure. If you discover vulnerabilities:

1. Report privately to security@atlas-delta.dev
2. Allow reasonable time for remediation
3. Do not publicly disclose until fixed
4. Credit researchers in release notes (opt-in)

## Security Contact

For security-related inquiries:
- **Email**: security@atlas-delta.dev
- **PGP Key**: Available on request

---

Thank you for helping keep Atlas Delta secure!