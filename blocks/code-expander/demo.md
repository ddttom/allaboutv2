# 

| index |
| :---- |

# Code Expander Block

The Code Expander block is a versatile component designed to enhance code display and interaction on web pages. It provides syntax highlighting for various programming languages, line numbers for JavaScript, and offers a convenient copy-to-clipboard functionality with customizable appearance and improved user interaction.

## Features

1. Syntax highlighting for multiple languages:  
   - JavaScript (with line numbers)  
   - CSS  
   - HTML  
   - JSON  
   - Markdown  
   - Terminal commands  
2. Automatic language detection based on code content  
3. Copy-to-clipboard functionality with visual feedback  
4. Line numbers for JavaScript code  
5. Expand/collapse functionality for long code snippets (more than 80 lines)  
6. Accessibility considerations (ARIA labels)  
7. Responsive design  
8. Customizable appearance for buttons and code background  
9. Visual feedback for hover and focus states on buttons

## Usage

To use the Code Expander block in your Franklin project:

1. Place the code-expander.js file in the blocks/code-expander/ directory.  
2. Mark text with a courier font in the document, triggering autoblocking.  
3. Use the CodeExpander block once in the document

The component will automatically detect the language and apply appropriate styling and functionality.

## Authoring

When creating content in Google Docs or Microsoft Word, use the following structure, once in the document.  I usually put this at the end:  
![][image1]

## Examples

### CSS Example

`.code-expander {`      
    `background-color: #f8f8f8;`  
     `border: 1px solid #ddd;`  
     `border-radius: 4px;`  
     `padding: 1rem;`  
     `font-family: 'Courier New', monospace;`  
 `}`

 `.code-expander pre {`  
     `margin: 0;`  
     `white-space: pre-wrap;`  
 `}`

### HTML Example

`<!DOCTYPE html>`  
`<html lang="en">`

`<head>`  
    `<meta charset="UTF-8">`  
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`  
    `<title>Code Expander Demo</title>`  
`</head>`

`<body>`  
    `<h1>Welcome to Code Expander</h1>`  
    `<div class="code-expander">`  
        `<!-- Your code here -->`  
    `</div>`  
`</body>`

`</html>`

# 

### JSON Example

`{`  
    `"name": "Code Expander",`  
     `"version": "1.0.0",`  
     `"description": "A versatile code display component",`  
      `"features":`   
                        `["Syntax highlighting",`   
                         `"Copy to clipboard",`   
                         `"Expand/collapse long snippets"],`  
     `"supported_languages":`   
                        `["JavaScript", "CSS", "HTML", "JSON", "Markdown"]`  
 `}`

### 

###   Markdown Example

`# Markdown Example`  
`## Features`   
`Syntax highlighting- Copy to clipboard- Expand/collapse long snippets`  
`## Usage`  
`1. Add the code-expander.js file to your project`  
`2. Use the autoblock - courier font in your Google Doc.`  
`3. Add the code-expander block to the foot of your document`    
`Enjoy the enhanced code display!`

### 

### Terminal Commands Example

`ls index.html styles.css script.js`

### 

### Long Code Example (with expand/collapse)

`// This is a long code example to demonstrate the expand/collapse`  
`function generateFibonacciSequence(n) {`  
    `const sequence = [0, 1];`  
    `for (let i = 2; i < n; i++) {`  
        `sequence[i] = sequence[i - 1] + sequence[i - 2];`  
    `}`  
    `return sequence;`  
`}`  
`function isPrime(num) {`  
    `if (num <= 1) return false;`  
    `for (let i = 2; i <= Math.sqrt(num); i++) {`  
        `if (num % i === 0) return false;`  
    `}`  
    `return true;`  
`}`  
`function generatePrimes(n) {`  
    `const primes = [];`  
    `let num = 2;`  
    `while (primes.length < n) {`  
        `if (isPrime(num)) {`  
            `primes.push(num);`  
        `}`  
        `num++;`  
    `}`  
    `return primes;`  
`}`  
`console.log("Fibonacci Sequence (first 20 numbers):");`  
`console.log(generateFibonacciSequence(20));`  
`console.log("Prime Numbers (first 20 primes):");`  
`console.log(generatePrimes(20));`  
`function isPrime(num) {`  
    `if (num <= 1) return false;`  
    `for (let i = 2; i <= Math.sqrt(num); i++) {`  
        `if (num % i === 0) return false;`  
    `}`  
    `return true;`  
`}`  
`function generatePrimes(n) {`  
    `const primes = [];`  
    `let num = 2;`  
    `while (primes.length < n) {`  
        `if (isPrime(num)) {`  
            `primes.push(num);`  
        `}`  
        `num++;`  
    `}`  
    `return primes;`  
`}`  
`console.log("Fibonacci Sequence (first 20 numbers):");`  
`console.log(generateFibonacciSequence(20));`  
`console.log("Prime Numbers (first 20 primes):");`  
`console.log(generatePrimes(20));`  
`function isPrime(num) {`  
    `if (num <= 1) return false;`  
    `for (let i = 2; i <= Math.sqrt(num); i++) {`  
        `if (num % i === 0) return false;`  
    `}`  
    `return true;`  
`}`  
`function generatePrimes(n) {`  
    `const primes = [];`  
    `let num = 2;`  
    `while (primes.length < n) {`  
        `if (isPrime(num)) {`  
            `primes.push(num);`  
        `}`  
        `num++;`  
    `}`  
    `return primes;`  
`}`  
`console.log("Fibonacci Sequence (first 20 numbers):");`  
`console.log(generateFibonacciSequence(20));`  
`console.log("Prime Numbers (first 20 primes):");`  
`console.log(generatePrimes(20));`  
`function isPrime(num) {`  
    `if (num <= 1) return false;`  
    `for (let i = 2; i <= Math.sqrt(num); i++) {`  
        `if (num % i === 0) return false;`  
    `}`  
    `return true;`  
`}`  
`function generatePrimes(n) {`  
    `const primes = [];`  
    `let num = 2;`  
    `while (primes.length < n) {`  
        `if (isPrime(num)) {`  
            `primes.push(num);`  
        `}`  
        `num++;`  
    `}`  
    `return primes;`  
`}`  
`console.log("Fibonacci Sequence (first 20 numbers):");`  
`console.log(generateFibonacciSequence(20));`  
`console.log("Prime Numbers (first 20 primes):");`  
`console.log(generatePrimes(20));`

This demo showcases the Code Expander block's ability to handle various programming languages, provide syntax highlighting, and offer expand/collapse functionality for long code snippets. Users can interact with the copy buttons and expand/collapse features to experience the full functionality of the block.

| code-expander |
| :---- |

| metadata |  |
| :---- | :---- |
| title | Code Expander Block Demo |
| description | A demonstration of the Code Expander block functionality |
| json-ld | article |
| image | [https://allabout.network/media\_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) |
| author | Tom Cranstoun |
| longdescription | This page showcases the Code Expander block, demonstrating its syntax highlighting capabilities for various programming languages, copy-to-clipboard functionality, and expand/collapse feature for long code snippets. |

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAloAAABcCAYAAAC2nRveAAAAAXNSR0IArs4c6QAADs5JREFUeF7t3QeMVdUWh/GFvWNBwG6MvZfR2FEMNlQMIAh2sGLvnaLSrImgQKyx95bYwIIdO1iDvXfBXrDMy7derhl4Yxxk9gvc+51kosycu+8+v7uVf9ba50yL+vr6+vBQQAEFFFBAAQUUaHaBFgatZjd1QAUUUEABBRRQIAUMWi4EBRRQQAEFFFCgkIBBqxCswyqggAIKKKCAAgYt14ACCiiggAIKKFBIwKBVCNZhFVBAAQUUUEABg5ZrQAEFFFBAAQUUKCRg0CoE67AKKKCAAgoooIBByzWggAIKKKCAAgoUEjBoFYJ1WAUUUEABBRRQwKDlGlBAAQUUUEABBQoJGLQKwTqsAgoooIACCihg0HINKKCAAgoooIAChQQMWoVgHVYBBRRQQAEFFCgetP788894+OGHlVZAAQUUUEABBWZagZYtW0ZdXV2zz6940Pr555+jVatW0alTp2afvAMqoIACCiiggAIzKvDDDz/EF198EePGjZvRof7n9f+XoLXqqqvG+++/3+yTd0AFFFBAAQUUUGBGBd55553o2bOnQWtGIX29AgoooIACCigwrYBByzWhgAIKKKCAAgo0QeDDDz+MKVOmNOHMiLnmmiuWWWaZMGg1icuTFFBAAQUUUKDWBZ599tlo27Ztkxg+++yz2HDDDQ1aTdLyJAUUUEABBRSoeYGnn346Vl555SY5TJw4MTbeeGODVpO0PEkBBRRQQAEFal7AoFXzS0AABRRQQAEFFCglYNAqJeu4CiiggAIKKFDzApWgxWOlLrjggvjtt9+mMplzzjnjuOOOi6WXXjpsHf6L5fLLL7/E999/H/PNN19+tWjR4l+MMmu85I8//ggessbT9+eff/68e8JDAQUUUECBWhZoWNEiSF1++eX5dyXHAgssEPvvv3+stNJK+WeD1nSuFILH6DGjY/iwYdGtW/fYfffdY+65557OUWad0z/55JO45JJL8mm2vXr1ig022GDWmbwzVUABBRRQoIDAtK3Dl19+OW688cYsvJAL1lhjjb/e1aA1nR/A77//nsn1oIMOipNPPjlOO+20rGpV6/HWW2/FscceG++9914MHTo0tt9++2q9VK9LAQUUUECBJgk0tkfrxRdfjNlmmy3WWWedqcaoiaBF2+vNN9/ML0p79Ewp6bVp0yYx+F2JBIm33347fv3112jdunWsvfbasdBCC2U65eegfv7557HIIosEz88gYFWCFr3Y119/PQglVLwYn8rP37XZ6OU2dj5zeeONN/JXCS255JKx2mqrxZdffpnfq6+vj0022SQ++uijnOcKK6wQPJuDStMSSyyR6XnRRRcNguC7776bX/xsnnnmidVXXz2/uDbe97vvvstzP/300/j2229jqaWWyuulNcjBa1966aXsOXP9l112WXz88cd/Ba2vvvoqXnnllXz/BRdcMNZcc81YbrnlgpYq3//xxx/z2vn58ssvn9fBPDwUUEABBRSoBgE3w0/zKT722GMxcuTIePLJJzME8Jf/FltsEf369QtC0gMPPBCXXnppTJgwIUPVsssuG7vsskscdthhsfDCC8dFF12UYYMnwfJ01znmmCOee+65DFqnnnpqPPLIIzn+M888E7PPPnuOT5ttv/32y3Tb8CAw3XvvvY2e36NHj7jrrrvi7LPPzuBC1YxQd9NNN8VWW22V873yyivztWuttVaGQ+ZUeT9+hxJPnh0xYkQGQwIRwY+Ads4552RIHDRoUDz66KMZMglPnMP19u/fP7beeuv83imnnBKPP/54vpbAN2nSpOw5U9Faf/3104I5EaSo5m222WZx+umnZzDln9jMO++8Ob+DDz44Dj/88HT0UEABBRRQoBoEDFoNPkVCwlFHHRU333xzdOvWLZ/OevXVV8fkyZMzXBE+Dj300KxG7bDDDvmkV/qsX3/9dQYaKlObb755BjRCAwHilltuycoQQWufffaJE088McMaPyeInXnmmdGqVau48847Y5VVVplqTRGMjjjiiBgzZsxU5y+22GJ5PpWfvn37xm233ZZVKqpShBnuaiAIEYgISwQfrotN+VwbVa0hQ4ZkteqKK67IChYPU7v44otj/Pjxuc+qY8eOeRfE9ddfn+GrS5cuMXbs2Bg9enTOies5//zzc/5cd4+ePWLC+Alx1VVXZcWLoEWFjfkR1PAknOJJmMKhT58+eR0Esvbt28d2220X7dq1y0DroYACCiigQDUIPP/8803eNkR+qKurq94HlhIyDjzwwHjttdey8kQAoPJE0CKIvPDCC7HHHnvEtttum0GCth+VI6o2nTt3zvDFxjbOfeqpp7L9RtAZPnx4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>