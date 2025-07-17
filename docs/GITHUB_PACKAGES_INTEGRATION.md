# GitHub Packages & Integration Tests Setup

This document explains the GitHub Packages integration and service container setup for running integration tests.

## 🎯 Overview

The project now includes:

1. **GitHub Packages Integration**: Docker images are built and stored in GitHub Container Registry
2. **Service Container Tests**: Integration tests run against the actual Docker container
3. **Complete CI/CD Pipeline**: Unit tests → Build → Integration tests → Deploy

## 🚀 GitHub Packages Setup

### Docker Image Registry
- **Registry**: `ghcr.io` (GitHub Container Registry)
- **Image Name**: `ghcr.io/{owner}/{repo}`
- **Authentication**: Uses `GITHUB_TOKEN` (automatic)

### Image Tagging Strategy
```bash
# Branch-based tags
ghcr.io/user/blog-service:main
ghcr.io/user/blog-service:develop

# SHA-based tags
ghcr.io/user/blog-service:main-abc1234

# Latest tag (for main branch)
ghcr.io/user/blog-service:latest
```

## 🧪 Integration Tests

### Test Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Test Runner   │    │  Blog Service   │    │    MongoDB      │
│   (GitHub       │───▶│   Container     │───▶│   Container     │
│    Actions)     │    │ (Service Under  │    │   (Database)    │
│                 │    │     Test)       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Service Containers
The workflow uses GitHub Actions service containers:

```yaml
services:
  mongodb:
    image: mongo:6.0
    env:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    ports:
      - 27017:27017

  blog-service:
    image: ${{ needs.build-and-push.outputs.image-tag }}
    env:
      NODE_ENV: test
      SECRET_KEY: test-secret-key
      MONGO_URL: mongodb://root:example@mongodb:27017/blogservice-testdb?authSource=admin
    ports:
      - 3003:3003
```

### Integration Test Cases

#### 1. Health Check Tests
- Service availability (`/api/ping`)
- Response time validation
- Container readiness verification

#### 2. User Management Tests
- User registration
- Authentication workflows
- JWT token validation
- Error handling for invalid credentials

#### 3. Blog Operations Tests
- CRUD operations (Create, Read, Update, Delete)
- Authorization checks
- Data validation
- Error handling

#### 4. Database Integration Tests
- Seeded data verification
- Database connectivity
- Data persistence
- Transaction handling

#### 5. Error Handling Tests
- Invalid endpoints
- Malformed requests
- Authentication failures
- Database connection issues

## 📊 Test Reports

### Artifacts Generated
- **Unit Test Results**: `test-results.xml`
- **Integration Test Results**: `integration-test-results.xml`
- **Coverage Reports**: HTML and LCOV formats
- **Test Summaries**: Displayed in GitHub Actions UI

### Artifact Storage
- **Retention**: 30 days for CI/CD, 7 days for dev tests
- **Format**: JUnit XML (compatible with GitHub test reporting)
- **Location**: Downloadable from Actions summary page

## 🔧 Workflows

### 1. Main CI/CD Workflow (`ci-cd-integration.yml`)
```
Unit Tests → Build & Push → Integration Tests → Deploy
     ↓             ↓              ↓            ↓
  Artifacts    GitHub       Service        Production/
             Packages     Containers       Staging
```

### 2. Development Integration Tests (`integration-test-dev.yml`)
- Manual trigger for testing specific image tags
- Shorter artifact retention
- Quick feedback for development

## 🚦 Running Integration Tests

### In GitHub Actions (Automatic)
Integration tests run automatically when:
- Code is pushed to `main` or `develop`
- Pull requests are opened to `main`
- After successful unit tests and image build

### Manual Testing (Development)
1. Build and push an image:
   ```bash
   docker build -t ghcr.io/user/blog-service:test .
   docker push ghcr.io/user/blog-service:test
   ```

2. Trigger the development workflow:
   - Go to Actions tab in GitHub
   - Select "Integration Test Development"
   - Click "Run workflow"
   - Enter the image tag to test

### Local Development (Limited)
For local development, you can run unit tests:
```bash
npm test                    # Unit tests
npm run test:coverage      # Unit tests with coverage
```

Note: Integration tests require the full containerized environment and are designed to run in GitHub Actions.

## 🏗️ Architecture Benefits

### 1. **True Integration Testing**
- Tests the actual Docker container that will be deployed
- Includes all dependencies and configurations
- Validates the complete application stack

### 2. **GitHub Packages Integration**
- Centralized image storage
- Automatic versioning and tagging
- Integration with GitHub security scanning

### 3. **Service Container Advantages**
- Isolated test environment
- Consistent across all runs
- No external dependencies
- Fast setup and teardown

### 4. **CI/CD Pipeline Integration**
- Automated testing at multiple levels
- Prevents broken deployments
- Fast feedback on failures
- Artifact storage for debugging

## 🔒 Security Considerations

### GitHub Packages
- Uses `GITHUB_TOKEN` for authentication
- Automatic cleanup of old images
- Vulnerability scanning included
- Private by default (configurable)

### Test Environment
- Isolated containers for each test run
- No persistent data between runs
- Environment variables for configuration
- No production data exposure

## 📈 Monitoring & Debugging

### Test Results
- Real-time results in GitHub Actions UI
- Downloadable artifacts for detailed analysis
- Integration with GitHub's test reporting
- Failure notifications and logs

### Container Logs
- Full container logs available in Actions
- Health check monitoring
- Startup and shutdown logs
- Error tracking and debugging

## 🚀 Future Enhancements

### Possible Improvements
1. **Performance Testing**: Add load testing to integration suite
2. **Security Testing**: Include security scans in the pipeline
3. **Multi-Environment**: Test against different Node.js/MongoDB versions
4. **Monitoring**: Add application performance monitoring
5. **Documentation**: Auto-generate API documentation from tests

This setup provides a robust foundation for continuous integration and deployment with comprehensive testing at multiple levels.
