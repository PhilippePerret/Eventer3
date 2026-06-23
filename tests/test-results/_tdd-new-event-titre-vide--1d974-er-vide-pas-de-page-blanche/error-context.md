# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/new-event-titre-vide.spec.js >> Escape avec titre vide dans lister vide : pas de page blanche
- Location: specs/e2e/_tdd/new-event-titre-vide.spec.js:47:1

# Error details

```
Error: expect(locator).not.toBeEmpty() failed

Locator:  locator('#pane-1').contentFrame().locator('#main-panel')
Expected: not empty
Received: empty
Timeout:  5000ms

Call log:
  - Expect "not toBeEmpty" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#main-panel')
    14 × locator resolved to <main id="main-panel" class="event-list">…</main>
       - unexpected value "empty"

```

```yaml
- main
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/event/new-event-titre-vide.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures'
  3  | import { test, expect, pane1 } from '../__setup__.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('many-events')
  7  | })
  8  | 
  9  | // many-events : project-b n'a pas d'events → lister virtuel à l'entrée
  10 | 
  11 | async function enterVirtualEventLister(page) {
  12 |   await page.goto('/')
  13 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  14 |   await pane1(page).locator('#main-panel').press('ArrowDown')
  15 |   await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)
  16 |   await pane1(page).locator('#main-panel').press('ArrowRight')
  17 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  18 |   const input = pane1(page).locator('.event-item [data-field="title"]')
  19 |   await expect(input).toBeVisible()
  20 |   return input
  21 | }
  22 | 
  23 | test('Enter avec titre vide dans lister vide : notification affichée', async ({ page }) => {
  24 |   const input = await enterVirtualEventLister(page)
  25 |   await input.press('Enter')
  26 |   await expect(pane1(page).locator('#notification')).toBeVisible()
  27 | })
  28 | 
  29 | test('Enter avec titre vide dans lister vide : notification mentionne "évènement"', async ({ page }) => {
  30 |   const input = await enterVirtualEventLister(page)
  31 |   await input.press('Enter')
  32 |   await expect(pane1(page).locator('#notification')).toContainText('évènement')
  33 | })
  34 | 
  35 | test('Enter avec titre vide dans lister vide : éditeur reste visible', async ({ page }) => {
  36 |   const input = await enterVirtualEventLister(page)
  37 |   await input.press('Enter')
  38 |   await expect(pane1(page).locator('.event-item [data-field="title"]')).toBeVisible()
  39 | })
  40 | 
  41 | test('Escape avec titre vide dans lister vide : notification affichée', async ({ page }) => {
  42 |   const input = await enterVirtualEventLister(page)
  43 |   await input.press('Escape')
  44 |   await expect(pane1(page).locator('#notification')).toBeVisible()
  45 | })
  46 | 
  47 | test('Escape avec titre vide dans lister vide : pas de page blanche', async ({ page }) => {
  48 |   const input = await enterVirtualEventLister(page)
  49 |   console.log("#main-panel doit contenir le champ d'édition")
> 50 |   await expect(pane1(page).locator('#main-panel')).not.toBeEmpty()
     |                                                        ^ Error: expect(locator).not.toBeEmpty() failed
  51 |   console.log("Avant l'annulation")
  52 |   await input.press('Escape')
  53 |   await expect(pane1(page).locator('#main-panel')).not.toBeEmpty()
  54 | })
  55 | 
```