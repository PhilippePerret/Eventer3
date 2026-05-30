import test from 'node:test'
import assert from 'node:assert/strict'

test('PopupSelect: le fichier existe et peut être importé', async () => {
  const { default: PopupSelect } = await import('../../../../public/classes/ui/PopupSelect.js')
  assert.ok(PopupSelect)
})

test('PopupSelect: le constructeur initialise les valeurs par défaut', async () => {
  const { default: PopupSelect } = await import('../../../../public/classes/ui/PopupSelect.js')
  const options = [{ value: 1, label: 'A' }, { value: 2, label: 'B' }]
  const popup = new PopupSelect({ options, currentValue: 1, onSelect: () => {} })
  assert.equal(popup.multi, false)
  assert.equal(popup.allowCustom, false)
  assert.equal(popup.currentValue, 1)
  assert.deepEqual(popup.filteredOptions, options)
  assert.deepEqual(popup.selectedValues, [])
})

test('PopupSelect: multi initialise selectedValues depuis currentValue', async () => {
  const { default: PopupSelect } = await import('../../../../public/classes/ui/PopupSelect.js')
  const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]
  const popup = new PopupSelect({ options, currentValue: ['a'], multi: true, onSelect: () => {} })
  assert.deepEqual(popup.selectedValues, ['a'])
})

test('PopupSelect: _focusOption wrap-around vers le bas', async () => {
  const { default: PopupSelect } = await import('../../../../public/classes/ui/PopupSelect.js')
  const options = [{ value: 1, label: 'A' }, { value: 2, label: 'B' }, { value: 3, label: 'C' }]
  const popup = new PopupSelect({ options, currentValue: null, onSelect: () => {} })
  popup.focusedIndex = 2
  popup._renderOptions = () => {}  // stub DOM
  popup._focusOption(3)
  assert.equal(popup.focusedIndex, 0)  // wrap to first
})

test('PopupSelect: _focusOption wrap-around vers le haut', async () => {
  const { default: PopupSelect } = await import('../../../../public/classes/ui/PopupSelect.js')
  const options = [{ value: 1, label: 'A' }, { value: 2, label: 'B' }]
  const popup = new PopupSelect({ options, currentValue: null, onSelect: () => {} })
  popup.focusedIndex = 0
  popup._renderOptions = () => {}
  popup._focusOption(-1)
  assert.equal(popup.focusedIndex, 1)  // wrap to last
})

test('PopupSelect: _selectByIndex multi toggles la valeur', async () => {
  const { default: PopupSelect } = await import('../../../../public/classes/ui/PopupSelect.js')
  const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]
  const popup = new PopupSelect({ options, currentValue: [], multi: true, onSelect: () => {} })
  popup._renderOptions = () => {}
  popup._selectByIndex(0)  // check 'a'
  assert.deepEqual(popup.selectedValues, ['a'])
  popup._selectByIndex(0)  // uncheck 'a'
  assert.deepEqual(popup.selectedValues, [])
})

test('PopupSelect: _selectByIndex multi peut cocher plusieurs valeurs', async () => {
  const { default: PopupSelect } = await import('../../../../public/classes/ui/PopupSelect.js')
  const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]
  const popup = new PopupSelect({ options, currentValue: [], multi: true, onSelect: () => {} })
  popup._renderOptions = () => {}
  popup._selectByIndex(0)
  popup._selectByIndex(2)
  assert.deepEqual(popup.selectedValues, ['a', 'c'])
})
