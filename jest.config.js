module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    // Add other aliases if you have them, e.g., for assets or styles if imported in JS
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
