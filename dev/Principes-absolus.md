# Eventer3 - Principes absolus

## Lister et Item

Avant d’implémenter un comportement propre à une [classe spécialisée][], il faut se demander si ça n’est pas plutôt un comportement de tous les `Lister` ou tous les `Items` et donc

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

[classes spécialisées]: #spec-classes
[classe spécialisée]: #spec-classes
