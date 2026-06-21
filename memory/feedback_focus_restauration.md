---
name: feedback_focus_restauration
description: Restaurer le focus après fermeture d'un panel — passer restoreFocusTo, jamais document.activeElement
metadata:
  type: feedback
---

Ne JAMAIS utiliser `document.activeElement` pour sauvegarder/restaurer le focus.

**Why:** Viole la Loi de Déméter — FilePicker (ou KP) interrogerait un objet global (document) pour connaître l'état du système. Couplage implicite, effets de bord, fuites possibles. Contraire à l'architecture qui évite tout contrôle central.

**How to apply:** L'appelant (ex. `ProjectLister`) connaît l'élément focusé. Il le passe explicitement :
```js
FilePicker.open({ mode: 'folder', restoreFocusTo: this._selectedItemEl })
// ou
somePanel.open({ restoreFocusTo: element })
```
Le panel stocke `this._restoreFocusTo = restoreFocusTo` et dans `close()` / `_close()` :
```js
this._restoreFocusTo?.focus()
```
Même pattern pour `KeyboardablePanel` : l'appelant passe `restoreFocusTo`, KP le stocke et le restaure dans `close()`.
