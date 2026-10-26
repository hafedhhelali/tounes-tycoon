# HANDOFF — Tounes Tycoon
MAJ: 2026-10-26T20:51:00.000Z - etat = HEAD de main (v115-fix-map-hitbox-police-spawn-full-criteria)

## État en 3 lignes
Critères villes débloquées 100% lisibles : Suppression du `.slice(0,24)` (affichant désormais le critère complet sans troncature) et synchronisation pixel-perfect de la hitbox de clic.
Patrouille Dawreyya instantanée : Spawn immédiat sur le bord de l'écran visible (`cameraX`), vitesse portée à 240px/s et sirène réaliste prolongée à 2.5s.
Qualité & performance : 67/67 tests au vert, zéro freeze ni fuite mémoire.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main`).
- Modifs : `store_animator.js`, `audio.js`.
- Suite de tests : 67/67 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.
