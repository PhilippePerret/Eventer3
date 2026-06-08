# Eventer - Options

## Options du projet

Les options par projet sont consignées dans le fichier `eventer.config.js`

### Aspect des items

On a le choix entre :

- aucun style,
- leur style propre (défini avec la touche « s »),
- le style de leur « météo » (climat et effet),
- le style de leur premier brin,
- le style de tous leurs brins (en cascade)
- le style du personnage

### Nom des niveaux

Pour l’affichage des events par niveau, on peut définir le nom des niveaux dans les préférences du projet

---

## Options de l'application

Les options de l’application sont consignées dans le fichier JSON `<dossier data user>/prefs.js` propre à chaque utilisateur.

Ce fichier définit les options suivantes :

| Option                  | Description                                                  | valeurs                                                      |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `modeAffichage`         | Mode d’affichage courant, entre :<br />*EST-CE VRAIMENT NÉCESSAIRE alors qu’il peut être changé très rapidement grâce au raccouci ⌘+`m`* ? | `normal` = par imbrication (comme le Finder)<br />`niveau` = par niveau |
| do-not-confirm-delete   | Quand désactivé on doit confirmer toutes les suppressions. Quand elle est activée, l'app, suppression se fait automatiquement, sans confirmation. | `true`/`false`                                               |
| lock-display-level-mode | En mode « verrouillage du mode d’affichage par niveau », l’affichage des évènements ne bascule pas vers l’afficage par imbrication dès qu’on « entre » dans un event. Au lieu de ça, il change le niveau courant. |                                                              |

​	
