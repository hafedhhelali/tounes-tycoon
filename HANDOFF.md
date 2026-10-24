# HANDOFF — Tounes Tycoon
MAJ: 2026-10-24 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes
Attariya enrichie : décor d'épicerie garnie (conserves, lait, fromage, œufs, carnet de crédit « الكرني »), balance Berkel à plateaux animée en pesée.
Simulation d'achat en temps réel : clients emportant l'article acheté en main et piétons de rue prenant des articles au vol devant les commerces traversés.
Refontes graphiques : badge niveau sorti sur le toit, enseigne 100% sans coupure, portique autoroutier 3D épuré, portes nobles en pierre Kadhel, voiture 🚗 animée avec phares. Tests 66/66 PASS.

## Dépôts — NE PAS CONFONDRE
- **`C:\Projects\tounes-tycoon`** = ce jeu (remote `hafedhhelali/tounes-tycoon`).
- `C:\Projects\tunisie-quiz` = autre projet (quiz Flutter « Ta3ref Tounes ? »). Hors sujet ici.

## Fichiers
| Fichier | Rôle |
|---|---|
| `engine.js` | Core: `TycoonEngine`, `BUSINESS_CONFIGS` (17), événements, quêtes. Pas d'UI. |
| `index.html` | UI + CSS inline + câblage (tick rAF, save localStorage `tounes_tycoon_save`, modales, mini-jeu). |
| `store_animator.js` | Canvas 2D: Rendu rue vectorielle, enseignes dynamiques, intérieur boutiques, animations métiers, clients et piétons. |
| `assets_library.js` | Bibliothèque vectorielle procédurale d'assets tunisiens (palettes, props, FX). |
| `audio.js` | `SoundEngine`: SFX + `startBGM/stopBGM` (arpège Am-F-C-G, basse, sans percussion). |
| `ads_service.js` | `AdPolicy`/`AdsService` (AdMob rewarded: solde gratuit, boost x2 4h). Stub web. |
| `engine.test.js` | Tests unitaires du moteur de jeu et progression des 14 villes. |
| `www/` | Copie de déploiement Capacitor (webDir). |
| `.github/workflows/build-apk.yml` | CI build APK. |

## Commerces (ordre = progression)
kaskrout (نصبة كسكروت عياري), fricasse, kahwa, attariya (عطريّة ولد الحومة), patisserie, taxi_collectif, superette (سوبيرات الحومة), supermarche (المغازة العامّة), salon_de_the (صالون شاي البحيرة), restaurant (مطعم ابو علي الشامي), agence_voyages (وكالة اسفar اللقلق), hotel, centre_commercial, usine_conserves, showroom_auto, promoteur_immobilier (الشركة العقارية اللجّ الازرق), tayaran_el_ghzela (شركة طيران الغزالة).
Événements: chheli, derby, aaras, embouteillage. Chaque commerce: `managers[]` (plusieurs recrues, coût croissant), `getNextManager`, multiplicateur staff.

## Workflow livraison (obligatoire, automatique)
```
.\scripts\ship.ps1 "<type>(<scope>): <msg>"   # test, sync www, MAJ HANDOFF/CHANGELOG, commit, push, vérif
```
