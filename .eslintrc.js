// .eslintrc.js — Configuración de ESLint (análisis estático de código)
// ============================================================
// ESLint analiza el código SIN ejecutarlo (SAST básico).
// Detecta errores comunes, malas prácticas y problemas de estilo.
// En el pipeline CI/CD, si ESLint falla → el pipeline se detiene.
// ============================================================
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
    // Errores que deben corregirse (impiden merge)
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'no-console': 'off', // Permitimos console en backend

    // Buenas prácticas de seguridad
    'no-eval': 'error',          // eval() es un riesgo de seguridad (XSS)
    'no-implied-eval': 'error',  // setTimeout("código", 1000) también
    'no-new-func': 'error',      // new Function() similar a eval

    // Estilo de código
    'eqeqeq': 'error',           // Siempre === en vez de ==
    'curly': 'error',            // Siempre llaves en if/for/while
    'semi': ['error', 'always'], // Punto y coma obligatorio
  },
};
