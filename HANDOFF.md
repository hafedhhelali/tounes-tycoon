# HANDOFF — Tounes Tycoon
MAJ: 2026-10-25T18:35:00.000Z - etat = HEAD de main (v96-map-fix)

## État en 3 lignes
Architecture Carte & Canvas : dimensionnement robuste avec fallback garanti, suppression des timers concurrents de resize effaçant la carte.
Boutons & Repères Graphiques : isolation de la popover de ville hors défilement vertical (`panY`), hitboxes tactiles 100% réactives pour la sélection et le voyage.
Dégel Solde & Finitions UI : rentrées d'argent immédiates au portefeuille, étagères en olivier, caisse tactile et paramètres sans coupure.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main`).
- Dernier commit : fix map canvas sizing and buttons
- Suite de tests : 66/66 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.
