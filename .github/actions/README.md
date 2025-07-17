# Custom GitHub Actions for Blog Service

This directory contains custom GitHub Actions designed specifically for the blog service project. These actions encapsulate common workflows and can be reused across different jobs and workflows.

## 🎯 Available Custom Actions

### 1. Setup Node.js Test Environment
**Path**: `.github/actions/setup-node-test-env`

Sets up Node.js environment with dependency caching and installation.

#### Inputs
- `node-version` (default: '18'): Node.js version to use
- `cache-dependency-path` (default: 'package-lock.json'): Path to lockfile
- `install-dependencies` (default: 'true'): Whether to install dependencies

#### Outputs
- `cache-hit`: Whether dependencies were restored from cache

#### Usage
```yaml
- name: Setup Node.js Test Environment
  uses: ./.github/actions/setup-node-test-env
  with:
    node-version: '18'
```

### 2. Setup MongoDB
**Path**: `.github/actions/setup-mongodb`

Starts MongoDB service and optionally seeds the database for testing.

#### Inputs
- `mongodb-version` (default: '6.0'): MongoDB version
- `mongodb-port` (default: '27017'): MongoDB port
- `database-name` (default: 'blogservice-testdb'): Test database name
- `seed-database` (default: 'false'): Whether to seed database
- `seed-script` (default: 'seed.js'): Path to seed script

#### Outputs
- `mongodb-uri`: MongoDB connection URI

#### Usage
```yaml
- name: Setup MongoDB for Testing
  uses: ./.github/actions/setup-mongodb
  with:
    database-name: 'my-test-db'
    seed-database: 'true'
```

### 3. Lint and Test
**Path**: `.github/actions/lint-and-test`

Runs ESLint and Jest tests with coverage reporting.

#### Inputs
- `skip-lint` (default: 'false'): Whether to skip linting
- `skip-tests` (default: 'false'): Whether to skip tests
- `test-timeout` (default: '10000'): Test timeout in milliseconds
- `coverage` (default: 'true'): Whether to generate coverage

#### Outputs
- `lint-result`: Linting result status
- `test-result`: Test result status

#### Usage
```yaml
- name: Lint and Test
  uses: ./.github/actions/lint-and-test
  with:
    coverage: 'true'
    test-timeout: '30000'
```

### 4. Docker Build and Deploy
**Path**: `.github/actions/docker-deploy`

Builds Docker images and optionally pushes to registry.

#### Inputs
- `image-name` (required): Docker image name
- `image-tag` (default: 'latest'): Docker image tag
- `dockerfile-path` (default: './Dockerfile'): Path to Dockerfile
- `context-path` (default: '.'): Build context path
- `push-to-registry` (default: 'false'): Whether to push to registry
- `registry-username`: Docker registry username
- `registry-password`: Docker registry password
- `build-args`: Build arguments for Docker build

#### Outputs
- `image-id`: Built Docker image ID
- `image-digest`: Built Docker image digest

#### Usage
```yaml
- name: Build and Push Docker Image
  uses: ./.github/actions/docker-deploy
  with:
    image-name: 'myrepo/blog-service'
    image-tag: 'v1.0.0'
    push-to-registry: 'true'
    registry-username: ${{ secrets.DOCKER_USERNAME }}
    registry-password: ${{ secrets.DOCKER_PASSWORD }}
```

## 🚀 Available Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)
**Triggers**: Push to main/develop, Pull requests to main

**Jobs**:
- **test**: Runs linting and tests with MongoDB
- **build**: Builds Docker image
- **deploy-staging**: Deploys to staging (develop branch)
- **deploy-production**: Deploys to production (main branch)

### 2. Development Testing (`dev-test.yml`)
**Triggers**: Manual workflow dispatch

**Features**:
- Optional database seeding
- Optional coverage reporting
- Database connection testing

### 3. Database Maintenance (`database-maintenance.yml`)
**Triggers**: Weekly schedule, Manual dispatch

**Operations**:
- Database seeding
- Database backup
- Test data cleanup

## 🔧 Setup Instructions

### 1. Required Secrets
Add these secrets to your GitHub repository:

```
DOCKER_USERNAME: Your Docker Hub username
DOCKER_PASSWORD: Your Docker Hub password or access token
```

### 2. Environment Configuration
The workflows use these environment variables:
- `NODE_VERSION`: Node.js version (default: '18')
- `SECRET_KEY`: Application secret key
- `PORT`: Application port (default: 3003)

### 3. Repository Setup
1. Ensure your repository has the custom actions in `.github/actions/`
2. Add the workflow files to `.github/workflows/`
3. Configure repository secrets
4. Update Docker image names in workflows to match your registry

## 📝 Best Practices

### Using Custom Actions
1. **Version Control**: Tag your custom actions for better version control
2. **Testing**: Test custom actions in a separate branch before merging
3. **Documentation**: Keep action documentation up to date
4. **Error Handling**: Include proper error handling in action scripts

### Workflow Optimization
1. **Caching**: Actions include dependency caching for faster builds
2. **Parallelization**: Jobs run in parallel where possible
3. **Conditional Execution**: Use conditions to skip unnecessary steps
4. **Artifact Management**: Upload important artifacts with retention policies

### Security
1. **Secrets**: Never hardcode secrets in workflows
2. **Permissions**: Use minimal required permissions
3. **Environment Protection**: Use environment protection rules for production

## 🔄 Extending the Actions

### Adding New Actions
1. Create a new directory under `.github/actions/`
2. Add an `action.yml` file with proper metadata
3. Include all required inputs, outputs, and steps
4. Test thoroughly before using in production workflows

### Modifying Existing Actions
1. Update the action.yml file
2. Test changes in a development workflow
3. Update documentation
4. Consider backward compatibility

## 📊 Monitoring and Debugging

### Workflow Monitoring
- Check the Actions tab in your GitHub repository
- Monitor workflow run times and success rates
- Set up notifications for failed workflows

### Debugging Tips
1. Use `echo` statements for debugging
2. Check action outputs and step results
3. Review logs for error messages
4. Test locally when possible

## 🤝 Contributing

When contributing to these custom actions:
1. Follow the existing code style
2. Add appropriate error handling
3. Update documentation
4. Test changes thoroughly
5. Consider impact on existing workflows
