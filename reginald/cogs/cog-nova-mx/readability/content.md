---
name: readability
version: 0.1.0
description: Plain language and reading level analysis

created: 2026-02-06T12:31:00Z
modified: 2026-02-06T12:31:00Z

author: Maxine (MX - Machine eXperience Engine)
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: draft

category: mx-core
partOf: mx-core
refersTo: [clarity, a11y]
tags: [readability, plain-language, content, accessibility, clarity]

execute:
  runtime: runbook
  command: mx cog readability
  actions:
    - name: analyze
      description: Analyze text readability
      usage: mx cog readability analyze <url|file>
      inputs:
        - name: source
          type: string
          required: true
          description: URL or file to analyze
      outputs:
        - name: analysis
          type: object
          description: Readability scores and metrics
    
    - name: score
      description: Get readability score summary
      usage: mx cog readability score <url|file>
      inputs:
        - name: source
          type: string
          required: true
          description: URL or file to score
      outputs:
        - name: score
          type: object
          description: Overall readability score
    
    - name: simplify
      description: Suggest simplifications for complex text
      usage: mx cog readability simplify <url|file>
      inputs:
        - name: source
          type: string
          required: true
          description: URL or file to simplify
        - name: target
          type: string
          required: false
          description: Target reading level (grade 6, grade 8, etc.)
          default: "grade 8"
      outputs:
        - name: suggestions
          type: array
          description: Simplification suggestions
    
    - name: compare
      description: Compare readability of two documents
      usage: mx cog readability compare <source1> <source2>
      inputs:
        - name: source1
          type: string
          required: true
          description: First document
        - name: source2
          type: string
          required: true
          description: Second document
      outputs:
        - name: comparison
          type: object
          description: Side-by-side readability comparison

requires:
  bins: []
  cogs: [clarity]

mx:
  contentType: "action-doc"
  runbook: "mx exec readability"
  convergence: true
  accessibility: true
  semantic: true
---

# readability

Plain language and reading level analysis.

## Purpose

Complex writing fails everyone:

- **AI agents** struggle with jargon and convoluted sentences
- **Non-native speakers** miss nuance
- **People in a hurry** skim and misunderstand
- **Cognitive disabilities** create barriers

Plain language is a convergence issue. Write clearly, reach everyone.

## Usage

### Full Analysis

```bash
mx cog readability analyze https://example.com/article
mx cog readability analyze ./document.md
```

**Output:**

```json
{
  "metrics": {
    "fleschKincaid": 10.2,
    "fleschReadingEase": 58.4,
    "gunningFog": 12.1,
    "smog": 9.8,
    "colemanLiau": 11.3,
    "automatedReadability": 10.5
  },
  "averageGradeLevel": 10.6,
  "readingLevel": "College freshman",
  "stats": {
    "words": 1245,
    "sentences": 68,
    "paragraphs": 12,
    "avgWordsPerSentence": 18.3,
    "avgSyllablesPerWord": 1.6,
    "complexWords": 89,
    "complexWordPercentage": 7.1
  }
}
```

### Quick Score

```bash
mx cog readability score https://example.com/article
```

**Output:**

```json
{
  "score": 58.4,
  "grade": 10,
  "level": "Fairly Difficult",
  "audience": "High school senior / College freshman",
  "recommendation": "Consider simplifying for broader audience"
}
```

### Simplify Suggestions

```bash
mx cog readability simplify ./document.md --target "grade 8"
```

**Output:**

```json
{
  "currentGrade": 10.6,
  "targetGrade": 8,
  "suggestions": [
    {
      "original": "utilize",
      "suggestion": "use",
      "location": "paragraph 3"
    },
    {
      "original": "The implementation of the aforementioned methodology",
      "suggestion": "Using this method",
      "location": "paragraph 5"
    },
    {
      "original": "45-word sentence about...",
      "suggestion": "Split into 2-3 shorter sentences",
      "location": "paragraph 7"
    }
  ]
}
```

## Readability Scales

### Flesch Reading Ease

| Score | Difficulty | Audience |
|-------|------------|----------|
| 90-100 | Very Easy | 5th grade |
| 80-90 | Easy | 6th grade |
| 70-80 | Fairly Easy | 7th grade |
| 60-70 | Standard | 8th-9th grade |
| 50-60 | Fairly Difficult | 10th-12th grade |
| 30-50 | Difficult | College |
| 0-30 | Very Difficult | College graduate |

### Flesch-Kincaid Grade Level

Maps directly to US grade levels:

- 6.0 = 6th grade (11-12 years old)
- 8.0 = 8th grade (13-14 years old)
- 12.0 = 12th grade (17-18 years old)

## Plain Language Guidelines

### Do

- Use common words
- Write short sentences (15-20 words average)
- Use active voice
- One idea per paragraph
- Use headings and lists

### Don't

- Use jargon without explanation
- Write sentences over 25 words
- Use passive voice excessively
- Bury key information
- Assume prior knowledge

## Target Levels

| Content Type | Target Grade | Flesch Score |
|--------------|--------------|--------------|
| Public web content | 6-8 | 70-80 |
| Technical docs | 8-10 | 60-70 |
| Legal/medical | 10-12 | 50-60 |
| Academic | 12+ | 30-50 |

## Related

- [clarity cog](clarity.md)
- [Plain Language Guidelines](https://www.plainlanguage.gov/guidelines/)
- [Hemingway App](https://hemingwayapp.com/)
