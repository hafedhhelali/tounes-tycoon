# HANDOFF — Tounes Tycoon
MAJ: 2026-10-26T21:38:00.000Z - etat = HEAD de main (v117-sync-www-visible-interior-anims-lock-reasons)

## État en 3 lignes
Synchronisation `www/` & Cache-Busting `?v=117` : Tous les fichiers (`index.html`, `store_animator.js`, `engine.js`, `audio.js`) synchronisés dans `www/` pour prise en compte immédiate dans l'app/serveur.
Animations intérieures 100% visibles même sans employés : Les machines spécialisées ne sont plus masquées par les boutons `خدّم`, avec spectacle central animé en continu (`drawCentralActionShowcase`).
Raison des villes bloquées triple affichage : Sous chaque épingle verrouillée de la carte (`🔒 برستيج 1`, `🔒 4xL35`), dans le bandeau Popover pleine largeur (`⚠️ علاش مقفولة : ...`) et en modale/toast au clic (`window.showFeedbackToast`).

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Modifs : `index.html`, `store_animator.js`, `www/*`.
- Suite de tests : 67/67 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.
