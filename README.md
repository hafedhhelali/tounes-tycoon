# Tounes Tycoon
Idle tycoon tunisien : de kiosque à casse-croûte jusqu'à la compagnie aérienne *Tayaran El Ghzela*. 17 commerces, gérants à recruter, événements (chhili, derby, mariages, embouteillage), quêtes, pubs récompensées, musique d'ambiance.

Stack : JS vanilla (ES modules) + Capacitor Android. Textes en derja tunisienne.

## Dev
```
npm install
npm test            # node --test (7 tests)
```
Ouvrir `index.html` via un serveur statique. Déploiement : copier `index.html engine.js audio.js ads_service.js` dans `www/`, puis `npx cap sync android`.

## Doc
- `HANDOFF.md` : état, workflow, TODO (à lire en premier)
- `ARCH.md` : architecture
- `CHANGELOG.md` : historique
- `AGENTS.md` : règles agents

© EOLabs 2026 beta
