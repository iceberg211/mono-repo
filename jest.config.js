const path = require('path');

const createProject = ({ name, environment }) => ({
  displayName: name,
  preset: 'ts-jest',
  testEnvironment: environment,
  testMatch: [path.join('<rootDir>', `packages/${name}/src/**/*.test.ts?(x)`)],
  moduleNameMapper: {
    '^@iceberg/(.*)$': '<rootDir>/packages/$1/src/index'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: path.join('<rootDir>', `packages/${name}/tsconfig.json`)
    }
  }
});

module.exports = {
  projects: [
    createProject({ name: 'hooks', environment: 'jsdom' }),
    createProject({ name: 'lib', environment: 'node' }),
    createProject({ name: 'ui', environment: 'jsdom' })
  ]
};
