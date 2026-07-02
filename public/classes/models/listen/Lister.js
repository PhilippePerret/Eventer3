export const ListerLi = {
    ArrowUp:    { nokey: 'selectPrev'     , alt: 'backgroundPrev' , meta: 'moveUp'    }
  , ArrowDown:  { nokey: 'selectNext'     , alt: 'backgroundNext' , meta: 'moveDown'  }
  , n:          { nokey: 'createNew'      , alt: 'createNewBefore'  }
  , '˜':        { alt: 'createNewBefore'                            }
  , Delete:     { nokey: 'deleteSelected' , maj: 'deleteCheckeds'   }
  , Enter:      { meta: 'closePanel'                                }
  , c:          { nokey: 'outOfTargetLink', meta: 'copySelectedItem', 'meta+maj': 'copyCheckedItems' }
  , x:          { meta: 'cutSelectedItem' , 'meta+maj': 'cutCheckedItems'  }
  , v:          { meta: 'pasteItem'                                 }
}
