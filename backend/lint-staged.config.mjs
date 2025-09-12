export default {
  // Run ESLint on all staged files
  '*.{js,mjs,cjs,ts,tsx}': ['eslint --fix'],

  // un Prettier on staged files
  '*.{js,mjs,cjs,ts,tsx,json,md,yml,yaml}': ['prettier --write'],
};
