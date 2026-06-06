import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

// La traversée top-down assigne data-depth sur #main-panel :
//   liste des projets  → depth=0
//   actes (niv.1)      → depth=1
//   séquences (niv.2)  → depth=2
//   scènes (niv.3)     → depth=3

test("état initial : depth=0 liste des projets, depth=1/2/2/3 pour les EventListers", async ({ page }) => {

  installFixtures('depth-move')
  await page.goto('/')

  console.log('\n=== TEST DEPTH — ÉTAT INITIAL ===')

  console.log('-> liste des projets : data-depth doit être "0"')
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '0')

  console.log('-> entrée dans project-a (actes, Liste#2)')
  await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)

  console.log('-> Liste#2 (actes) : data-depth doit être "1"')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '1')

  console.log('-> entrée dans e14 → Acte 1 (séquences, Liste#3)')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.event-item[data-id="e31"]')).toBeVisible()

  console.log('-> Liste#3 (séquences Acte 1) : data-depth doit être "2"')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')

  console.log('-> entrée dans e31 → Séquence 1 (scènes, Liste#4)')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.event-item[data-id="e57"]')).toBeVisible()

  console.log('-> Liste#4 (scènes) : data-depth doit être "3"')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '3')

  console.log('-> retour jusqu\'à la racine (Liste#2)')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '1')

  console.log('-> sélection e23 → Acte 2 (séquences, Liste#5)')
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item[data-id="e23"]')).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.event-item[data-id="e88"]')).toBeVisible()

  console.log('-> Liste#5 (séquences Acte 2) : data-depth doit être "2"')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')

  console.log('\n=== FIN TEST DEPTH — ÉTAT INITIAL ===\n')
})

test("cas 1 : déplacement e45 sans enfant — depths inchangés (1/2/2/3)", async ({ page }) => {

  installFixtures('depth-move-cas1')
  await page.goto('/')

  console.log('\n=== TEST DEPTH — CAS 1 ===')

  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '0')

  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '1')

  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')

  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '3')

  console.log('\n=== FIN TEST DEPTH — CAS 1 ===\n')
})

test("cas 2 : déplacement e31 vers Liste#5 — Liste#4 reste à depth=3", async ({ page }) => {

  installFixtures('depth-move-cas2')
  await page.goto('/')

  console.log('\n=== TEST DEPTH — CAS 2 ===')

  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '0')

  console.log('-> entrée dans project-a')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '1')

  console.log('-> sélection e23 (Acte 2) → entrée dans Liste#5')
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item[data-id="e23"]')).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')

  console.log('-> sélection e31 (Séquence 1, dans Liste#5) → entrée dans Liste#4')
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')

  console.log('-> Liste#4 : data-depth doit rester "3" (Liste#5 depth=2, donc 2+1=3)')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '3')

  console.log('\n=== FIN TEST DEPTH — CAS 2 ===\n')
})

test("cas 3 : déplacement e31 vers Liste#2 — Liste#4 passe à depth=2", async ({ page }) => {

  installFixtures('depth-move-cas3')
  await page.goto('/')

  console.log('\n=== TEST DEPTH — CAS 3 ===')

  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '0')

  console.log('-> entrée dans project-a')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '1')

  console.log('-> sélection e31 (3ème item dans Liste#2) → entrée dans Liste#4')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')

  console.log('-> Liste#4 : data-depth doit être "2" (Liste#2 depth=1, donc 1+1=2)')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')

  console.log('\n=== FIN TEST DEPTH — CAS 3 ===\n')
})
