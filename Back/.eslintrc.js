module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    rules: {
      'linebreak-style': 'off',
  },
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
  },
  ignorePatterns: ['tests', 'setupTests.js', '*.test.js', 'migrations', 'models'],
};
