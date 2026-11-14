// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // 1. Базовые правила для JavaScript
  js.configs.recommended,

  // 2. Рекомендуемые правила для TypeScript
  ...tseslint.configs.recommended,

  {
    // Применяем к файлам TypeScript
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true, // Связываем с tsconfig.json для глубокой проверки
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        // Разрешаем браузерные глобальные переменные, чтобы ESLint не ругался
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        console: "readonly",
        alert: "readonly",
        confirm: "readonly",
        setTimeout: "readonly",
        URLSearchParams: "readonly",
      },
    },
    rules: {
      // Ваши правила (можно оставить пустым или добавить свои)
      "no-unused-vars": "off", // Отключаем базовое правило (TS-версия работает лучше)
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "off",
    },
  },
  {
    // Игнорируем скомпилированные файлы и node_modules
    ignores: ["dist/**", "node_modules/**", "eslint.config.js"],
  },
);
