// import fs from 'fs'
// import path from 'path'
// import { test, expect } from '@playwright/test'

// test.only('la touche Escape après n annule complètement la création du projet', async ({ page }) => {

//   const projectsPath = path.resolve('data/projects.json')

//   await page.goto('/')

//   const itemsBefore = page.locator('.project-item')

//   await expect(itemsBefore).toHaveCount(3)

//   const projectsBefore = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))

//   await page.keyboard.press('n')
//   await page.keyboard.press('Escape')

//   const itemsAfter = page.locator('.project-item')

//   await expect(itemsAfter).toHaveCount(3)

//   await expect(page.locator('input')).toHaveCount(0)

//   const projectsAfter = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))

//   expect(projectsAfter).toEqual(projectsBefore)

// })