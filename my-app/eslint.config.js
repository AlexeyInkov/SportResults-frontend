import js from '@eslint/js'
import vuePlugin from 'eslint-plugin-vue'
import vueTsParser from 'vue-eslint-parser'

export default [
  js.configs.recommended,
  ...vuePlugin.configs['flat/essential'],
  {
    files: ['**/*.vue', '**/*.js'],
    languageOptions: {
      parser: vueTsParser,
      parserOptions: {
        parser: '@babel/eslint-parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false
      }
    },
    rules: {
      // override/add rules settings here
      'no-undef': 'off',  // Отключаем правило no-undef, так как добавляем глобальные переменные
      'no-unused-vars': 'warn',  // Меняем уровень для no-unused-vars на предупреждение
      'no-prototype-builtins': 'off',  // Отключаем правило для hasOwnProperty
      'no-setter-return': 'off',  // Отключаем правило для setter возвращающих значение
      'no-empty': 'off',  // Отключаем правило для пустых блоков
      'no-cond-assign': 'off',  // Отключаем правило для присваивания в условии
      'no-useless-escape': 'off'  // Отключаем правило для ненужных экранирований
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        location: 'readonly',
        history: 'readonly',
        Event: 'readonly',
        MutationObserver: 'readonly',
        Element: 'readonly',
        SVGElement: 'readonly',
        MathMLElement: 'readonly',
        self: 'readonly',
        global: 'readonly'
      }
    }
  }
]
