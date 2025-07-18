# Blog Service

A Node.js blog service API built with Express.js, MongoDB, and JWT authentication.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Blog Management**: CRUD operations for blog posts
- **User Management**: User registration and profile management.
- **Testing Suite**: Comprehensive test coverage with Jest and Supertest
- **Dockerized**: Ready for containerized deployment
- **CI/CD Ready**: Custom GitHub Actions for automated testing and deployment

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose
- **CI/CD**: Custom GitHub Actions

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB 6.0 or higher
- Docker (optional)

## 🏃‍♂️ Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   MONGO_URL=mongodb://localhost:27017/blogservice
   TEST_MONGO_URL=mongodb://localhost:27017/blogservice-test
   SECRET_KEY=your-secret-key
   PORT=3003
   NODE_ENV=dev
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Seed the database (optional)**
   ```bash
   node seed.js
   ```

6. **Start the development server**
   ```bash
   npm run start:dev
   ```

### Using Docker Compose

```bash
docker-compose up -d
```

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run linting
```bash
npm run lint
```

## 🐳 Docker Deployment

### Build and run with Docker
```bash
# Build the image
docker build -t blog-service .

# Run the container
docker run -p 3003:3003 \
  -e MONGO_URL=mongodb://host.docker.internal:27017/blogservice \
  -e SECRET_KEY=your-secret-key \
  blog-service
```

### Use Docker Compose
```bash
docker-compose up -d
```

## 🔄 CI/CD with GitHub Actions

This project includes custom GitHub Actions for automated testing and deployment:

### Custom Actions Available:
- **Setup Node.js Test Environment**: Configures Node.js with dependency caching
- **Setup MongoDB**: Starts MongoDB service and optionally seeds data
- **Lint and Test**: Runs ESLint and Jest tests with coverage
- **Docker Build and Deploy**: Builds and pushes Docker images

### Workflows:
- **CI/CD Pipeline** (`ci-cd.yml`): Automated testing, building, and deployment
- **Development Testing** (`dev-test.yml`): Manual testing with database seeding
- **Database Maintenance** (`database-maintenance.yml`): Scheduled database operations

See [`.github/actions/README.md`](.github/actions/README.md) for detailed documentation.

## 📚 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/users` - User registration

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create new blog (requires authentication)
- `PUT /api/blogs/:id` - Update blog (requires authentication)
- `DELETE /api/blogs/:id` - Delete blog (requires authentication)

## 🗂️ Project Structure

```
blog-service/
├── .github/
│   ├── actions/           # Custom GitHub Actions
│   └── workflows/         # GitHub workflows
├── controllers/           # Route controllers
├── models/               # Mongoose models
├── tests/                # Test files
├── utils/                # Utility functions
├── app.js                # Express app configuration
├── index.js              # Application entry point
├── seed.js               # Database seeding script
├── Dockerfile            # Docker configuration
└── docker-compose.yaml   # Docker Compose configuration
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection URL | - |
| `TEST_MONGO_URL` | Test database URL | - |
| `SECRET_KEY` | JWT secret key | - |
| `PORT` | Server port | 3003 |
| `NODE_ENV` | Environment (dev/test/prod) | dev |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Prabesh Magar
