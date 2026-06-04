# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/shortcuts-panel.spec.js >> le panneau des raccourcis contient la touche ⌦ (supprimer)
- Location: specs/e2e/ui/shortcuts-panel.spec.js:14:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#shortcuts-panel')
Expected substring: "⌦"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#shortcuts-panel')

```

```yaml
- main:
  - heading "Liste des projets" [level=1]
  - text: Projet A project-a Projet B project-b
- contentinfo "Raccourcis clavier": ↑ ↓ choisir ⏎ renommer n nouveau projet ⌥n nouveau projet sous le projet courant ⌘↑ ⌘↓ déplacer ⌦ supprimer → ouvrir
```

# Test source

```ts
  1  | import { test, expect } from '../__setup__.js'
  2  | 
  3  | // Le panneau des raccourcis s'ouvre avec la touche ? (Shift+,)
  4  | // Il se ferme avec ⌘+Enter (comme tout panneau modal)
  5  | // Il affiche TOUS les raccourcis de l'application
  6  | 
  7  | test('la touche ? ouvre le panneau des raccourcis', async ({ page }) => {
  8  |   await page.goto('/')
  9  |   await expect(page.locator('#shortcuts-panel')).not.toBeVisible()
  10 |   await page.keyboard.press('?')
  11 |   await expect(page.locator('#shortcuts-panel')).toBeVisible()
  12 | })
  13 | 
  14 | test('le panneau des raccourcis contient la touche ⌦ (supprimer)', async ({ page }) => {
  15 |   await page.goto('/')
  16 |   await page.keyboard.press('?')
> 17 |   await expect(page.locator('#shortcuts-panel')).toContainText('⌦')
     |                                                  ^ Error: expect(locator).toContainText(expected) failed
  18 | })
  19 | 
  20 | test('le panneau des raccourcis ferme avec ⌘+Enter', async ({ page }) => {
  21 |   await page.goto('/')
  22 |   await page.keyboard.press('?')
  23 |   await expect(page.locator('#shortcuts-panel')).toBeVisible()
  24 |   await page.keyboard.press('Meta+Enter')
  25 |   await expect(page.locator('#shortcuts-panel')).not.toBeVisible()
  26 | })
  27 | 
  28 | test('après fermeture du panneau, l\'EventLister reste actif (navigation fonctionne)', async ({ page }) => {
  29 |   await page.goto('/')
  30 |   await page.keyboard.press('?')
  31 |   await page.keyboard.press('Meta+Enter')
  32 |   await expect(page.locator('#shortcuts-panel')).not.toBeVisible()
  33 |   // La navigation au clavier doit de nouveau fonctionner
  34 |   const items = page.locator('.project-item')
  35 |   await expect(items.nth(0)).toHaveClass(/selected/)
  36 |   await page.keyboard.press('ArrowDown')
  37 |   await expect(items.nth(1)).toHaveClass(/selected/)
  38 | })
  39 | 
```