module.exports = {
  extends: [
    'airbnb-typescript',
  ],
  parserOptions: {
    project: './tsconfig-lint.json',
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'max-len': [2, 120],
    'react/static-property-placement': [2, 'static public field'],
  },
};
