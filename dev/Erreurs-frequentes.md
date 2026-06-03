# Eventer - Erreurs fréquentes

*Ci-dessous la liste des erreurs fréquentes que commettent les Intelligences Artificielles.*

**`type`** <h6>**N’EST PAS**</h6> la classe spécialisée minorisée de l’`Item`. C’est un type particulier de l’item en fonction de sa classe spécialisée. Voir `EventType`, `BrinType` etc.

> On n’a pas besoin de connaitre le type de l’élément dans la base de données puisqu’on peut le déduire dans le contexte de l’application (brin_ids ne peut faire référence qu’à des Brins, item_ids ne peut faire référence qu’à des items naturels — cf. ci-dessous — de l’item qui les possède et, au pire, on peut le déduire de sa première lettre d’identifiant.

**`lister_id`** <h6>**N’EST PAS**</h6> l’identifiant d’un `Lister` auquel *appartiendrait* l’`Item`. `lister_id` est l’identifiant du `Lister` de l’`Item`. Les appartenances se gèrent par la propriété **`item_ids`** (pour les Items de même classe), **`brin_ids`** (pour les brins) et **`perso_ids`** (pour les personnages). Si l’item est un projet (`Project`), **`brin_ids`** est la liste ordonnées de tous ses brins.

~~~
Item

+String lister_id => son Lister (= ses sous-items)
+String[] brin_ids => Ids ordonnés des brins de l'Item
~~~



**`path`** <h6>**N’EST PAS**</h6> le quelconque chemin d’accès aux données persistantes de l’`Item` mais un chemin d’accès à un fichier quelconque où est écrit un texte quelconque en rapport avec l’Item.



### Brins du projets

Comme cela est expliqué ci-dessus, la LISTE DES BRINS DU PROJET est contenu dans sa propriété **`brin_ids`** qui est une liste **ordonnées** de tous les **identifiants** des items `Brin` (donc des `bXXX`).

### Personnages du projet

Tandis que la LISTE DES PERSONNAGES DU PROJET est contenu dans sa propriété **`perso_ids`** qui est une liste **ordonnée** de tous les **identifiants** des items `Perso` (donc des `pXXX`).

### Items d’un item (`item_ids`)

Il ne peut y avoir aucune ambigüité quant à la nature des items des la propriété **`item_ids`** d’un `Item` entendu qu’une classe données ne peut que posséder des Items d’une unique nature. En voici la table :

| Classe        | Classe des items (`item_ids`)       | Id     |
| ------------- | ----------------------------------- | ------ |
| **`Project`** | `Event`                             | `eXXX` |
| **`Event`**   | `Event`                             | `eXXX` |
| **`Brin`**    | `Brin`                              | `bXXX` |
| **`Perso`**   | `Perso`                             | `pXXX` |
| **`Script`**  | --- (c’est la dernière imbrication) | `sXXX` |

