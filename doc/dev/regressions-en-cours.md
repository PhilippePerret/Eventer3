# Régressions à corriger (session 2026-06-16)

## 1. `specs/e2e/_tdd/consolidate-level.spec.js:89` — PASSE

## 2. `specs/e2e/apparence/display-mode-level.spec.js:104` — À TRAITER

    Error: expect(locator).toHaveClass(expected) failed
    Locator: locator('#pane-1').contentFrame().locator('.event-item[data-id="e31"]')
    Expected pattern: /selected/
    Timeout: 5000ms
    Error: element(s) not found

    > 113 |   await expect(pane1(page).locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)

## 3. `specs/e2e/panels/panel-move.spec.js:83`

    Error: frame.evaluate: TypeError: Cannot set properties of null (setting 'innerHTML')
    > 86 |   ... (line 86)

## 4. `specs/e2e/panels/tools-panel.spec.js:37` — ⌘+t inactif hors LEVEL

    Error: expect(locator).not.toBeAttached() failed
    Locator: locator('#pane-1').contentFrame().locator('.tools-panel')
    Expected: not attached / Received: attached
    > 44 |   await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()

## 5. `specs/e2e/panels/tools-panel.spec.js:68` — Consolider listé avec raccourci ⌘⇧C

    Error: expect(locator).toContainText(expected) failed
    strict mode violation: locator('.tools-panel .floating-panel__item') resolved to 3 elements
    > 73 |   await expect(pane1(page).locator('.tools-panel .floating-panel__item')).toContainText('Consolider le niveau')
