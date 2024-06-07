import { createExpression } from "/plusplus/plugins/expressions/src/expressions.js";

// a sample expression, expands the text in the siteConfig, from the args
createExpression("expand", ({ args }) => {
  return window.siteConfig?.[args];
});
