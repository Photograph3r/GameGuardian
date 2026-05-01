module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(firebase|@firebase)/)',
  ],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$': '<rootDir>/src/__mocks__/AsyncStorage.ts',
    '^firebase/(.*)$': '<rootDir>/src/__mocks__/firebase.ts',
  },
};