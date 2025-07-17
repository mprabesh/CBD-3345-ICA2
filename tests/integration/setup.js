// Integration test setup
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Global setup for integration tests
beforeAll(async () => {
  console.log('🚀 Setting up integration test environment...');
  
  // Set test timeout for all tests
  jest.setTimeout(60000);
  
  // Additional setup if needed
}, 30000);

afterAll(async () => {
  console.log('🧹 Cleaning up integration test environment...');
  
  // Clean up any test data or connections
}, 10000);
