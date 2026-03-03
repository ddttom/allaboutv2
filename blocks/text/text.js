/**
 * @file text.js
 * @description External dependency from sibling repository
 * @version 1.0
 * @author Tom Cranstoun
 *
 * @mx:category mx-tools
 * @mx:status active
 * @mx:contentType script
 * @mx:tags tool
 * @mx:partOf mx-os
 */
// External dependency from sibling repository
// eslint-disable-next-line import/no-unresolved, import/no-absolute-path
import { renderExpressions } from '../../../../../../../plusplus/plugins/expressions/src/expressions.js';

export default function decorate(block) {
  renderExpressions(block.querySelector('.text-wrapper') || block);
}
