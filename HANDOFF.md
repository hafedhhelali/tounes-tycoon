# HANDOFF - Tounes Tycoon
MAJ: 2026-11-06 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v141)
1. Vue projet plein écran (`index.html`) : `.modal-card.biz-immersive` libérée des marges restrictives (largeur 100%, suppression du `max-width: 940px` et padding 0), s'étendant d'un bord à l'autre sans aucun espace noir à gauche ou à droite.
2. Carte Grand Maghreb esthétique & détaillée (`store_animator.js`) : halo aquamarine lagonaire le long de toutes les côtes, graticule nautique avec coordonnées réelles, rose des vents dorée, fleuve du Nil et Pyramides de Gizeh `🔺🔺` en Égypte, et Chott el Djerid cristallin étincelant `✨`.
3. Commandes de zoom & Navigation HUD (`store_animator.js`) : zoom interactif fluide (0.55x à 2.6x avec support pinch-to-zoom 2 doigts), boutons tactiles `➕`, `🇹🇳`, `➖` et barre de saut direct vers les 6 pays frères (`[🇹🇳 تونس] [🇩🇿 الجزائر] [🇲🇦 المغرب] [🇱🇾 ليبيا] [🇪🇬 مصر] [🇲🇷 موريتانيا]`).

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `store_animator.js`, `index.html`, `HANDOFF.md`, `CHANGELOG.md`.
- Suite de tests : 70/70 au vert (`npm test`).
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
