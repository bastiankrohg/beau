export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^pages/(.*)$': '<rootDir>/pages/$1',
    '^lib/(.*)$': '<rootDir>/lib/$1',
    '^sequelize/(.*)$': '<rootDir>/sequelize/$1',
  },
};