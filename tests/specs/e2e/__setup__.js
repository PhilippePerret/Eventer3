import { test as base, expect } from '@playwright/test'

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

// Envoie une touche à l'élément RÉELLEMENT focusé (le panneau actif la gère).
// Pas de cible explicite → si l'app focus mal, le test échoue (zéro faux positif).
export function press(page, key) {
  return page.keyboard.press(key)
}

// Décrit l'élément réellement focusé dans l'app (pour découvrir/logguer la vérité).
export async function focusInfo(page) {
  const fr = pane1Frame(page)
  if (!fr) return '(pas de frame app)'
  return await fr.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return '(aucun focus — document.body)'
    const cls = el.className ? '.' + el.className.trim().replace(/\s+/g, '.') : ''
    const id  = el.id ? '#' + el.id : ''
    const did = el.getAttribute('data-id')
    return `${el.tagName.toLowerCase()}${id}${cls}${did ? ` [data-id=${did}]` : ''}`
  })
}

// S'assure que l'élément RÉELLEMENT focusé correspond à `selector`.
// Échoue (pas de faux positif) si le focus est ailleurs ou absent.
export async function hasFocus(page, selector) {
  const fr = pane1Frame(page)
  await expect
    .poll(() => fr.evaluate(sel => !!document.activeElement?.matches?.(sel), selector),
          { message: `focus attendu sur "${selector}"` })
    .toBe(true)
}