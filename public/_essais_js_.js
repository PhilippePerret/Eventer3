class Essai {
  static generateUniqueBadgeFromPatronyme(taken, base){
    let bg
    const words = base.split(/\s+/)
    const word1 = words[0]
    const word2 = words[1]
    const len = base.length
    for(var i1 = 0, len1 = word1.length; i1 < len1; ++ i1) {
      let root = word1[i1]
      for(var i2 = 0, len2 = word2.length; i2 < len2; ++i2){
        if (!taken.has(bg = root + word2[i2])) return bg
      }
    }
    return this.badgePerDepit(word1[0], taken)
  }
  static badgePerDepit(root, taken){
    let bg
    // On essaie avec toutes les lettres avec la première (A->Z)
    for(var c=65;c<90;++c){if (!taken.has(bg = root + String.fromCharCode(c))){ return bg}}
    // On essaie toutes les combinaisons de lettres
    for(c=65;c<90;++c){
      root = String.fromCharCode(c)
      for(var c2=65;c2<90;++c2){
        if (!taken.has(bg = root + String.fromCharCode(c2))){ return bg}
      }
    }
    // Par dépit, on met un nombre de 10 à 99
    for (i = 10; i < 100; ++i) {if (!taken.has(bg = String(i))) return bg }

  }
}

let taken = new Set(['MA', 'MR', 'MI', 'MM'])
/*
// On ajoute les MA à MZ
taken = new Set(['MR','MI', 'MM']) 
for(var c= 65;c <90;++c){taken.add('M' + String.fromCharCode(c))}
//*/
const base = 'MARION MICHEL'
const badge = Essai.generateUniqueBadgeFromPatronyme(taken, base)