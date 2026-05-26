# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-minimales.spec.js >> des données minimales existent toujours à chaque requête serveur
- Location: specs/e2e/data-minimales.spec.js:8:1

# Error details

```
Error: ENOENT: no such file or directory, access '/Users/philippeperret/Programmes/Eventer3/data'
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import fs from 'node:fs/promises'
  3  | import path from 'node:path'
  4  | 
  5  | const appRoot = path.resolve(process.cwd(), '..')
  6  | const dataDir = path.join(appRoot, 'data')
  7  | 
  8  | test('des données minimales existent toujours à chaque requête serveur', async ({ page }) => {
  9  |   await fs.rm(dataDir, { recursive: true, force: true })
  10 | 
  11 |   await expect(async () => {
  12 |     await fs.access(dataDir)
  13 |   }).rejects.toThrow()
  14 | 
  15 |   const response = await page.goto('/')
  16 | 
  17 |   expect(response.ok()).toBe(true)
  18 | 
  19 |   await expect(async () => {
> 20 |     await fs.access(dataDir)
     |     ^ Error: ENOENT: no such file or directory, access '/Users/philippeperret/Programmes/Eventer3/data'
  21 |   }).not.toThrow()
  22 | })
```