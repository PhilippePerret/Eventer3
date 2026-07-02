// Origine : tests/specs/e2e/project/new-project-*.spec.js + new-event-virtual-lister.spec.js
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
import { test, expect, pane1, press, getErr } from '../__setup__.js'

// ─── Nouveau projet sous la sélection ─────────────────────────────────────────

test.describe('Nouveau projet sous la sélection', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  test('la touche n crée un nouveau projet vide en dessous de la sélection', async ({ page }) => {
    await page.goto('/')

    const items = pane1(page).locator('.project-item')

    await expect(items).toHaveCount(3)

    await press(page, 'ArrowDown')
    await expect(items.nth(1)).toHaveClass(/selected/)

    const { folderName } = await setupProjectFolder(page)

    await press(page, 'n')
    await createAndSelectFolderInPicker(page, expect, folderName)
    await page.waitForLoadState('networkidle')

    // Nouveau projet inséré en dessous de la sélection (index 1) → index 2
    await expect(items).toHaveCount(4)
    await expect(items.nth(0)).toContainText('Projet A')
    await expect(items.nth(1)).toContainText('Projet B')
    await expect(items.nth(2)).toHaveClass(/selected/)
    await expect(items.nth(2)).not.toContainText('Projet A')
    await expect(items.nth(2)).not.toContainText('Projet B')
    await expect(items.nth(2)).not.toContainText('Projet C')
  })

})

// ─── Données initiales ─────────────────────────────────────────────────────────

test.describe("Données initiales d'un nouveau projet", () => {

  test.beforeEach(() => installFixtures('many-projects'))

  async function createProject(page, expect) {
    await page.goto('/')
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()

    const { folderName } = await setupProjectFolder(page)
    await press(page, 'n')
    await createAndSelectFolderInPicker(page, expect, folderName)
    await page.waitForLoadState('networkidle')

    return await pane1(page).locator('.project-item').nth(1).getAttribute('data-id')
  }

  test('un nouveau projet sauvegardé a un évènemencier avec un event "Acte I"', async ({ page }) => {
    const projectId = await createProject(page, expect)

    const listerResp = await page.request.get(`/api/items/${projectId}/lister`)
    expect(listerResp.ok()).toBeTruthy()
    const listerData = await listerResp.json()
    expect(listerData.id).toBeTruthy()

    const itemsResp = await page.request.get(`/api/listers/${listerData.id}/items?project_id=${projectId}`)
    expect(itemsResp.ok()).toBeTruthy()
    const items = await itemsResp.json()
    const eventTitles = Object.values(items).map(i => i.title)
    expect(eventTitles).toContain('Acte I')
  })

  test('un nouveau projet sauvegardé a un brin "Intrigue principale"', async ({ page }) => {
    const projectId = await createProject(page, expect)

    const itemsResp = await page.request.get(`/api/listers/${projectId}-brins/items`)
    expect(itemsResp.ok()).toBeTruthy()
    const items = await itemsResp.json()
    const brinTitles = Object.values(items).map(i => i.title)
    expect(brinTitles).toContain('Intrigue principale')
  })

  test('un nouveau projet sauvegardé a un personnage "Votre protagoniste"', async ({ page }) => {
    const projectId = await createProject(page, expect)

    const itemsResp = await page.request.get(`/api/listers/${projectId}-persos/items`)
    expect(itemsResp.ok()).toBeTruthy()
    const items = await itemsResp.json()
    const persoTitles = Object.values(items).map(i => i.title)
    expect(persoTitles).toContain('Votre protagoniste')
  })

})

// ─── Dialog eventer.db existant ───────────────────────────────────────────────
// Scénario : dossier créé manuellement contenant un eventer.db vide

test.describe('Nouveau projet — dialog eventer.db existant (dossier manuel)', () => {

  test.beforeEach(() => installFixtures('many-projects'))

  async function setupFolderWithDb(page) {
    const workDir  = path.join(os.tmpdir(), `eventer-test-${Date.now()}`)
    const folder   = path.join(workDir, 'projet-existant')
    fs.mkdirSync(folder, { recursive: true })
    fs.writeFileSync(path.join(folder, 'eventer.db'), '')

    await page.request.patch('/api/settings/last_path', {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ value: workDir })
    })
    return { workDir, folder }
  }

  async function openPickerAndSelectFolder(page) {
    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await press(page, 'n')
    await expect(pane1(page).locator('.file-picker')).toBeVisible()
    await expect(pane1(page).locator('.file-picker__entry-name', { hasText: 'projet-existant' })).toBeVisible()
    await press(page, 'Enter')
  }

  test('choisir un dossier avec eventer.db → dialog de confirmation visible', async ({ page }) => {
    await setupFolderWithDb(page)
    await page.goto('/')
    await openPickerAndSelectFolder(page)
    await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  })

  test('dialog eventer.db existant → 3 boutons (Annuler, Non la détruire, Oui)', async ({ page }) => {
    await setupFolderWithDb(page)
    await page.goto('/')
    await openPickerAndSelectFolder(page)
    await expect(pane1(page).locator('.ftpanel-btn')).toHaveCount(3)
  })

  test('dialog eventer.db → Tab+Tab+Enter (Annuler) → aucun projet créé', async ({ page }) => {
    await setupFolderWithDb(page)
    await page.goto('/')
    const countBefore = await pane1(page).locator('.project-item').count()
    await openPickerAndSelectFolder(page)
    await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
    await press(page, 'Tab')   // 0 Importer → 1 Détruire
    await press(page, 'Tab')   // 1 Détruire → 2 Annuler
    await press(page, 'Enter')
    await expect(pane1(page).locator('.ftpanel.kpanel')).not.toBeVisible()
    await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore)
  })

  test('dialog eventer.db → Enter (Oui) importe le projet existant', async ({ page }) => {
    await setupFolderWithDb(page)
    await page.goto('/')
    const countBefore = await pane1(page).locator('.project-item').count()
    await openPickerAndSelectFolder(page)
    await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
    await press(page, 'Enter')
    await page.waitForLoadState('networkidle')
    await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
  })

  test('dialog eventer.db → Tab+Enter (Détruire) crée un nouveau projet vide', async ({ page }) => {
    await setupFolderWithDb(page)
    await page.goto('/')
    const countBefore = await pane1(page).locator('.project-item').count()
    await openPickerAndSelectFolder(page)
    await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
    await press(page, 'Tab')   // 0 Importer → 1 Détruire
    await press(page, 'Enter')
    await page.waitForLoadState('networkidle')
    await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
  })

})

// ─── Lister virtuel pour projet sans events ───────────────────────────────────

test.describe('Lister virtuel (projet sans events)', () => {

  test.beforeEach(() => installFixtures('many-events'))

  // many-events : project-a (hl:true, e1/e2/e3), project-b (sans lister)

  test("→ sur un projet sans lister : crée l'éditeur, Enter confirme, n crée un second event", async ({ page }) => {
    await page.goto('/')

    await expect(pane1(page).locator('#projects-panel')).toBeVisible()
    await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)

    await press(page, 'ArrowDown')
    await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)

    await press(page, 'ArrowRight')
    await expect(pane1(page).locator('#events-panel')).toBeVisible()

    const firstInput = pane1(page).locator('.event-item [data-field="title"]')
    await expect(firstInput).toBeVisible()
    await expect(firstInput).toBeFocused()

    await firstInput.fill('Mon premier event')
    await press(page, 'Enter')
    await page.waitForLoadState('networkidle')

    await expect(pane1(page).locator('.event-item')).toHaveCount(1)
    await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon premier event')

    const listerResp = await page.request.get('/api/items/00000000-0000-0000-0000-000000000002/lister')
    expect(listerResp.ok()).toBeTruthy()
    const lister = await listerResp.json()
    expect(lister.item_ids).toHaveLength(1)
    const itemsResp = await page.request.get(`/api/listers/${lister.id}/items?project_id=00000000-0000-0000-0000-000000000002`)
    expect(itemsResp.ok()).toBeTruthy()
    const items = await itemsResp.json()
    expect(items[lister.item_ids[0]].title).toBe('Mon premier event')

    await press(page, 'n')
    const secondInput = pane1(page).locator('.event-item [data-field="title"]')
    await expect(secondInput).toBeVisible()
    await expect(secondInput).toBeFocused()

    await secondInput.fill('Mon second event')
    await press(page, 'Enter')

    await expect(pane1(page).locator('.event-item')).toHaveCount(2)
    await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon premier event')
    await expect(pane1(page).locator('.event-item').nth(1)).toContainText('Mon second event')
  })

})
