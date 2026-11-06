# ARCH — Tounes Tycoon

## Couches
```
index.html (UI/CSS/câblage) ──► engine.js (TycoonEngine, état pur)
        │                          ▲
        ├──► audio.js (SoundEngine, Bus Master compresseur + polyphonie Maqam)
        ├──► store_animator.js (QuartierAnimator 60 FPS, CanvasStoreEngine)
        └──► ads_service.js (AdsService/AdPolicy, AdMob)
```
- **Core isolé** : `engine.js` ne touche pas au DOM. Données dans `BUSINESS_CONFIGS` (nom, tagline, icône, coûts, `managers[]`).
- **Rendu Visuel 2D 60 FPS** : `store_animator.js` anime la rue panoramique, les vitrines biseautées, les éclairages nocturnes et les intérieurs.
- **Boucle** : `requestAnimationFrame(tick)` dans `index.html`; gains calculés par delta-time réel.
- **Persistance** : `engine.exportState()` → `localStorage['tounes_tycoon_save']`. Gains hors-ligne calculés au réveil (modale offline).
- **Progression** : commerces déverrouillés dans l'ordre; plusieurs recrues par commerce (`getNextManager`), multiplicateur de staff; équipe complète = commerce automatique.
- **Dopamine & Rétention** : Mode Joujma Time (Fever x3 15s via jauge de taps), VIPs de rue interactifs (touriste, critique, mariage, artisan), barres de palier visibles (Lv 25, 50, 100, 200).
- **Événements** : chheli, derby, aaras, embouteillage (multiplicateurs temporaires).
- **Pubs** : récompense « solde gratuit » et « boost x2 4h » via `AdsService` (stub web, pont natif Android).
- **Audio** : Bus Master avec DynamicsCompressorNode; SFX cohérents (`playTap`, `playWorkSound`, `playFountainWish`, `playLevelUp`); BGM 4 voix (Oud, Ney LFO vibrato, Kanoun, Darbouka).
- **Build** : `www/` = webDir Capacitor; CI `.github/workflows/build-apk.yml`; appId `tn.eolabs.tounestycoon`.

## Invariants
Pas de logique de jeu dans l'UI. Pas de timer dérivant pour les gains. Nettoyer timers/listeners. Texte UI uniquement en derja.
