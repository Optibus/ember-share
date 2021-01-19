module.exports = {
  globals: {
    describe: "readonly",
    beforeEach: "readonly",
    afterEach: "readonly",
    it: "readonly",
    Ember: "readonly",
  },
  extends: ["eslint:recommended", "airbnb-base", "plugin:prettier/recommended"],
};