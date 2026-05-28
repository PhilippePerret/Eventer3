# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/id-automatique.spec.js >> la saisie du titre d’un nouveau projet crée automatiquement son identifiant logique
- Location: specs/e2e/project/id-automatique.spec.js:5:1

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
      - generic [ref=e4]: Ça c’est un Été Super !
      - generic [ref=e5]: ca-cest-un-ete-super
    - generic [ref=e6]:
      - generic [ref=e7]: project-a
      - generic [ref=e8]: project-a
    - generic [ref=e9]:
      - generic [ref=e10]: project-b
      - generic [ref=e11]: project-b
    - generic [ref=e12]:
      - generic [ref=e13]: project-c
      - generic [ref=e14]: project-c
    - generic [ref=e15]:
      - generic [ref=e16]: Projet caché
      - generic [ref=e17]: project-hidden
  - contentinfo "Raccourcis clavier" [ref=e18]
```

# Test source

```ts
  1  | import fs from 'fs'
  2  | import path from 'path'
  3  | import { test, expect } from '../../e2e/__setup__.js'
  4  | 
  5  | test('la saisie du titre d’un nouveau projet crée automatiquement son identifiant logique', async ({ page }) => {
  6  |   console.log('\n=== TEST AUTO ID PROJET ===\n')
  7  |   const projectsPath = path.resolve('../data/lof-projects.json')
  8  |   console.log('-> ouverture application')
  9  |   await page.goto('/')
  10 |   console.log(await page.content())
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