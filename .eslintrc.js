module.exports = {
  extends: 'eslint-config-semistandard',
  plugins: ['chai-friendly'],
  rules: {
    'no-var': 'off',
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': 2
  },
  globals: {
    L: false
  },
  ignorePatterns: ['spec/**/*.js', 'eslintrc.js']
};
