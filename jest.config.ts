import type { Config } from '@jest/types';

const isDebugging = process.execArgv.some(arg => /^--inspect/.test(arg));
const testTimeoutSeconds = isDebugging ? 1 : 1800;

const config: Config.InitialOptions = {
  clearMocks: true,
  fakeTimers: {
    enableGlobally: true,
  },
  slowTestThreshold: testTimeoutSeconds,
  testTimeout: testTimeoutSeconds * 1000,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
};
export default config;
