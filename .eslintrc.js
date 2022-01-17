module.exports = {
  extends: [
    'airbnb',
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
    'class-methods-use-this': 0,
    'import/no-import-module-exports': 0,
    'max-len': [2, 120],
    'react/jsx-no-useless-fragment': 0,
    'react/no-unused-class-component-methods': 0,
    'react/static-property-placement': [2, 'static public field'],
  },
};
