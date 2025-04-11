import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended, // 推荐规则
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }, // 例如 globals.browser 里面有 window、document 等。eslint 配置 globals 可以让 eslint 识别出这些全局对象，如果不配置， eslint 会报错 window is not defined。
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  prettier, // 关掉 (disable) 所有和 Prettier 冲突的 ESLint 规则，写在最后
];
