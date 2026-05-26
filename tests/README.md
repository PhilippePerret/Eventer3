# Tests Eventer

Ces tests pilotent l'application réelle servie par Sinatra. Ils ne dupliquent pas la logique métier dans un fichier de test.

## Installation

Depuis le dossier de l'application :

```bash
cd tests
npm install
npx playwright install chromium
```

## Lancer les tests

```bash
cd tests
npm run test
```

Mode visuel :

```bash
npm run test:ui
```

Les tests peuvent modifier temporairement `data/digestmd5.json`, puis le restaurent en fin de scénario.
