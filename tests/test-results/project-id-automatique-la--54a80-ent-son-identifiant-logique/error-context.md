# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/id-automatique.spec.js >> la saisie du titre d’un nouveau projet crée automatiquement son identifiant logique
- Location: specs/e2e/project/id-automatique.spec.js:5:1

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.click: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('body')
    - locator resolved to <body>…</body>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

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
  5  | test('la saisie du titre d’un nouveau projet crée automatiquement son identifiant logique', async ({ page }) => {
  6  |   page.on('console', msg => console.log(msg.text()))
  7  |   console.log('\n=== TEST AUTO ID PROJET ===\n')
  8  |   const projectsPath = path.resolve('../data/projects.json')
  9  |   console.log('-> ouverture application')
  10 |   await page.goto('/')
  11 |   console.log(await page.content())
  12 |   console.log('-> création nouveau projet')
> 13 |   await page.locator('body').click()
     |                              ^ Error: locator.click: Test timeout of 15000ms exceeded.
  14 |   await page.keyboard.press('n')
  15 |   console.log(await page.locator('#main-panel').innerHTML())
  16 |   const inputs = page.locator('input')
  17 |   console.log('-> vérification présence champs édition')
  18 |   await expect(inputs).toHaveCount(2)
  19 |   console.log('-> saisie titre projet : "Ça c’est un Été Super !"')
  20 |   await inputs.nth(0).fill('Ça c’est un Été Super !')
  21 |   await inputs.nth(0).press('a')
  22 |   await inputs.nth(0).press('Backspace')
  23 |   console.log('-> vérification id auto généré')
  24 |   await expect(inputs.nth(1)).toHaveValue('ca-cest-un-ete-super')
  25 |   console.log('-> validation création')
  26 |   await page.keyboard.press('Enter')
  27 |   console.log('-> lecture backend')
  28 |   const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))
  29 |   console.log(projects)
  30 |   console.log('-> vérification persistance')
  31 |   expect(projects.item_ids).toContain('ca-cest-un-ete-super')
  32 |   console.log('\n=== FIN TEST AUTO ID PROJET ===\n')
  33 | })
```