# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/id-automatique.spec.js >> la saisie du titre d’un nouveau projet crée automatiquement son identifiant logique
- Location: specs/e2e/project/id-automatique.spec.js:7:6

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  locator('input').nth(1)
Expected: "ca-cest-un-ete-super"
Received: ""
Timeout:  5000ms

Call log:
  - Expect "toHaveValue" with timeout 5000ms
  - waiting for locator('input').nth(1)
    14 × locator resolved to <input name="id" type="text" class="project-item__id" placeholder="identifiant"/>
       - unexpected value ""

```

```yaml
- textbox "identifiant"
```

# Test source

```ts
  1  | import fs from 'fs'
  2  | 
  3  | import path from 'path'
  4  | 
  5  | import { test, expect } from '@playwright/test'
  6  | 
  7  | test.only('la saisie du titre d’un nouveau projet crée automatiquement son identifiant logique', async ({ page }) => {
  8  | 
  9  |   page.on('console', msg => console.log(msg.text()))
  10 | 
  11 |   console.log('\n=== TEST AUTO ID PROJET ===\n')
  12 | 
  13 |   const projectsPath = path.resolve('../data/projects.json')
  14 | 
  15 |   console.log('-> ouverture application')
  16 | 
  17 |   await page.goto('/')
  18 | 
  19 |   console.log('-> création nouveau projet')
  20 | 
  21 |   await page.locator('body').click()
  22 |   await page.keyboard.press('n')
  23 | 
  24 |   console.log(await page.locator('#main-panel').innerHTML())
  25 | 
  26 |   const inputs = page.locator('input')
  27 | 
  28 |   console.log('-> vérification présence champs édition')
  29 | 
  30 |   await expect(inputs).toHaveCount(2)
  31 | 
  32 |   console.log('-> saisie titre projet : "Ça c’est un Été Super !"')
  33 | 
  34 |   await inputs.nth(0).fill('Ça c’est un Été Super !')
  35 | 
  36 |   console.log('-> vérification id auto généré')
  37 | 
> 38 |   await expect(inputs.nth(1)).toHaveValue('ca-cest-un-ete-super')
     |                               ^ Error: expect(locator).toHaveValue(expected) failed
  39 | 
  40 |   console.log('-> validation création')
  41 | 
  42 |   await page.keyboard.press('Enter')
  43 | 
  44 |   console.log('-> lecture backend')
  45 | 
  46 |   const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))
  47 | 
  48 |   console.log('-> vérification persistance')
  49 | 
  50 |   expect(projects.some(project => project.id === 'ca-cest-un-ete-super')).toBeTruthy()
  51 | 
  52 |   console.log('\n=== FIN TEST AUTO ID PROJET ===\n')
  53 | 
  54 | })
```