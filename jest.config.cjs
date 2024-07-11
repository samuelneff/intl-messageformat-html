/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  // 'ts-jest': {
  //   tsconfig: './tsconfig.test.json'
  // }
  // globals: {
  transform: {
    "^.+.tsx?$": [
      "ts-jest",
      {
        tsconfig: './tsconfig.json'
      }
    ],
  },
};
