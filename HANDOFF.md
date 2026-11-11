# HANDOFF - Tounes Tycoon
MAJ: 2026-11-11 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v161)
1. **Bouton "map" supprimé** (`index.html`) : l'onglet `خريطة تونس` retiré de la barre de navigation ; `returnToStreetBtn` restauré ; wiring JS gardé (`if (tabBtnZones)`).
2. **Carte recentrée sur Tunis** : zoom 1.3 + pan 40, bouton 🇹🇳 cohérent.
3. **Tests & Intégrité** : 129/129 tests au vert, sandbox OK.

## État en 3 lignes (v160)
1. **Carte recentrée sur Tunis** (`store_animator.js`) : vue initiale zoom 1.3 + pan 40 (Tunis au centre), bouton 🇹🇳 centrage Tunisie cohérent ; minPanX -100.
2. **Bouton retour en haut supprimé** (`index.html`) : seul le bouton de navigation onglet reste.
3. **Tests & Intégrité** : 129/129 tests au vert, sandbox OK.

## État en 3 lignes (v159)
1. **Hooks debug CDP headless** (`index.html`) : `window.__bankSceneSims.bank`, `window.__tobaccoSceneSim`, `window.__quartierEngine` exposés pour forcer le rendu rAF en onglet arrière-plan et vérifier les scènes hors UI.
2. **Vérification pixel CDP** : banque intérieure agent visible (peau 47 px + chéchia 23 px + buste 28 px), zéro flamme au-dessus (0 px), badge `الشباك 1` compact en bas ; banque extérieure épuree (DAB 0 px, guichets 0 px, porte conservée) ; kiosque tabac (buraliste 78 px visible, file 0 px, texte rayon 0 px, enseigne بيع الفواكه الجافة seule).
3. **Tests & Intégrité** : 129/129 tests au vert (`npm test`), exécution sandbox `node scripts/test_index_html.mjs` 100% OK sans écran blanc.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `opencode.json`, `store_animator.js`, `index.html`, `.gitignore`, `HANDOFF.md`, `CHANGELOG.md`.
- Suite de tests : 129/129 tests au vert (`npm test`).
- Validation VM sandbox : `node scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
