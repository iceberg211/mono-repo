const path = require('path');

const jsdomSetup = '<rootDir>/jest.setup.jsdom.ts';

const createProject = ({ name, environment, setupFilesAfterEnv = [] }) => ({
  displayName: name,
  preset: 'ts-jest',
  testEnvironment: environment,
  testMatch: [path.join('<rootDir>', `packages/${name}/src/**/*.test.ts?(x)`)],
  moduleNameMapper: {
    '^@iceberg/(.*)$': '<rootDir>/packages/$1/src/index'
  },
  setupFilesAfterEnv,
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: path.join('<rootDir>', `packages/${name}/tsconfig.json`)
      }
    ]
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
});

module.exports = {
  projects: [
    createProject({ name: 'hooks', environment: 'jsdom', setupFilesAfterEnv: [jsdomSetup] }),
    createProject({ name: 'lib', environment: 'node' }),
    createProject({ name: 'ui', environment: 'jsdom', setupFilesAfterEnv: [jsdomSetup] })
  ]
};
