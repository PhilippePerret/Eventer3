# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/new-event-titre-vide.spec.js >> Enter avec titre vide dans lister vide : éditeur reste visible
- Location: specs/e2e/event/new-event-titre-vide.spec.js:35:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('#events-panel')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#events-panel')

```

```yaml
- text: Projet A roman Projet B roman DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/event/new-event-titre-vide.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures'
  3  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('many-events')
  7  | })
  8  | 
  9  | // many-events : project-b n'a pas d'events → lister virtuel à l'entrée
  10 | 
  11 | async function enterVirtualListerEvent(page) {
  12 |   await page.goto('/')
  13 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  14 |   await press(page, 'ArrowDown')
  15 |   await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)
  16 |   await press(page, 'ArrowRight')
> 17 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  18 |   const input = pane1(page).locator('.event-item [data-field="title"]')
  19 |   await expect(input).toBeVisible()
  20 |   return input
  21 | }
  22 | 
  23 | test('Enter avec titre vide dans lister vide : notification affichée', async ({ page }) => {
  24 |   const input = await enterVirtualListerEvent(page)
  25 |   await press(page, 'Enter')
  26 |   await expect(pane1(page).locator('#notification')).toBeVisible()
  27 | })
  28 | 
  29 | test('Enter avec titre vide dans lister vide : notification mentionne "évènement"', async ({ page }) => {
  30 |   const input = await enterVirtualListerEvent(page)
  31 |   await press(page, 'Enter')
  32 |   await expect(pane1(page).locator('#notification')).toContainText('évènement')
  33 | })
  34 | 
  35 | test('Enter avec titre vide dans lister vide : éditeur reste visible', async ({ page }) => {
  36 |   const input = await enterVirtualListerEvent(page)
  37 |   await press(page, 'Enter')
  38 |   await expect(pane1(page).locator('.event-item [data-field="title"]')).toBeVisible()
  39 | })
  40 | 
  41 | test('Escape avec titre vide dans lister vide : notification affichée', async ({ page }) => {
  42 |   const input = await enterVirtualListerEvent(page)
  43 |   await press(page, 'Escape')
  44 |   await expect(pane1(page).locator('#notification')).toBeVisible()
  45 | })
  46 | 
  47 | test('Escape avec titre vide dans lister vide : pas de page blanche', async ({ page }) => {
  48 |   const input = await enterVirtualListerEvent(page)
  49 |   await expect(pane1(page).locator('#events-panel')).not.toBeEmpty()
  50 |   await press(page, 'Escape')
  51 |   await expect(pane1(page).locator('#notification')).toBeVisible()
  52 |   await expect(pane1(page).locator('#events-panel')).not.toBeEmpty()
  53 | })
  54 | 
```