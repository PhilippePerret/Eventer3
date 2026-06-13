import os from 'node:os'
import path from 'node:path'

/**
 * Crée un dossier temporaire et configure last_path pour que FilePicker s'y ouvre.
 */
export async function setupProjectFolder(page, folderName = null) {
  const name = folderName ?? `eventer-test-${Date.now()}`
  const workDir = path.join(os.tmpdir(), `eventer-work-${Date.now()}`)

  await page.request.post('/api/fs/mkdir', {
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ path: workDir })
  })
  await page.request.patch('/api/settings/last_path', {
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ value: workDir })
  })

  return { folderName: name, workDir, folderPath: path.join(workDir, name) }
}

/**
 * Dans le FilePicker ouvert, crée un sous-dossier avec folderName puis le sélectionne.
 */
export async function createAndSelectFolderInPicker(page, expect, folderName) {
  const frame = page.frameLocator('#pane-1')
  await expect(frame.locator('.file-picker')).toBeVisible()

  // n dans le FilePicker = nouveau dossier
  await page.keyboard.press('n')

  const input = frame.locator('.file-picker__new-folder-input')
  await expect(input).toBeVisible()
  await input.fill(folderName)
  await input.press('Enter')

  // Attendre que l'entrée apparaisse dans la liste
  await frame.locator('.file-picker__entry-name', { hasText: folderName }).waitFor({ state: 'visible' })

  // Enter pour sélectionner le dossier
  await page.keyboard.press('Enter')
}

/**
 * Flux complet : setup dossier + n + FilePicker + attente fin création.
 * Retourne l'id du projet tel qu'affiché dans le DOM (.project-item__id à l'index 1).
 */
export async function createProjectViaFilePicker(page, expect) {
  const { folderName } = await setupProjectFolder(page)
  await page.keyboard.press('n')
  await createAndSelectFolderInPicker(page, expect, folderName)
  await page.waitForLoadState('networkidle')
  const idText = await page.frameLocator('#pane-1').locator('.project-item').nth(1).locator('.project-item__id').textContent()
  return { projectId: idText.trim(), folderName }
}
