import { test, expect, pane1 } from '../__setup__.js'

// Ouvre un PopupSelect en isolation en utilisant le KC réel de l'app
async function openTestPopup(page, config) {
  const frame = page.frames().find(f => f.url().includes('app-frame'))
  await frame.evaluate(async (cfg) => {
    const { default: PopupSelect } = await import('/classes/ui/PopupSelect.js')
    const anchor = document.createElement('button')
    anchor.style.cssText = 'position:fixed;top:100px;left:100px;z-index:9998'
    anchor.textContent = 'Anchor'
    document.body.appendChild(anchor)
    window.__testAnchor = anchor
    window.__testResult = undefined
    window.__testCancelled = false
    window.__testPopup = new PopupSelect({
      ...cfg,
      keyboardController: window.__keyboardController,
      onSelect: (v) => { window.__testResult = v },
      onCancel: () => { window.__testCancelled = true },
    })
    window.__testPopup.open(anchor)
  }, config)
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
}

// --- Single select ---

test("single: Enter sélectionne l'option focalisée", async ({ page }) => {
  await page.goto('/')
  await openTestPopup(page, {
    options: [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }],
    currentValue: null,
  })

  await page.keyboard.press('ArrowDown')
  await expect(pane1(page).locator('.popup-select__option.focused')).toHaveText('Option B')
  await page.keyboard.press('Enter')

  await expect(pane1(page).locator('.popup-select')).not.toBeVisible()
  const result = await page.frames().find(f => f.url().includes('app-frame')).evaluate(() => window.__testResult)
  expect(result).toBe('b')
})

test("single: Escape annule sans sélection", async ({ page }) => {
  await page.goto('/')
  await openTestPopup(page, {
    options: [{ value: 'a', label: 'Option A' }],
    currentValue: null,
  })

  await page.keyboard.press('Escape')

  await expect(pane1(page).locator('.popup-select')).not.toBeVisible()
  const result = await page.frames().find(f => f.url().includes('app-frame')).evaluate(() => window.__testResult)
  expect(result).toBeUndefined()
  const cancelled = await page.frames().find(f => f.url().includes('app-frame')).evaluate(() => window.__testCancelled)
  expect(cancelled).toBe(true)
})

test("single: pré-positionne sur la valeur courante", async ({ page }) => {
  await page.goto('/')
  await openTestPopup(page, {
    options: [{ value: 1, label: 'Un' }, { value: 2, label: 'Deux' }, { value: 3, label: 'Trois' }],
    currentValue: 2,
  })

  await expect(pane1(page).locator('.popup-select__option.focused')).toHaveText('Deux')
})

test("single: filter réduit les options", async ({ page }) => {
  await page.goto('/')
  await openTestPopup(page, {
    options: [{ value: 1, label: 'alpha' }, { value: 2, label: 'beta' }, { value: 3, label: 'alphabet' }],
    currentValue: null,
  })

  await pane1(page).locator('.popup-select__search').type('alph')
  await expect(pane1(page).locator('.popup-select__option')).toHaveCount(2)
  await page.keyboard.press('Enter')

  const result = await page.frames().find(f => f.url().includes('app-frame')).evaluate(() => window.__testResult)
  expect(result).toBe(1)
})

// --- Multi select ---

test("multi: Space coche et décoche une option", async ({ page }) => {
  await page.goto('/')
  await openTestPopup(page, {
    options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }],
    currentValue: [],
    multi: true,
  })

  await expect(pane1(page).locator('.popup-select__footer')).toBeVisible()

  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')
  await expect(pane1(page).locator('.popup-select__option').nth(1)).toHaveClass(/checked/)

  await page.keyboard.press(' ')
  await expect(pane1(page).locator('.popup-select__option').nth(1)).not.toHaveClass(/checked/)
})

test("multi: Enter confirme la sélection multiple", async ({ page }) => {
  await page.goto('/')
  await openTestPopup(page, {
    options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }],
    currentValue: [],
    multi: true,
  })

  // Cocher A et C
  await page.keyboard.press(' ')            // cocher A (index 0)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')            // cocher C (index 2)
  await page.keyboard.press('Enter')

  await expect(pane1(page).locator('.popup-select')).not.toBeVisible()
  const result = await page.frames().find(f => f.url().includes('app-frame')).evaluate(() => window.__testResult)
  expect(result).toEqual(['a', 'c'])
})

test("multi: initialise les cases cochées depuis currentValue", async ({ page }) => {
  await page.goto('/')
  await openTestPopup(page, {
    options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }],
    currentValue: ['b'],
    multi: true,
  })

  await expect(pane1(page).locator('.popup-select__option').nth(1)).toHaveClass(/checked/)
  await expect(pane1(page).locator('.popup-select__option').nth(0)).not.toHaveClass(/checked/)
})

// --- allowCustom ---

test("allowCustom: affiche 'Ajouter' si le texte ne matche pas", async ({ page }) => {
  await page.goto('/')
  await openTestPopup(page, {
    options: [{ value: 'a', label: 'alpha' }],
    currentValue: null,
    allowCustom: true,
  })

  await pane1(page).locator('.popup-select__search').type('nouveau')
  await expect(pane1(page).locator('.popup-select__option--custom')).toBeVisible()
  await expect(pane1(page).locator('.popup-select__option--custom')).toContainText('nouveau')
})

test("allowCustom: Enter sur valeur custom la sélectionne", async ({ page }) => {
  await page.goto('/')
  await openTestPopup(page, {
    options: [{ value: 'a', label: 'alpha' }],
    currentValue: null,
    allowCustom: true,
  })

  await pane1(page).locator('.popup-select__search').type('custom-val')
  await page.keyboard.press('Enter')

  await expect(pane1(page).locator('.popup-select')).not.toBeVisible()
  const result = await page.frames().find(f => f.url().includes('app-frame')).evaluate(() => window.__testResult)
  expect(result).toBe('custom-val')
})

test("allowCustom: n'affiche pas 'Ajouter' si le texte matche exactement", async ({ page }) => {
  await page.goto('/')
  await openTestPopup(page, {
    options: [{ value: 'a', label: 'alpha' }],
    currentValue: null,
    allowCustom: true,
  })

  await pane1(page).locator('.popup-select__search').type('alpha')
  await expect(pane1(page).locator('.popup-select__option--custom')).not.toBeVisible()
})
