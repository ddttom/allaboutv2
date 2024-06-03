import { createExpression } from '/plusplus/plugins/expressions/src/expressions.js';
createExpression("expand", ({ args }) => {
  return window.siteConfig?.[args];
});