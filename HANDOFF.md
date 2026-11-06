# HANDOFF - Tounes Tycoon
MAJ: 2026-11-06 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v136)
1. Résolution du démarrage mobile Android/Capacitor : suppression du code exécutable inséré entre les imports ESM (`window.soundEngine`), suppression des paramètres de version (`?v=...`) incompatibles avec la résolution d'assets locaux sur WebView Android, et remplacement de l'import dynamique par un import statique propre.
2. Failsafe Splash Screen & Erreurs : ajout d'un minuteur de secours indépendant (3.5s) garantissant la fermeture du rideau d'accueil royal même si un script tarde ou échoue, et capture globale des erreurs pour diagnostic immédiat.
3. Encodage AGENTS.md restauré : AGENTS.md réécrit en UTF-8 pur sans octets corrompus ni mojibake.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Modifs : `index.html`, `AGENTS.md`, `scripts/ship.ps1`, `.github/workflows/build-apk.yml`, `HANDOFF.md`, `CHANGELOG.md`.
- Suite de tests : 70/70 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.
