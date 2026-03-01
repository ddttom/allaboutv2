// External dependency from sibling repository
// eslint-disable-next-line import/no-unresolved, import/no-absolute-path
import { renderExpressions } from '../../../../../../../plusplus/plugins/expressions/src/expressions.js';

export default function decorate(block) {
  renderExpressions(block.querySelector('.text-wrapper') || block);
}
