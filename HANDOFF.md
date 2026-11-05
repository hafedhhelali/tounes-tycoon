# HANDOFF — Tounes Tycoon
MAJ: 2026-11-05T01:20:00+01:00 - etat = HEAD de main (v125-dynamic-cashier-prices-inline-hire-buttons-dismiss-outside)

## État en 3 lignes (v125)
1. Caisses dynamiques : le prix affiché sur les caisses (comptoir, écrans POS supermarché, tabac, agences) s'actualise en temps réel à chaque montée de niveau (+1.5%/niveau) au lieu de rester figé sur le prix de base.
2. Recrutement direct : bouton clair et élégant (`➕ انتداب` / `➕ خدّم`) avec coût formaté (`DT`) placé exactement au niveau de la place libre (caisses vacantes, bureaux assistants, postes artisans).
3. Fermeture au clic extérieur : disparition instantanée du tiroir employés (`الخدّامة`) et menu (`اللائحة`) au tap extérieur, fermeture fiable de toutes les modales au clic hors de `.modal-card`.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Modifs : `store_animator.js`, `index.html`, `CHANGELOG.md`, `HANDOFF.md`, `www/*`.
- Suite de tests : 70/70 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.
