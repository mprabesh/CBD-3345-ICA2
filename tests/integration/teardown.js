// Integration test teardown
module.exports = async () => {
  console.log('🏁 Integration tests completed');
  
  // Close any remaining connections
  if (global.__MONGO_CONNECTION__) {
    await global.__MONGO_CONNECTION__.close();
  }
  
  // Clean up any test artifacts
  process.exit(0);
};
