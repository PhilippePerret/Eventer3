// Origine : tests/specs/e2e/brin/brin-persistence.spec.js
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('with-brins')
})

// fixture with-brins : project-a, events e1/e2, brins b1 (MON) / b2 (AUT)

async function openBrinPanel(page) {
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()
}

test("brin créé persiste après rechargement de la page", async ({ page }) => {
  await openBrinPanel(page)

  await press(page, 'n')
  await pane1(page).locator('.brin-item.selected [data-field="title"]').fill('Brin persistant')
  await press(page, 'Enter')

  await expect(pane1(page).locator('.brin-item').nth(1)).toContainText('Brin persistant')

  await page.reload()

  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()

  const brins = pane1(page).locator('.brin-item')
  const brinPersistant = brins.filter({ hasText: 'Brin persistant' })
  await expect(brinPersistant).toBeVisible()

  const badge = brinPersistant.locator('.brin-badge')
  await expect(badge).not.toHaveText('')
})

test("brin créé a bien un badge affiché après rechargement", async ({ page }) => {
  await openBrinPanel(page)

  await press(page, 'n')
  await pane1(page).locator('.brin-item.selected [data-field="title"]').fill('Nouveau Brin')
  await press(page, 'Enter')

  await expect(pane1(page).locator('.brin-item').nth(1)).toContainText('Nouveau Brin')
  await page.waitForLoadState('networkidle')

  await page.reload()
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  await press(page, 'ArrowRight')
  await expect(pane1(page).locator('#events-panel')).toBeVisible()
  await press(page, 'b')
  await expect(pane1(page).locator('#brins-panel')).toBeVisible()

  const newBrin = pane1(page).locator('.brin-item').nth(1)
  await expect(newBrin).toContainText('Nouveau Brin')
  await expect(newBrin.locator('.brin-badge')).not.toHaveText('')
})

// ─── Unicité badge (checkBadgeValue) ─────────────────────────────────────────

test("modifier le badge d'un brin vers une valeur déjà prise → notification immédiate + badge non modifié", async ({ page }) => {
  await openBrinPanel(page)
  await press(page, 'Enter')
  await press(page, 'Tab')
  await pane1(page).locator('.brin-item.selected [data-field="badge"]').fill('AUT')
  await expect(pane1(page).locator('.notification')).toBeVisible()
  await expect(pane1(page).locator('.notification')).toContainText(getErr(2010, 'AUT'))
  await press(page, 'Enter')
  await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-badge')).toHaveText('MON')
})

test("remettre son propre badge après changement temporaire → pas de notification", async ({ page }) => {
  await openBrinPanel(page)
  await press(page, 'ArrowDown')
  await press(page, 'Enter')
  await press(page, 'Tab')
  await pane1(page).locator('.brin-item.selected [data-field="badge"]').fill('PRE')
  await pane1(page).locator('.brin-item.selected [data-field="badge"]').fill('AUT')
  await expect(pane1(page).locator('.notification')).not.toBeVisible()
})
