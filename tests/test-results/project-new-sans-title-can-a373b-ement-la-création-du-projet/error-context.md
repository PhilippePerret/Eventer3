# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/new-sans-title-cancel-create.spec.js >> la touche Entrée sans titre annule complètement la création du projet
- Location: specs/e2e/project/new-sans-title-cancel-create.spec.js:5:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.project-item')
Expected: 3
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.project-item')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [active]:
  - main
  - contentinfo "Raccourcis clavier" [ref=e1]
```

# Test source

```ts
  1  | import fs from 'fs'
  2  | import path from 'path'
  3  | import { test, expect } from '@playwright/test'
  4  | 
  5  | test('la touche Entrée sans titre annule complètement la création du projet', async ({ page }) => {
  6  | 
  7  |   console.log('\n=== TEST VALIDATION VIDE NOUVEAU PROJET ===\n')
  8  | 
  9  |   const projectsPath = path.resolve('../data/projects.json')
  10 | 
  11 |   console.log('-> ouverture application')
  12 |   await page.goto('/')
  13 | 
  14 |   const itemsBefore = page.locator('.project-item')
  15 | 
  16 |   console.log('-> vérification nombre initial projets')
> 17 |   await expect(itemsBefore).toHaveCount(3)
     |                             ^ Error: expect(locator).toHaveCount(expected) failed
  18 | 
  19 |   console.log('-> vérification sélection initiale')
  20 |   await expect(itemsBefore.nth(0)).toHaveClass(/selected/)
  21 |   await expect(itemsBefore.nth(1)).not.toHaveClass(/selected/)
  22 |   await expect(itemsBefore.nth(2)).not.toHaveClass(/selected/)
  23 | 
  24 |   console.log('-> lecture backend avant création')
  25 |   const projectsBefore = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))
  26 | 
  27 |   console.log('-> création nouveau projet')
  28 |   await page.keyboard.press('n')
  29 | 
  30 |   console.log('-> validation vide')
  31 |   await page.keyboard.press('Enter')
  32 | 
  33 |   const itemsAfter = page.locator('.project-item')
  34 | 
  35 |   console.log('-> vérification nombre final projets')
  36 |   await expect(itemsAfter).toHaveCount(3)
  37 | 
  38 |   console.log('-> vérification disparition inputs')
  39 |   await expect(page.locator('input')).toHaveCount(0)
  40 | 
  41 |   console.log('-> vérification restauration sélection')
  42 |   await expect(itemsAfter.nth(0)).toHaveClass(/selected/)
  43 |   await expect(itemsAfter.nth(1)).not.toHaveClass(/selected/)
  44 |   await expect(itemsAfter.nth(2)).not.toHaveClass(/selected/)
  45 | 
  46 |   console.log('-> lecture backend après validation vide')
  47 |   const projectsAfter = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))
  48 | 
  49 |   console.log('-> vérification backend inchangé')
  50 |   expect(projectsAfter).toEqual(projectsBefore)
  51 | 
  52 |   console.log('\n=== FIN TEST VALIDATION VIDE NOUVEAU PROJET ===\n')
  53 | 
  54 | })
```