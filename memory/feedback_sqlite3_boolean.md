---
name: feedback_sqlite3_boolean
description: SQLite3 gem 2.9.0 refuse TrueClass/FalseClass — convertir boolean en integer avant db.execute
metadata:
  type: feedback
---

SQLite3 gem 2.9.0 (arm64) ne peut pas binder `true`/`false` Ruby directement : `RuntimeError - can't prepare TrueClass`.

**Why:** La gem n'accepte que `nil`, `Integer`, `Float`, `String`.

**How to apply:** Dans tout `db.execute` qui passe une valeur booléenne (ex: `checked`), convertir avec `v ? 1 : 0` avant de mettre dans le tableau de params.

Exemple dans `repo.rb` :
```ruby
v = fields[col]
vals << (col == 'checked' ? (v ? 1 : 0) : v)
```
