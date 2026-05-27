# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/id-automatique.spec.js >> la saisie du titre d’un nouveau projet crée automatiquement son identifiant logique
- Location: specs/e2e/project/id-automatique.spec.js:5:6

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: "ca-cest-un-ete-super"
Received array: ["project-a", "project-b", "project-c", "project-hidden"]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]: Ça c’est un Été Super !
        - generic [ref=e6]: ca-cest-un-ete-super
      - generic [ref=e7]:
        - generic [ref=e8]: Projet A
        - generic [ref=e9]: project-a
      - generic [ref=e10]:
        - generic [ref=e11]: Projet B
        - generic [ref=e12]: project-b
      - generic [ref=e13]:
        - generic [ref=e14]: Projet C
        - generic [ref=e15]: project-c
  - contentinfo "Raccourcis clavier" [ref=e16]
```

# Test source

```ts
  1  | import fs from 'fs'
  2  | import path from 'path'
  3  | import { test, expect } from '@playwright/test'
  4  | 
  5  | test.only('la saisie du titre d’un nouveau projet crée automatiquement son identifiant logique', async ({ page }) => {
  6  |   page.on('console', msg => console.log(msg.text()))
  7  |   console.log('\n=== TEST AUTO ID PROJET ===\n')
  8  |   const projectsPath = path.resolve('../data/projects.json')
  9  |   console.log('-> ouverture application')
  10 |   await page.goto('/')
  11 |   console.log('-> création nouveau projet')
  12 |   await page.locator('body').click()
  13 |   await page.keyboard.press('n')
  14 |   console.log(await page.locator('#main-panel').innerHTML())
  15 |   const inputs = page.locator('input')
  16 |   console.log('-> vérification présence champs édition')
  17 |   await expect(inputs).toHaveCount(2)
  18 |   console.log('-> saisie titre projet : "Ça c’est un Été Super !"')
  19 |   await inputs.nth(0).fill('Ça c’est un Été Super !')
  20 |   await inputs.nth(0).press('a')
  21 |   await inputs.nth(0).press('Backspace')
  22 |   console.log('-> vérification id auto généré')
  23 |   await expect(inputs.nth(1)).toHaveValue('ca-cest-un-ete-super')
  24 |   console.log('-> validation création')
  25 |   await page.keyboard.press('Enter')
  26 |   console.log('-> lecture backend')
  27 |   const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))
  28 |   console.log(projects)
  29 |   console.log('-> vérification persistance')
> 30 |   expect(projects.item_ids).toContain('ca-cest-un-ete-super')
     |                             ^ Error: expect(received).toContain(expected) // indexOf
  31 |   console.log('\n=== FIN TEST AUTO ID PROJET ===\n')
  32 | })
```