import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import pluginQuery from "@tanstack/eslint-plugin-query";

// 便于 vscode 监测到 type，便于编写提示
/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    ...reactPlugin.configs.flat.recommended, // react recommend
    settings: {
      react: {
        version: "detect", // 让 ESLint 自动检测项目中使用的 React 版本，并根据检测到的版本调整相关的 React 规则。
      },
    },
  },
  reactPlugin.configs.flat["jsx-runtime"], // 这个配置的主要作用与 React 17 及以后版本引入的新 JSX 转换机制有关。React 17 引入了新的 JSX 转换方式，不再要求在使用 JSX 的文件中显式导入 React (`import React from 'react'`)。不配置这个，会报错 'React' must be in scope when using JSX
  ...pluginQuery.configs["flat/recommended"], // 可以检测 useQuery 里的 queryKey 是否缺失
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }, // 例如 globals.browser 里面有 window、document 等。eslint 配置 globals 可以让 eslint 识别出这些全局对象，如果不配置， eslint 会报错 window is not defined。
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // 支持 jsx 语法，不配置(设置为 false) eslint 会报语法错误
        },
      },
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
    },
  },
  prettier, // 关掉 (disable) 所有和 Prettier 冲突的 ESLint 规则，写在最后
];
