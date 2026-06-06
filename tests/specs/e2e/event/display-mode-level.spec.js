import { installFixtures } from '../../../helpers/install-fixtures'
import { test, expect } from '../__setup__.js'

// Fixture depth-move :
//   Liste#2 (depth=1) : [e14 "Acte 1", e23 "Acte 2"]
//   Liste#3 (depth=2, enfant e14) : [e31 "Séquence 1", e45 "Séquence 2"]
//   Liste#4 (depth=3, enfant e31) : [e57 "Scène 1", e68 "Scène 2"]
//   Liste#5 (depth=2, enfant e23) : [e88 "Séquence 3"]

test.beforeEach(() => {
  installFixtures('depth-move')
})

async function enterProject(page) {
  await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
}

test("mode LEVEL depth=2 : liste plate de tous les events depth=2", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)

  console.log('\n=== TEST LEVEL MODE — DEPTH=2 ===')

  console.log('-> entrée dans e14 (Acte 1) → depth=2')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await expect(page.locator('#status-bar')).toContainText('DISP MODE NESTING')

  console.log('-> ⌘+m : passage en LEVEL mode')
  await page.keyboard.press('Meta+m')
  await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')

  console.log('-> 3 items affichés : e31, e45 (Liste#3) + e88 (Liste#5)')
  await expect(page.locator('.event-item')).toHaveCount(3)
  await expect(page.locator('.event-item[data-id="e31"]')).toBeVisible()
  await expect(page.locator('.event-item[data-id="e45"]')).toBeVisible()
  await expect(page.locator('.event-item[data-id="e88"]')).toBeVisible()

  console.log('-> aucun item virtuel')
  await expect(page.locator('.event-item.virtual')).toHaveCount(0)

  console.log('\n=== FIN ===\n')
})

test("mode LEVEL depth=3 : events réels + virtuels avec +N", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)

  console.log('\n=== TEST LEVEL MODE — DEPTH=3 ===')

  console.log('-> entrée dans e14 → depth=2, puis e31 → depth=3')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '3')

  console.log('-> ⌘+m : passage en LEVEL mode')
  await page.keyboard.press('Meta+m')
  await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')

  console.log('-> 4 items : e57, e68 (réels) + 2 virtuels (e45+1, e88+1)')
  await expect(page.locator('.event-item')).toHaveCount(4)
  await expect(page.locator('.event-item[data-id="e57"]')).toBeVisible()
  await expect(page.locator('.event-item[data-id="e68"]')).toBeVisible()

  console.log('-> 2 items virtuels avec texte "+1"')
  await expect(page.locator('.event-item.virtual')).toHaveCount(2)
  await expect(page.locator('.event-item.virtual').nth(0)).toContainText('+1')
  await expect(page.locator('.event-item.virtual').nth(1)).toContainText('+1')

  console.log('-> items virtuels contiennent le titre de l\'event de référence')
  await expect(page.locator('.event-item.virtual').nth(0)).toContainText('Séquence 2')
  await expect(page.locator('.event-item.virtual').nth(1)).toContainText('Séquence 3')

  console.log('\n=== FIN ===\n')
})

test("items virtuels non sélectionnables au clavier", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)

  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '3')
  await page.keyboard.press('Meta+m')
  await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')

  console.log('-> LEVEL mode actif : 4 items dont 2 virtuels')
  await expect(page.locator('.event-item')).toHaveCount(4)
  await expect(page.locator('.event-item.virtual')).toHaveCount(2)

  console.log('-> ↓ navigue uniquement sur les items réels, saute les virtuels')
  await expect(page.locator('.event-item[data-id="e57"]')).toHaveClass(/selected/)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item[data-id="e68"]')).toHaveClass(/selected/)
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.event-item[data-id="e68"]')).toHaveClass(/selected/)
})

test("entrer dans un item en mode LEVEL rebascule en NESTING", async ({ page }) => {
  await page.goto('/')
  await enterProject(page)

  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Meta+m')
  await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')

  console.log('-> ArrowRight sur e31 : entre dans Liste#4, rebascule NESTING')
  await expect(page.locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '3')
  await expect(page.locator('#status-bar')).toContainText('DISP MODE NESTING')
})
