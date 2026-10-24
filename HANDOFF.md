# HANDOFF — Tounes Tycoon
MAJ: 2026-10-24 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes
Nouvelle icône d'appli (pièce dorée + emblème tunisien sur fond rouge, `scripts/gen_icon.ps1` régénère mipmaps + assets/icon.png); textes de la vue projet plus cropés (line-height, wrap, tiroir scrollable si besoin, rôle auto-ajusté); employés dessinés en vectoriel animé (`drawWorker`: toque/casque/chéchia, bras actifs, clignement).
Fix: toast d'erreur au-dessus des popups (z 500, en haut) → achats/recrutements impossibles = enfin visibles; boucles rAF (tick, Quartier, Store) protégées par try/catch; navigation quartiers bidirectionnelle (panneaux suivant+précédent par carrefour); tap sur la scène = servir (revenu); boutons « خدّم » lisibles (halo + prix); plus de mention « caisse »; chip الرصيد live dans la vue projet.
Vue « ادخل للمحلّ » immersive : canvas `CanvasStoreEngine` plein popup (échelle uniforme, hauteur logique 200, clics remappés), HUD en superposition (barre haute: identité+chiffres+✕, barre basse: amélioration+onglets), tiroir glass `#bizDrawer` fermé par défaut (Staff/Recette/Activité), ambiance animée (lanternes, rayons, poussière, vignette).
Acquis: roue = pub systématique, cartes Chkobba lisibles, popups zéro-scroll, passants/véhicules/carrefours détaillés, clic hors popup, toast `ناقصك فلوس`, reset → `bab_souika`.
Tests: npm test = 12/12 PASS.
Correctifs UX & Bugs : roue de la fortune déclenchant systématiquement la publicité vidéo (`showRewardedBoost`), correction de l'affichage des cartes du mini-jeu Chkobba (contraste `.card-val`/`.card-suit` + layout paysage 2 colonnes), fermeture au clic hors popup, toast `ناقصك فلوس` et retour au 1er quartier (`bab_souika`) sur reset/prestige.
Modales 100% Zéro-Scroll en mode paysage sur toutes les popups (`minigameModal`, `wheelModal`, `prestigeModal`, `bizDetailModal`, `settingsModal`, `legalModal`, `zonesModal`, `startGuideModal`). Tests: npm test = 12/12 PASS.

## Dépôts — NE PAS CONFONDRE
- **`C:\Projects\tounes-tycoon`** = ce jeu (remote `hafedhhelali/tounes-tycoon`).
- `C:\Projects\tunisie-quiz` = autre projet (quiz Flutter « Ta3ref Tounes ? »). Hors sujet ici.

## Fichiers
| Fichier | Rôle |
|---|---|
| `engine.js` | Core: `TycoonEngine`, `BUSINESS_CONFIGS` (17), événements, quêtes. Pas d'UI. |
| `index.html` | UI + CSS inline + câblage (tick rAF, save localStorage `tounes_tycoon_save`, modales, mini-jeu). |
| `audio.js` | `SoundEngine`: SFX + `startBGM/stopBGM` (arpège Am-F-C-G, basse, sans percussion). |
| `ads_service.js` | `AdPolicy`/`AdsService` (AdMob rewarded: solde gratuit, boost x2 4h). Stub web. |
| `engine.test.js` | 7 tests `node --test`. Attendent 'مواطن يلوّج على مشروع' et 'تاجر مبتدئ'. |
| `www/` | Copie de déploiement Capacitor (webDir). |
| `.github/workflows/build-apk.yml` | CI build APK. |

## Commerces (ordre = progression)
kaskrout (نصبة كسكروت عياري), fricasse, kahwa, attariya, patisserie, taxi_collectif, superette (سوبيرات الحومة), supermarche (المغازة العامّة), salon_de_the (صالون شاي البحيرة), restaurant (مطعم ابو علي الشامي), agence_voyages (وكالة اسفار اللقلق), hotel, centre_commercial, usine_conserves, showroom_auto, promoteur_immobilier (الشركة العقارية اللجّ الازرق), tayaran_el_ghzela (شركة طيران الغزالة).
Événements: chheli, derby, aaras, embouteillage. Chaque commerce: `managers[]` (plusieurs recrues, coût croissant), `getNextManager`, multiplicateur staff.

## Workflow livraison (obligatoire, automatique)
```
.\scripts\ship.ps1 "<type>(<scope>): <msg>"   # test, sync www, MAJ HANDOFF/CHANGELOG, commit, push, vérif
```
Hook `.githooks/pre-commit` (`git config core.hooksPath .githooks`) bloque un commit de code sans HANDOFF.md + CHANGELOG.md. Toute tâche = MD à jour AVANT livraison, sans qu'on le demande. APK: `npx cap sync android` + build à part.

## Règles (cf. AGENTS.md)
Style télégraphique; diffs minimaux; copyright `© EOLabs 2026 beta`; APK versionné `<base>.<run>-beta`, un seul APK dans `dist/`.

## Dette / pièges connus
- **Règle absolue Click Bug (Mémorisation)** : Interdiction d'utiliser `history.pushState` ou d'écouter `popstate` sur la boucle principale ; sur mobile/PWA cela désynchronise l'arbre d'événements et bloque les clics (pointer events). Tout bouton retour passe par le bridge Capacitor natif (`backButton` listener) ou l'événement `backbutton` document uniquement.
- `audio.js` BGM et mini-jeu utilisent `setInterval` (AGENTS.md l'interdit pour le gameplay). BGM = scheduler lookahead sur `ctx.currentTime` (acceptable); mini-jeu à migrer vers deltas `Date.now()`.
- Avertissement Git LF→CRLF: bénin.
- Sous-agents: toujours leur donner le chemin `C:\Projects\tounes-tycoon` (une fois ils ont cherché dans tunisie-quiz et n'ont rien trouvé).
- Un agent qui dit « poussé » doit prouver avec `git log`/`status`.

## TODO
1. Vérif visuelle mobile (émulateur/APK) de la refonte UI et du rythme de progression.
2. `npx cap sync android` + build APK local si besoin hors CI.
3. Mini-jeu: timer basé sur timestamps.
4. Écoute réelle de la BGM, ajuster volume/tempo selon retour.

## Mode GitHub-only (sans copie locale)
- Repo: https://github.com/hafedhhelali/tounes-tycoon (branche main). Aucune copie locale requise.
- Éditer: github.dev (touche `.`), Codespaces, ou agent via API GitHub (commits directs / PR).
- CI auto à chaque push: `build-apk.yml` (npm test, copie vers www, cap sync, APK release beta, artifact 14 j) et `docs-guard.yml` (échoue si code modifié sans HANDOFF.md + CHANGELOG.md).
- Donc: tout commit de code DOIT inclure HANDOFF.md + CHANGELOG.md dans le même commit. `www/` et `scripts/ship.ps1` ne sont utiles qu'en local.
- APK: onglet Actions > dernier run > Artifacts.
