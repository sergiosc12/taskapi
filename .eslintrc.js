
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'no-console': 'off', 

    'no-eval': 'error',         
    'no-implied-eval': 'error',  
    'no-new-func': 'error',     

    'eqeqeq': 'error',        
    'curly': 'error',            
    'semi': ['error', 'always'],
  },
};
