# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-minimales-completes.spec.js >> un projet démo minimal complet est créé et affiché
- Location: specs/e2e/data-minimales-completes.spec.js:38:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('body')
Timeout: 5000ms
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
  53  | 
  54  |   const response = await page.goto('/')
  55  | 
  56  |   expect(response.ok()).toBe(true)
  57  | 
  58  |   console.log('\n=== ARBORESCENCE DATA ===')
  59  | 
  60  |   await showTree(dataDir)
  61  | 
  62  |   console.log('=== FIN ARBORESCENCE DATA ===\n')
  63  | 
  64  |   const projectsFile = path.join(
  65  |     dataDir,
  66  |     'projects.json'
  67  |   )
  68  | 
  69  |   const projectFile = path.join(
  70  |     dataDir,
  71  |     'projects',
  72  |     'demo.json'
  73  |   )
  74  | 
  75  |   const projectFolder = path.join(
  76  |     dataDir,
  77  |     'projects',
  78  |     'demo'
  79  |   )
  80  | 
  81  |   const brinsFile = path.join(
  82  |     projectFolder,
  83  |     '__brins.json'
  84  |   )
  85  | 
  86  |   const persosFile = path.join(
  87  |     projectFolder,
  88  |     '__persos.json'
  89  |   )
  90  | 
  91  |   const eventsFile = path.join(
  92  |     projectFolder,
  93  |     '__items.json'
  94  |   )
  95  | 
  96  |   console.log('\n-> vérification structure minimale')
  97  | 
  98  |   expect(
  99  |     await pathExists(projectsFile)
  100 |   ).toBe(true)
  101 | 
  102 |   console.log('-> projects.json OK')
  103 | 
  104 |   expect(
  105 |     await pathExists(projectFile)
  106 |   ).toBe(true)
  107 | 
  108 |   console.log('-> projects/demo.json OK')
  109 | 
  110 |   const errors = []
  111 | 
  112 | if (!(await pathExists(projectFolder))) {
  113 |   errors.push('Le dossier projects/demo est absent')
  114 | }
  115 | 
  116 | if (!(await pathExists(brinsFile))) {
  117 |   errors.push('__brins.json absent')
  118 | }
  119 | 
  120 | if (!(await pathExists(persosFile))) {
  121 |   errors.push('__persos.json absent')
  122 | }
  123 | 
  124 | if (!(await pathExists(eventsFile))) {
  125 |   errors.push('__items.json absent')
  126 | }
  127 | 
  128 | expect(errors).toEqual([])
  129 |   console.log('-> dossier projects/demo OK')
  130 | 
  131 |   expect(
  132 |     await pathExists(brinsFile)
  133 |   ).toBe(true)
  134 | 
  135 |   console.log('-> __brins.json OK')
  136 | 
  137 |   expect(
  138 |     await pathExists(persosFile)
  139 |   ).toBe(true)
  140 | 
  141 |   console.log('-> __persos.json OK')
  142 | 
  143 |   expect(
  144 |     await pathExists(eventsFile)
  145 |   ).toBe(true)
  146 | 
  147 |   console.log('-> __items.json OK')
  148 | 
  149 |   console.log('\n-> vérification DOM')
  150 | 
  151 |   await expect(
  152 |     page.locator('body')
> 153 |   ).toContainText('Projet modèle')
      |     ^ Error: expect(locator).toContainText(expected) failed
  154 | 
  155 |   console.log('-> projet affiché dans le DOM')
  156 | 
  157 |   console.log(
  158 |     '\n=== FIN TEST PROJET DÉMO MINIMAL ===\n'
  159 |   )
  160 | 
  161 | })
```