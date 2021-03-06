module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['prettier'],
  extends: ['plugin:vue/essential', '@vue/airbnb', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': 'off',
    'no-param-reassign': 'off',
    'func-names': 'off',
    'no-caller': 'off',
    'no-restricted-properties': 'off',
    'prefer-destructuring': 'off',
    'prettier/prettier': ['error']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
