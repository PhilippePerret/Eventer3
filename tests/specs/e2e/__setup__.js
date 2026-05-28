import { test as base } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    page.on('console', msg => console.log(msg.text()))
    await use(page)
  }
})

export { expect } from '@playwright/test'