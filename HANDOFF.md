# HANDOFF — Tounes Tycoon
MAJ: 2026-10-24 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes
Voyage Inter-Villes & Carte : bouton carrefour « تحب تسافر ؟ افتح خريطة تونس 🗺️ » ouvrant la carte SVG interactive des 14 villes, avec voyage animé de 2.2s en voiture 🚗, faisceau de phares, traînée dorée et indicateur kilométrique.
Correction visuelle intégrale (Capture) : ardoise menu adaptée au métier (`فريكاسي وبمبلوني` vs `كسكروت`), enseigne néon agrandie sans texte coupé, plaque dorée auto-redimensionnée, bulles clients surélevées au-dessus de la tête (visages 100% visibles).
HUD Top Immersif : délimitation stricte du titre et du slogan avec contrainte de largeur et media queries, éliminant tout chevauchement avec les pastilles de statistiques. Tests 66/66 PASS.

## Dépôts — NE PAS CONFONDRE
- **`C:\Projects\tounes-tycoon`** = ce jeu (remote `hafedhhelali/tounes-tycoon`).
- `C:\Projects\tunisie-quiz` = autre projet (quiz Flutter « Ta3ref Tounes ? »). Hors sujet ici.

## Fichiers
| Fichier | Rôle |
|---|---|
| `engine.js` | Core: `TycoonEngine`, `BUSINESS_CONFIGS` (17), événements, quêtes. Pas d'UI. |
| `index.html` | UI + CSS inline + câblage (tick rAF, save localStorage `tounes_tycoon_save`, modales, mini-jeu, carte interactive). |
| `store_animator.js` | Canvas 2D: Rendu rue vectorielle, carte 14 villes, voyages animés, intérieur boutiques, animations métiers, clients et piétons. |
| `assets_library.js` | Bibliothèque vectorielle procédurale d'assets tunisiens (palettes, props, FX). |
| `audio.js` | `SoundEngine`: SFX + `startBGM/stopBGM` (arpège Am-F-C-G, basse, sans percussion). |
| `ads_service.js` | `AdPolicy`/`AdsService` (AdMob rewarded: solde gratuit, boost x2 4h). Stub web. |
| `engine.test.js` | Tests unitaires du moteur de jeu et progression des 14 villes. |
| `www/` | Copie de déploiement Capacitor (webDir). |
| `.github/workflows/build-apk.yml` | CI build APK. |

## Commerces (ordre = progression)
kaskrout (نصبة كسكروت عياري), fricasse (فريكاسي وبمبلوني سخون), kahwa, attariya (عطريّة ولد الحومة), patisserie, taxi_collectif, superette (سوبيرات الحومة), supermarche (المغازة العامّة), salon_de_the (صالون شاي البحيرة), restaurant (مطعم ابو علي الشامي), agence_voyages (وكالة اسفار اللقلق), hotel, centre_commercial, usine_conserves, showroom_auto, promoteur_immobilier (الشركة العقارية اللجّ الازرق), tayaran_el_ghzela (شركة طيران الغزالة).
Événements: chheli, derby, aaras, embouteillage. Chaque commerce: `managers[]` (plusieurs recrues, coût croissant), `getNextManager`, multiplicateur staff.

## Workflow livraison (obligatoire, automatique)
```
.\scripts\ship.ps1 "<type>(<scope>): <msg>"   # test, sync www, MAJ HANDOFF/CHANGELOG, commit, push, vérif
```
