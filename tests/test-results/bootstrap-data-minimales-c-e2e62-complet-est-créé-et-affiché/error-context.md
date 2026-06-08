# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bootstrap/data-minimales-completes.spec.js >> un projet démo minimal complet est créé et affiché
- Location: specs/e2e/bootstrap/data-minimales-completes.spec.js:27:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('body')
Timeout: 5000ms
- Expected substring  -  1
+ Received string     + 27

- Projet modèle
+
+
+   
+
+   
+   
+
+
+   
+
+   
+
+   
+
+   
+
+   
+
+   
+     
+   
+
+   
+   
+   
+
+

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('body')
    14 × locator resolved to <body>…</body>
       - unexpected value "

  

  
  


  

  

  

  

  

  
    
  

  
  
  

"

```

```yaml
- main
- contentinfo "Raccourcis clavier"
```

# Test source

```ts
  1  | import { test, expect } from '../__setup__.js'
  2  | import fs from 'node:fs/promises'
  3  | import path from 'node:path'
  4  | 
  5  | const appRoot = path.resolve(process.cwd(), '..')
  6  | const dataDir = path.join(appRoot, 'data')
  7  | 
  8  | async function pathExists(pth) {
  9  |   try {
  10 |     await fs.access(pth)
  11 |     return true
  12 |   } catch(err) {
  13 |     return false
  14 |   }
  15 | }
  16 | 
  17 | async function showTree(dir, level = 0) {
  18 |   const entries = await fs.readdir(dir, { withFileTypes: true })
  19 |   for (const entry of entries) {
  20 |     console.log(`${'  '.repeat(level)}- ${entry.name}`)
  21 |     if (entry.isDirectory()) {
  22 |       await showTree(path.join(dir, entry.name), level + 1)
  23 |     }
  24 |   }
  25 | }
  26 | 
  27 | test('un projet démo minimal complet est créé et affiché', async ({ page }) => {
  28 | 
  29 |   console.log('\n=== TEST PROJET DÉMO MINIMAL ===')
  30 |   console.log(`Application root : ${appRoot}`)
  31 |   console.log(`Dossier data     : ${dataDir}`)
  32 | 
  33 |   console.log('\n-> destruction du dossier data')
  34 |   await fs.rm(dataDir, { recursive: true, force: true })
  35 | 
  36 |   console.log('\n-> ouverture application')
  37 |   const response = await page.goto('/')
  38 |   expect(response.ok()).toBe(true)
  39 | 
  40 |   console.log('\n=== ARBORESCENCE DATA ===')
  41 |   await showTree(dataDir)
  42 |   console.log('=== FIN ARBORESCENCE DATA ===\n')
  43 | 
  44 |   const eventerDb = path.join(dataDir, 'eventer.db')
  45 | 
  46 |   console.log('\n-> vérification structure minimale')
  47 | 
  48 |   expect(await pathExists(eventerDb)).toBe(true)
  49 |   console.log('-> eventer.db OK')
  50 | 
  51 |   console.log('\n-> vérification DOM')
> 52 |   await expect(page.locator('body')).toContainText('Projet modèle')
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  53 |   console.log('-> projet affiché dans le DOM')
  54 | 
  55 |   console.log('\n=== FIN TEST PROJET DÉMO MINIMAL ===\n')
  56 | 
  57 | })
  58 | 
```