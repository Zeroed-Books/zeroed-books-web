// Ignore that this is not an ES module. It's only required by the ESLint typing
// configuration, and is not used to build the project.
// @ts-ignore

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "prettier",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    project: "./tsconfig.eslint.json",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "unused-imports"],

  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },

  rules: {
    // Prefer the "unused-imports" plugin which make errors autofixable.
    "@typescript-eslint/no-unused-vars": "off",

    // Prefer arrow functions for components because they are easier to add
    // typings to with `React.FC<Props>`.
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
      },
    ],

    // The `useForm` hook from Mantine recommends using prop spreading to pass
    // props to input components.
    "react/jsx-props-no-spreading": [
      "error",
      {
        exceptions: ["DatePicker", "PasswordInput", "TextInput"],
      },
    ],

    // We usually want props to be undefined. Typescript prevents usage of
    // undefined values.
    "react/require-default-props": "off",

    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },

  overrides: [
    {
      files: ["build.ts"],
      rules: {
        // The build file is used in a development environment, so it should be
        // allowed to import dev dependencies.
        "import/no-extraneous-dependencies": [
          "error",
          {
            devDependencies: true,
          },
        ],

        // The build script uses the console to output messages.
        "no-console": "off",

        // We don't care about resource consumption for the build script.
        "no-restricted-syntax": "off",
      },
    },
  ],
};
