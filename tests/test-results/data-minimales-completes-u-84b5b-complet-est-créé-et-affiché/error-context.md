# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-minimales-completes.spec.js >> un projet démo minimal complet est créé et affiché
- Location: specs/e2e/data-minimales-completes.spec.js:31:1

# Error details

```
Error: ENOENT: no such file or directory, access '/Users/philippeperret/Programmes/Eventer3/data/projects/demo/__brins.json'
```

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('body')
- Expected substring  -  1
+ Received string     + 15

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

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('body')
    - locator resolved to <body>…</body>
    - unexpected value "

  

  


  
    
  

  
  

"

```

```yaml
- main
- contentinfo "Raccourcis clavier"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | import fs from 'node:fs/promises'
  3   | import path from 'node:path'
  4   | 
  5   | const appRoot = path.resolve(process.cwd(), '..')
  6   | const dataDir = path.join(appRoot, 'data')
  7   | 
  8   | async function showTree(dir, level = 0) {
  9   | 
  10  |   const entries = await fs.readdir(dir, { withFileTypes: true })
  11  | 
  12  |   for (const entry of entries) {
  13  | 
  14  |     console.log(
  15  |       `${'  '.repeat(level)}- ${entry.name}`
  16  |     )
  17  | 
  18  |     if (entry.isDirectory()) {
  19  |       await showTree(
  20  |         path.join(dir, entry.name),
  21  |         level + 1
  22  |       )
  23  |     }
  24  | 
  25  |   }
  26  | 
  27  | }
  28  | 
  29  | 
  30  | 
  31  | test('un projet démo minimal complet est créé et affiché', async ({ page }) => {
  32  | 
  33  |   console.log('\n=== TEST PROJET DÉMO MINIMAL ===')
  34  | 
  35  |   console.log(`Application root : ${appRoot}`)
  36  |   console.log(`Dossier data     : ${dataDir}`)
  37  | 
  38  |   console.log('\n-> destruction du dossier data')
  39  |   await fs.rm(dataDir, { recursive: true, force: true })
  40  | 
  41  |   console.log('\n-> ouverture application')
  42  |   const response = await page.goto('/')
  43  | 
  44  |   expect(response.ok()).toBe(true)
  45  | 
  46  |   console.log('\n=== ARBORESCENCE DATA ===')
  47  | 
  48  |   await showTree(dataDir)
  49  | 
  50  |   console.log('=== FIN ARBORESCENCE DATA ===\n')
  51  | 
  52  | 
  53  | 
  54  |   console.log('\n-> vérification structure minimale')
  55  | 
  56  |   const projectsFile = path.join(dataDir, 'projects.json')
  57  |   const projectFile  = path.join(dataDir, 'projects', 'demo.json')
  58  | 
  59  |   const brinsFile  = path.join(dataDir, 'projects', 'demo', '__brins.json')
  60  |   const persosFile = path.join(dataDir, 'projects', 'demo', '__persos.json')
  61  |   const eventsFile = path.join(dataDir, 'projects', 'demo', '__items.json')
  62  | 
  63  |   await expect(async () => {
  64  |     await fs.access(projectsFile)
  65  |   }).not.toThrow()
  66  | 
  67  |   console.log('-> projects.json OK')
  68  | 
  69  |   await expect(async () => {
  70  |     await fs.access(projectFile)
  71  |   }).not.toThrow()
  72  | 
  73  |   console.log('-> demo.json OK')
  74  | 
  75  |   await expect(async () => {
  76  |     await fs.access(brinsFile)
  77  |   }).not.toThrow()
  78  | 
  79  |   console.log('-> __brins.json OK')
  80  | 
  81  |   await expect(async () => {
  82  |     await fs.access(persosFile)
  83  |   }).not.toThrow()
  84  | 
  85  |   console.log('-> __persos.json OK')
  86  | 
  87  |   await expect(async () => {
  88  |     await fs.access(eventsFile)
  89  |   }).not.toThrow()
  90  | 
  91  |   console.log('-> __items.json OK')
  92  | 
  93  |   console.log('\n-> vérification DOM')
  94  | 
> 95  |   await expect(page.locator('body')).toContainText('Projet modèle')
      |                                      ^ Error: expect(locator).toContainText(expected) failed
  96  | 
  97  |   console.log('-> projet affiché dans le DOM')
  98  | 
  99  |   console.log('\n=== FIN TEST PROJET DÉMO MINIMAL ===\n')
  100 | 
  101 | })
```