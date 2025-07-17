module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/integration/**/*.test.js'],
  testTimeout: 60000,
  verbose: true,
  collectCoverage: false,
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.js'],
  globalTeardown: '<rootDir>/tests/integration/teardown.js',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results-integration',
        outputName: 'integration-test-results.xml',
        uniqueOutputName: false,
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true
      }
    ]
  ]
};
