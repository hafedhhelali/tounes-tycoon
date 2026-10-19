# ARCH — Tounes Tycoon

## Couches
```
index.html (UI/CSS/câblage) ──► engine.js (TycoonEngine, état pur)
        │                          ▲
        ├──► audio.js (SoundEngine, Web Audio procédural)
        └──► ads_service.js (AdsService/AdPolicy, AdMob)
```
- **Core isolé** : `engine.js` ne touche pas au DOM. Données dans `BUSINESS_CONFIGS` (nom, tagline, icône, coûts, `managers[]`).
- **Boucle** : `requestAnimationFrame(tick)` dans `index.html`; gains calculés par delta-time réel.
- **Persistance** : `engine.exportState()` → `localStorage['tounes_tycoon_save']`. Gains hors-ligne calculés au réveil (modale offline).
- **Progression** : commerces déverrouillés dans l'ordre; plusieurs recrues par commerce (`getNextManager`), multiplicateur de staff; équipe complète = commerce automatique.
- **Événements** : chheli, derby, aaras, embouteillage (multiplicateurs temporaires).
- **Pubs** : récompense « solde gratuit » et « boost x2 4h » via `AdsService` (stub web, pont natif Android).
- **Audio** : SFX synthétisés; BGM = scheduler lookahead (`setInterval` 50 ms sur `ctx.currentTime`), arpège Am–F–C–G + basse, sans percussion.
- **Build** : `www/` = webDir Capacitor; CI `.github/workflows/build-apk.yml`; appId `tn.eolabs.tounestycoon`.

## Invariants
Pas de logique de jeu dans l'UI. Pas de timer dérivant pour les gains. Nettoyer timers/listeners. Texte UI uniquement en derja.
