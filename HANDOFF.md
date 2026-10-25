# HANDOFF — Tounes Tycoon
MAJ: 2026-10-25T21:35:00.000Z - etat = HEAD de main (v104-bizerte-travel-fix-and-clean-gain-text)

## État en 3 lignes
Map & Villes : Fix du blocage 99% sur Bizerte (seuil d'arrivée robuste >= 0.999 + polyfill roundRect + bascule ville garantie).
Projets : Bulles de gains et messages de tap affichent du texte brut propre sans balises HTML via formatCurrencyPlain.
Intégrité & Tests : 66/66 tests unitaires au vert, ESM validé, commit et push origin/main synchronisés.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main`).
- Dernier commit : fix(v104): fix bizerte travel 99 percent lock with robust arrival check, use plain currency text in bubbles and float text
- Suite de tests : 66/66 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.
