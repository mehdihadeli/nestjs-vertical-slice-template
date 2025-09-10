import type { Config } from 'jest';

export default {
  displayName: 'ts-only',
  preset: 'ts-jest',
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  testEnvironment: 'node',
  rootDir: '.',
  testRegex: '.*\\.test\\.ts$',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
  },
  testTimeout: 30000,
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
} satisfies Config;
