export const ItemLi = {
    Enter:      { nokey: 'onEnter'                              }
  , Escape:     { nokey: 'onEscape'                            }
  , Tab:        { nokey: 'onTab',   maj: 'onShiftTab'          }
  , ArrowRight: { nokey: 'enterInside'                         }
  , '?':        { meta:  'openContextualHelp'                  }
  , ' ':        { nokey: 'toggleChecked'                       }
  , k:          { nokey: 'memoAsTarget', meta: 'openTargetsPanel' }
  , o:          { nokey: 'openActiveLink'                      }
  , g:          { nokey: 'goLink'                              }
  , a:          { nokey: 'splitLink'                           }
  , q:          { nokey: 'openConstantsPanel'                  }
}
