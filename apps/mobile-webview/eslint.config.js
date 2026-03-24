const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");

module.exports = [
  ...expoConfig,
  prettierConfig,
  {
    plugins: {
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".expo/**",
      "babel.config.js",
      "metro.config.js",
      "eslint.config.js",
    ],
  },
];
