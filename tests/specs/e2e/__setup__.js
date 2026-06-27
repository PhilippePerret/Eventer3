import { test as base } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    page.on('console', msg => console.log(msg.text()))
    const originalGoto = page.goto.bind(page)
    page.goto = async (url, options) => {
      return await originalGoto(url, options)
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
export { ERRORS } from '../../../public/locale/fr/ERRORS.js'
export { getErr } from '../../../public/system/Error.js'

export function pane1(page) {
  return page.frameLocator('#pane-1')
}

export function pane1Frame(page) {
  return page.frames().find(f => f.url().includes('app-frame'))
}