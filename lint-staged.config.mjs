const lintStagedConfig = {
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{md,mdx,json,css,yml,yaml}": ["prettier --write"],
};

export default lintStagedConfig;
