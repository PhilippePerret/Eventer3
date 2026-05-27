import { test, expect } from '@playwright/test'

test('la liste des projets possède les bonnes classes CSS', async ({ page }) => {

  console.log('\n=== TEST CLASSES CSS PROJECT LISTING ===')

  await page.goto('/')

  const mainPanel = page.locator('#main-panel')
  const listing   = page.locator('.project-listing')
  const item      = page.locator('.project-listing__item')
  const title     = page.locator('.project-listing__title')
  const pid       = page.locator('.project-listing__id')

  console.log('-> vérification #main-panel.projects-listing')

  await expect(mainPanel).toHaveClass(/projects-listing/)

  console.log('-> OK')

  console.log('-> vérification .project-listing')

  await expect(listing).toHaveCount(1)

  console.log('-> OK')

  console.log('-> vérification .project-listing__item')

  await expect(item).toHaveCount(1)

  console.log('-> OK')

  console.log('-> vérification .project-listing__title')

  await expect(title).toContainText('Projet modèle')

  console.log('-> OK')

  console.log('-> vérification .project-listing__id')

  await expect(pid).toContainText('demo')

  console.log('-> OK')

  console.log(
    '\n=== FIN TEST CLASSES CSS PROJECT LISTING ===\n'
  )

})