# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/new-event-titre-vide.spec.js >> Escape avec titre vide dans lister vide : pas de page blanche
- Location: specs/e2e/event/new-event-titre-vide.spec.js:44:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.event-item input[name="title"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.event-item input[name="title"]')

```

```yaml
- main:
  - navigation:
    - button
    - text: ‹
- text: DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('many-events')
  6  | })
  7  | 
  8  | // many-events : project-b n'a pas d'events → lister virtuel à l'entrée
  9  | 
  10 | async function enterVirtualEventLister(page) {
  11 |   await page.goto('/')
  12 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  13 |   await page.keyboard.press('ArrowDown')
  14 |   await expect(page.locator('.project-item').nth(1)).toHaveClass(/selected/)
  15 |   await page.keyboard.press('ArrowRight')
  16 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
> 17 |   await expect(page.locator('.event-item input[name="title"]')).toBeVisible()
     |                                                                 ^ Error: expect(locator).toBeVisible() failed
  18 | }
  19 | 
  20 | test('Enter avec titre vide dans lister vide : notification affichée', async ({ page }) => {
  21 |   await enterVirtualEventLister(page)
  22 |   await page.keyboard.press('Enter')
  23 |   await expect(page.locator('#notification')).toBeVisible()
  24 | })
  25 | 
  26 | test('Enter avec titre vide dans lister vide : notification mentionne "évènement"', async ({ page }) => {
  27 |   await enterVirtualEventLister(page)
  28 |   await page.keyboard.press('Enter')
  29 |   await expect(page.locator('#notification')).toContainText('évènement')
  30 | })
  31 | 
  32 | test('Enter avec titre vide dans lister vide : éditeur reste visible', async ({ page }) => {
  33 |   await enterVirtualEventLister(page)
  34 |   await page.keyboard.press('Enter')
  35 |   await expect(page.locator('.event-item input[name="title"]')).toBeVisible()
  36 | })
  37 | 
  38 | test('Escape avec titre vide dans lister vide : notification affichée', async ({ page }) => {
  39 |   await enterVirtualEventLister(page)
  40 |   await page.keyboard.press('Escape')
  41 |   await expect(page.locator('#notification')).toBeVisible()
  42 | })
  43 | 
  44 | test('Escape avec titre vide dans lister vide : pas de page blanche', async ({ page }) => {
  45 |   await enterVirtualEventLister(page)
  46 |   await page.keyboard.press('Escape')
  47 |   await expect(page.locator('#main-panel')).not.toBeEmpty()
  48 | })
  49 | 
```