let _data = null

export const Clipboard = {
  set(minClass, data, isCopy = false) { _data = { minClass, data, isCopy } },
  get()                               { return _data },
  clear()                             { _data = null },
  isCompatible(minClass)              { return _data?.minClass === minClass },
}
