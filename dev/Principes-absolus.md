# Eventer3 - Principes absolus

## Lister et Item

Avant d’implémenter un comportement propre à une [classe spécialisée][], il faut se demander si ça n’est pas plutôt un comportement de tous les `Lister` ou tous les `Items` et donc l’implémenter dans ces classes abstraites.

## Annexe

<a name="spec-classes"></a>

---

### Classes spécialisées

| Lister                                                       | Item                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `ProjectLister`                                              | `Project`                                                    |
| Gère la liste unique des projets.                            | Une instance de projet.                                      |
| --                                                           | --                                                           |
| `EventLister`                                                | `Event`                                                      |
| Gère une liste d’évènements (`Event`). Il peut y en avoir une infinité dans un projet. | Un évènement particulier dans un évènemencier.               |
| --                                                           | --                                                           |
| `BrinLister`                                                 | `Brin`                                                       |
| Gère la liste des brins. Plus tard, les listes des brins pourront être imbriquées comme les `EventLister`. | Un brin du projet courant.<br />Un « brin » peut être pensé comme une intrigue du projet, du film, du roman, de la BD. |
| `PersoLister`                                                | `Perso`                                                      |
| Gère la liste (ou *une* liste) de personnage du projet.      | Un personnage en particulier du projet.                      |
| --                                                           | --                                                           |
| `ScriptLister`                                               | `ScriptItem`                                                 |
| Semblable aux `EventLister` ce Lister est le « bout de chaine », il contient le texte final du projet, sous forme de roman ou de scénario en fonction de la nature du projet. | Un paragraphe du manuscrit ou du scénario.                   |



---

## TAB Cycle

Le « tab cycle » ou « cycle de tabulation » est le système utilisé par un maximum de panneaux dans *EventerX* et qui a été mis au point pour l’utilisation « tout au clavier » de l’application. 

Principe : la touche Tabulation permet de passer, en cycle des éléments sélectionnables de la fenêtre (avec `↓` et `↑`) aux faux-boutons du footer du `KeyboardablePanel`.

### Faux-Boutons

- Les faux-boutons ne sont pas activables à la souris
- Lorsqu’ils ont le focus, il arborent un `↩︎` devant leur nom et ils sont verts (une classe CSS gère ça automatiquement à partir du moment où le bouton a la classe `default`.
- lorsqu’ils n’ont pas le focus, ils arborent un `⇥` qui rappelle le tab-cycle.

### Exemple de Tab-cycle

Exemple de Tab-cycle avec la fenêtre des outils. C’est un panneau `KeyboardablePanel` qui permet de jouer un outil particulier.

À l’ouverture, le panneau affiche la liste des outils, le premier est sélectionné. Faisons un premier cycle.

Un premier `⇥` va choisir le bouton « ⇥ Exécuter » qui va passer à « ↩︎ Exécuter » et au vert. Si on cliquait `↩︎`, on exécuterait cet outils. 

Un second `⇥` va choisir le bouton suivant « ⇥ Fermer »  qui va passer à « ↩︎ Fermer » et au vert. Si on cliquait `↩︎`, on fermerait la fenêtre sans rien faire. 

Si on clique un troisième fois sur `⇥` on revient à la liste des outils. On peut choisir celui que l’on veut exécuter, puis faire `⇥` pour choisir le faux-bouton « ↩︎ Exécuter » et exécuter l’outil.

> Noter que dans cet exemple, on omet de dire qu’un simple `↩︎` sur l’outil sélectionné permet de l’exécuter.

---





---

[classes spécialisées]: #spec-classes
[classe spécialisée]: #spec-classes

