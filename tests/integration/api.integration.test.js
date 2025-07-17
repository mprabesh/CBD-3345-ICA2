const request = require('supertest');
const mongoose = require('mongoose');

// Integration tests for the running container
describe('Blog Service Integration Tests', () => {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3003';
  let authToken;
  let testUserId;
  let testBlogId;

  beforeAll(async () => {
    // Wait for the service to be ready
    await waitForService(baseUrl, 30000);
  });

  afterAll(async () => {
    // Clean up test data if needed
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  describe('Health Check', () => {
    test('should respond to ping endpoint', async () => {
      const response = await request(baseUrl)
        .get('/api/ping')
        .expect(200);
      
      expect(response.body).toEqual({ message: 'pong' });
    });
  });

  describe('User Registration and Authentication', () => {
    test('should register a new user', async () => {
      const newUser = {
        username: `testuser_${Date.now()}`,
        name: 'Test User',
        password: 'testpassword123'
      };

      const response = await request(baseUrl)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(newUser.username);
      expect(response.body.name).toBe(newUser.name);
      expect(response.body).not.toHaveProperty('password');
      
      testUserId = response.body.id;
    });

    test('should login with valid credentials', async () => {
      const loginCredentials = {
        username: `testuser_${testUserId ? testUserId.slice(-13) : Date.now()}`,
        password: 'testpassword123'
      };

      // First ensure user exists
      await request(baseUrl)
        .post('/api/users')
        .send({
          ...loginCredentials,
          name: 'Test User'
        })
        .expect(201);

      const response = await request(baseUrl)
        .post('/api/login')
        .send(loginCredentials)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('name');
      
      authToken = response.body.token;
    });

    test('should reject invalid login credentials', async () => {
      const invalidCredentials = {
        username: 'nonexistent',
        password: 'wrongpassword'
      };

      await request(baseUrl)
        .post('/api/login')
        .send(invalidCredentials)
        .expect(401);
    });
  });

  describe('Blog Operations', () => {
    test('should get all blogs', async () => {
      const response = await request(baseUrl)
        .get('/api/blogs')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Should have seeded data
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should create a new blog with authentication', async () => {
      if (!authToken) {
        // Create auth token if not available
        const user = {
          username: `bloguser_${Date.now()}`,
          name: 'Blog User',
          password: 'blogpassword123'
        };

        await request(baseUrl)
          .post('/api/users')
          .send(user)
          .expect(201);

        const loginResponse = await request(baseUrl)
          .post('/api/login')
          .send({
            username: user.username,
            password: user.password
          })
          .expect(200);

        authToken = loginResponse.body.token;
      }

      const newBlog = {
        title: 'Integration Test Blog',
        author: 'Test Author',
        url: 'https://test-blog.com',
        likes: 5
      };

      const response = await request(baseUrl)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newBlog.title);
      expect(response.body.author).toBe(newBlog.author);
      expect(response.body.url).toBe(newBlog.url);
      expect(response.body.likes).toBe(newBlog.likes);
      
      testBlogId = response.body.id;
    });

    test('should reject blog creation without authentication', async () => {
      const newBlog = {
        title: 'Unauthorized Blog',
        author: 'Test Author',
        url: 'https://test-blog.com'
      };

      await request(baseUrl)
        .post('/api/blogs')
        .send(newBlog)
        .expect(401);
    });

    test('should update blog likes', async () => {
      if (!testBlogId) {
        // Get first blog if testBlogId not available
        const blogsResponse = await request(baseUrl)
          .get('/api/blogs')
          .expect(200);
        
        testBlogId = blogsResponse.body[0].id;
      }

      const updatedData = { likes: 10 };

      const response = await request(baseUrl)
        .put(`/api/blogs/${testBlogId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.likes).toBe(updatedData.likes);
    });

    test('should delete blog with authentication', async () => {
      if (!authToken || !testBlogId) {
        // Skip if we don't have proper setup
        return;
      }

      await request(baseUrl)
        .delete(`/api/blogs/${testBlogId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify blog is deleted
      await request(baseUrl)
        .get(`/api/blogs/${testBlogId}`)
        .expect(404);
    });
  });

  describe('Database and Seeding', () => {
    test('should have seeded users', async () => {
      const response = await request(baseUrl)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Check for expected seeded user
      const seededUser = response.body.find(user => 
        user.username === 'testuser' || user.username === 'admin'
      );
      expect(seededUser).toBeDefined();
    });

    test('should have seeded blogs with proper structure', async () => {
      const response = await request(baseUrl)
        .get('/api/blogs')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check blog structure
      const blog = response.body[0];
      expect(blog).toHaveProperty('id');
      expect(blog).toHaveProperty('title');
      expect(blog).toHaveProperty('author');
      expect(blog).toHaveProperty('url');
      expect(blog).toHaveProperty('likes');
      expect(blog).toHaveProperty('user');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid blog ID', async () => {
      await request(baseUrl)
        .get('/api/blogs/invalid-id')
        .expect(400);
    });

    test('should handle non-existent blog', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(baseUrl)
        .get(`/api/blogs/${nonExistentId}`)
        .expect(404);
    });

    test('should handle malformed requests', async () => {
      await request(baseUrl)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken || 'invalid-token'}`)
        .send({ title: '' }) // Invalid blog data
        .expect(400);
    });
  });
});

// Helper function to wait for service to be ready
async function waitForService(url, timeout = 30000) {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    try {
      await request(url).get('/api/ping').timeout(1000);
      console.log('✅ Service is ready for integration tests');
      return;
    } catch (error) {
      console.log('⏳ Waiting for service to be ready...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw new Error(`Service not ready after ${timeout}ms`);
}
