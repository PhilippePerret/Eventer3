export const ListerLi = {
    ArrowUp:    { nokey: 'selectPrev'     , meta: 'moveUp'          }
  , ArrowDown:  { nokey: 'selectNext'     , meta: 'moveDown'        }
  , n:          { nokey: 'createNew'      , alt: 'createNewBefore'  }
  , '˜':        { alt: 'createNewBefore'                            }
  , Delete:     { nokey: 'deleteSelected' , maj: 'deleteCheckeds'   }
  , Enter:      { meta: 'closePanel'                                }
  , c:          { meta: 'copySelectedItem', maj: 'copyCheckedItems' }
  , x:          { meta: 'cutSelectedItem' , maj: 'cutCheckedItems'  }
  , v:          { meta: 'pasteItem'                                 }
}
