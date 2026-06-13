import { test as base } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    page.on('console', msg => console.log(msg.text()))
    const originalGoto = page.goto.bind(page)
    page.goto = async (url, options) => {
      const response = await originalGoto(url, options)
      try {
        await page.frameLocator('#pane-1').locator('body').click({ timeout: 3000 })
      } catch(e) { /* pas d'iframe pane-1 sur cette page */ }
      return response
    }

    const originalWaitForLoadState = page.waitForLoadState.bind(page)
    page.waitForLoadState = async (state, options) => {
      const pane1Frame = page.frames().find(f => f.url().includes('app-frame'))
      if (pane1Frame) return pane1Frame.waitForLoadState(state, options)
      return originalWaitForLoadState(state, options)
    }

    await use(page)
  }
})

export { expect } from '@playwright/test'

export function pane1(page) {
  return page.frameLocator('#pane-1')
}

export function pane1Frame(page) {
  return page.frames().find(f => f.url().includes('app-frame'))
}