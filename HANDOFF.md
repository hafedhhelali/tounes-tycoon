# HANDOFF - Tounes Tycoon
MAJ: 2026-11-06 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v137)
1. Compositeur audio polyphonique 4 voix procédural tunisien (`audio.js`) : Oud basse + accords maqâm Hijaz, flûte Ney avec vibrato LFO, Kanoun et Darbouka Malfouf à horloge audio déterministe et zéro fuite mémoire.
2. Écran d'accueil royal et ergonomie des boutons 3D (`index.html`) : nouvel emblème vectoriel autonome, mise en page paysage anti-débordement sous 520px, et boutons tactiles en relief biseauté (min 44px, `:active { transform: translateY(3px) }`).
3. Google Ads, Mentions Légales & Cookies RGPD / INPDP (`index.html`) : SDK Google Ads / AdMob, bannière de consentement non-intrusive et panneau de réglage des cookies avec persistance locale `tounes_cookie_consent`.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Modifs récentes : `audio.js`, `index.html`, `HANDOFF.md`, `CHANGELOG.md`.
- Suite de tests : 70/70 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.
