/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    // Отключаем строгие правила именования классов (если мешают)
    "selector-class-pattern": null,
  },
  ignoreFiles: ["dist/**/*.css", "node_modules/**"],
};
