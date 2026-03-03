/**
 * @file helloworld.js
 * @description helloworld
 * @version 1.0
 * @author Tom Cranstoun
 *
 * @mx:category mx-tools
 * @mx:status active
 * @mx:contentType script
 * @mx:tags tool
 * @mx:partOf mx-os
 */
export default function decorate(block) {
  const greeting = document.createElement('div');
  greeting.textContent = 'Hello World';
  block.textContent = '';
  block.appendChild(greeting);
}
