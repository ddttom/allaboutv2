/**
 * @file text.js
 * @description text
 * @version 1.0
 * @author Tom Cranstoun
 *
 * @mx:category mx-tools
 * @mx:status active
 * @mx:contentType script
 * @mx:tags tool
 * @mx:partOf mx-os
 */
/*eslint-disable import/no-absolute-path */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved*/
import { renderExpressions } from '/plusplus/plugins/expressions/src/expressions.js';

export default function decorate(block) {
  renderExpressions(document.querySelector('.text-wrapper'));
}
