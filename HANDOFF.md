# HANDOFF — Tounes Tycoon
MAJ: 2026-10-19 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes
Idle tycoon tunisien (Capacitor/Android, JS vanilla). 16 commerces progressifs, recrutement multi-gérants, événements, quêtes, pubs AdMob (stub), musique de fond procédurale simple.
UI/UX polie (palette or/émeraude/carmin). Textes derja réécrits en 3 passes — **le client juge encore beaucoup de textes non-tunisiens** → itérer avec ses exemples.
Tests: `npm test` = 7/7. APK non reconstruit depuis ces changements.

## Dépôts — NE PAS CONFONDRE
- **`C:\Projects\tounes-tycoon`** = ce jeu (remote `hafedhhelali/tounes-tycoon`).
- `C:\Projects\tunisie-quiz` = autre projet (quiz Flutter « Ta3ref Tounes ? »). Hors sujet ici.

## Fichiers
| Fichier | Rôle |
|---|---|
| `engine.js` | Core: `TycoonEngine`, `BUSINESS_CONFIGS` (16), événements, quêtes. Pas d'UI. |
| `index.html` | UI + CSS inline + câblage (tick rAF, save localStorage `tounes_tycoon_save`, modales, mini-jeu). |
| `audio.js` | `SoundEngine`: SFX + `startBGM/stopBGM` (arpège Am-F-C-G, basse, sans percussion). |
| `ads_service.js` | `AdPolicy`/`AdsService` (AdMob rewarded: solde gratuit, boost x2 4h). Stub web. |
| `engine.test.js` | 7 tests `node --test`. Attendent 'مواطن يلوّج على مشروع' et 'تاجر مبتدئ'. |
| `www/` | Copie de déploiement Capacitor (webDir). |
| `.github/workflows/build-apk.yml` | CI build APK. |

## Commerces (ordre = progression)
kaskrout, fricasse, kahwa, attariya, patisserie, taxi_collectif, superette, supermarche, salon_de_the, restaurant, agence_voyages (Ella9la9), hotel, centre_commercial, usine_conserves, showroom_auto, tayaran_el_ghzela.
Événements: chheli, derby, aaras, embouteillage. Chaque commerce: `managers[]` (plusieurs recrues, coût croissant), `getNextManager`, multiplicateur staff.

## Workflow livraison (obligatoire, automatique)
```n.\scripts\ship.ps1 "<type>(<scope>): <msg>"   # test, sync www, MAJ HANDOFF/CHANGELOG, commit, push, vérif
```nHook `.githooks/pre-commit` (`git config core.hooksPath .githooks`) bloque un commit de code sans HANDOFF.md + CHANGELOG.md. Toute tâche = MD à jour AVANT livraison, sans qu'on le demande. APK: `npx cap sync android` + build à part.

## Règles (cf. AGENTS.md)
Style télégraphique; diffs minimaux; copyright `© EOLabs 2026 beta`; APK versionné `<base>.<run>-beta`, un seul APK dans `dist/`.

## Dette / pièges connus
- `audio.js` BGM et mini-jeu utilisent `setInterval` (AGENTS.md l'interdit pour le gameplay). BGM = scheduler lookahead sur `ctx.currentTime` (acceptable); mini-jeu à migrer vers deltas `Date.now()`.
- Avertissement Git LF→CRLF: bénin.
- Sous-agents: toujours leur donner le chemin `C:\Projects\tounes-tycoon` (une fois ils ont cherché dans tunisie-quiz et n'ont rien trouvé).
- Un agent qui dit « poussé » doit prouver avec `git log`/`status`.

## TODO
1. Derja: demander au client 3-4 textes fautifs, corriger, relire tout selon ce modèle (noms, rôles, événements, quêtes, toasts).
2. Vérif visuelle mobile (émulateur/APK) de la refonte UI.
3. `npx cap sync android` + build APK + purge ancien APK.
4. Mini-jeu: timer basé sur timestamps.
5. Écoute réelle de la BGM, ajuster volume/tempo selon retour.

## Mode GitHub-only (sans copie locale)
- Repo: https://github.com/hafedhhelali/tounes-tycoon (branche main). Aucune copie locale requise.
- Éditer: github.dev (touche `.`), Codespaces, ou agent via API GitHub (commits directs / PR).
- CI auto à chaque push: `build-apk.yml` (npm test, copie vers www, cap sync, APK release beta, artifact 14 j) et `docs-guard.yml` (échoue si code modifié sans HANDOFF.md + CHANGELOG.md).
- Donc: tout commit de code DOIT inclure HANDOFF.md + CHANGELOG.md dans le même commit. `www/` et `scripts/ship.ps1` ne sont utiles qu'en local.
- APK: onglet Actions > dernier run > Artifacts.
