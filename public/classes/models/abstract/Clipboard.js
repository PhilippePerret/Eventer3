let _data = null

export const Clipboard = {
  set(minClass, data, isCut = false) { _data = { minClass, data, isCut } },
  get()                              { return _data },
  clear()                            { _data = null },
  isCompatible(minClass)             { return _data?.minClass === minClass },
}
