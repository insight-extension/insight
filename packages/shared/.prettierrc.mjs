/**
 * @type {import('prettier').Options}
 */
export default {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "none",
  bracketSpacing: true,
  bracketSameLine: false,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^react(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@shared/(.*)$",
    "^[./]"
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
};

//todo: reuse in all packages
