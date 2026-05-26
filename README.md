# Eventer2

Deuxième version plus mure de la gestion des évènemenciers.

## Pour lancer l'application

* `ruby ./app.rb` dans le dossier
* lancer l'app Web Savari *Eventer*

---

## Pour le développement avec ChatGPT

Il suffit de double-cliquer sur le script `xprepare_travail.command` pour exécuter automatiquement toutes les opérations ci-dessous.

### Installation des fenêtres Finder

* Jouer le script `xouvrir_fenetres.command` en double cliquant dessus pour ouvrir les fenêtres utiles.

### Renseignement de ChatGPT

* Bien dire à l'IA de consulter les fichiers `dev/` en début de développement.
* Lui dire que les tests se trouvent dans `dev/Tests.md` (ajouter les nouveaux tests là aussi)
* Il ne doit fournir que deux fichiers : `app.zip` et `tests.zip`. Mettre toujours ces deux fichiers dans le dossier `tests/` pour les décompresser.
* Surtout au début, 
* Changer souvent de fil de prompt parce que ça devient vite lourd et donc lent.


### Lancement de l'application et des tests

* Ouvrir une fenêtre Terminal au dossier de l'application et y jouer le code `zsh xcreate_zip.sh` pour une version actuelle du code qu'il faut à chaque fois donner à l'IA pour ne pas qu'elle se paume.
* Ouvrir une fenêtre Terminal au dossier de l'application et y démarrer le serveur avec `ruby ./app.rb`
* Lancer la Web Safari App `Eventer` pour faire les essais en direct.
* Ouvrir une fenêtre Terminal au dossier `Tests/` et joue `npm run test` pour lancer les tests ou `npm run test --dossier` pour jouer seulement les tests d'un dossier donné.

---


## Pour tuer tous les serveurs

`pkill -9 ruby`
`pkill -9 node` // si tests en route par exemple