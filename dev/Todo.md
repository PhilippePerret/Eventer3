# Eventer3 — Todo

* ajouter la propriété `mode` de `Lister` qui permettra de définir si les items sont des projets, des évènements (event normaux ou event script), des brins ou des personnages.
* Des options générale de l’application
  * `open-with-project-list` : une option détermine si l’application doit s’ouvrir sur la liste des projets ou sur le dernier évènemencier travaillé.
* Console pour commander Eventer de l’intérieur « en ligne de console »
* Rendre la propriété `active` propre à `Project < Item` et à personne d’autre. Les autres, lorsqu’ils sont détruits, le sont vraiment (fichiers si nécessaire et dans les données)
* Ajouter les classes `ScriptLister < Lister` et `ScritptItem < Item` comme classes majeures. Noter qu’un évènemencier entier peut être un Lister, mais qu’on peut aussi se contenter de définir certains `Event`s comme des `ScriptItem`s qui permettront de définir le texte final. Noter aussi qu’il peut y avoir des `ScriptEvent`s intermédiaire pour les synopsis par exemple.
* les dates dans l’histoire (trouver le système)
* le climat (météo et « effet » comme on dit en scénario)
