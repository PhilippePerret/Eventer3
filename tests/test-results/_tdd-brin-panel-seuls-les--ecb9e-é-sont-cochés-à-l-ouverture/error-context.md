# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-panel.spec.js >> seuls les brins de l'event sélectionné sont cochés à l'ouverture
- Location: specs/e2e/_tdd/brin-panel.spec.js:84:1

# Error details

```
Error: page.originalGoto: Test ended.
Call log:
  - navigating to "http://127.0.0.1:4567/", waiting until "load"

```

# Test source

```ts
  1  | import { test as base } from '@playwright/test'
  2  | 
  3  | export const test = base.extend({
  4  |   page: async ({ page }, use) => {
  5  |     page.on('console', msg => console.log(msg.text()))
  6  |     const originalGoto = page.goto.bind(page)
  7  |     page.goto = async (url, options) => {
> 8  |       return await originalGoto(url, options)
     |                    ^ Error: page.originalGoto: Test ended.
  9  |     }
  10 | 
  11 |     const originalWaitForLoadState = page.waitForLoadState.bind(page)
  12 |     page.waitForLoadState = async (state, options) => {
  13 |       const pane1Frame = page.frames().find(f => f.url().includes('app-frame'))
  14 |       if (pane1Frame) return pane1Frame.waitForLoadState(state, options)
  15 |       return originalWaitForLoadState(state, options)
  16 |     }
  17 | 
  18 |     await use(page)
  19 |   }
  20 | })
  21 | 
  22 | export { expect } from '@playwright/test'
  23 | 
  24 | export function pane1(page) {
  25 |   return page.frameLocator('#pane-1')
  26 | }
  27 | 
  28 | export function pane1Frame(page) {
  29 |   return page.frames().find(f => f.url().includes('app-frame'))
  30 | }
```