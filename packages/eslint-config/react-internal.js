const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "eslint:recommended",
    "plugin:import/recommended",
    "prettier",
    "turbo",
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    browser: true,
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [".*.js", "node_modules/", "dist/"],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
  rules: {
    "no-restricted-syntax": ["off"],
    "react-hooks/exhaustive-deps": "warn",
    "react/function-component-definition": [
      0,
      {
        namedComponents:
          "function-declaration" | "function-expression" | "arrow-function",
      },
    ],
    "import/prefer-default-export": ["off"],
    "import/no-extraneous-dependencies": "off",
    "no-console": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ],
    "react/jsx-filename-extension": [0],
    "import/extensions": "off",
  },
};
