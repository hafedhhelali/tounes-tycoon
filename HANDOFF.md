# HANDOFF - Tounes Tycoon
MAJ: 2026-11-11 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v158)
1. **Config OpenCode projet** (`opencode.json`) : modèle par défaut `opencode-go/beam-free` (illimité/gratuit) pour le dev jeu, instructions AGENTS.md + ARCH.md chargées, watcher ignore dist/www/node_modules/*.apk.
2. **Scènes banque & kiosque épurées à 100%** (`store_animator.js`) : banquier derrière le guichet dessiné après l'arche/comptoir pour zéro recouvrement de tête avec `workFx=false` ; buraliste du kiosque nettoyé de la même façon avec enseigne `🚭 قمريڨ تونس`.
3. **Tests & Intégrité** : 129/129 tests au vert (`npm test`), exécution sandbox `node scripts/test_index_html.mjs` 100% OK sans écran blanc.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `opencode.json`, `store_animator.js`, `index.html`, `.gitignore`, `HANDOFF.md`, `CHANGELOG.md`.
- Suite de tests : 129/129 tests au vert (`npm test`).
- Validation VM sandbox : `node scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
