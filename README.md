# Eventer2

Deuxième version plus mure de la gestion des évènemenciers.

## Pour lancer l'application

* `ruby ./app.rb` dans le dossier
* lancer l'app Web Savari *Eventer* (si elle n’existe pas, voir [comment la recréer](#create-eventer-app))

---

<a name=" http://127.0.0.1:46001"></a>

## Création de l’app Eventer

C’est en fait une application Safari App Web

1. Lancer le server (`ruby .app`), 
2. copier l’adresse ouvert, de forme ` http://127.0.0.1:46001`
3. dans Safari, ouvrir une fenêter pointant sur l’adresse
4. dans Safari, choisir le menu « Ajouter au Dock… » ou équivalent,
5. lui donner le nom « EventerX » où « X » peut être le numéro de version,
6. lui coller une des icônes du dossier `doc/icons/`
   1. sélectionner l’icone,
   2. la copier (⌘+c)
   3. afficher l’information (clic sur icône dans le dock > afficher dans Finder)
   4. ouvrir les infos de l’application (⌘+i)
   5. sélection l’icône,
   6. coller la nouvelle (⌘+v)

7. contrôler que c’est bien elle qui est appelée dans le script `scripts/run.sh`

Maintenant, elle est prête 

## Pour le développement avec Claude

Il suffit de double-cliquer sur le script `xprepare_travail.command` pour exécuter automatiquement toutes les opérations ci-dessous.

### Installation des fenêtres Finder

* Jouer le script `xouvrir_fenetres.command` en double cliquant dessus pour ouvrir les fenêtres utiles.


### Lancement de l'application et des tests

* Ouvrir une fenêtre Terminal au dossier de l'application et y jouer le code `zsh xcreate_zip.sh` pour une version actuelle du code qu'il faut à chaque fois donner à l'IA pour ne pas qu'elle se paume.
* Ouvrir une fenêtre Terminal au dossier de l'application et y démarrer le serveur avec `ruby ./app.rb`
* Lancer la Web Safari App `Eventer` pour faire les essais en direct.
* Ouvrir une fenêtre Terminal au dossier `Tests/` et joue `npm run test` pour lancer les tests ou `npm run test --dossier` pour jouer seulement les tests d'un dossier donné.

---


## Pour tuer tous les serveurs

`pkill -9 ruby`
`pkill -9 node` // si tests en route par exemple