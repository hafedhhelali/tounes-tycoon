# HANDOFF — Tounes Tycoon
MAJ: 2026-11-04T23:16:00.000Z - etat = HEAD de main (v122-welcome-splash-google-profile-and-strict-ad-monetization)

## État en 3 lignes
Animation d'Accueil Royale, Profil Connecté Google (RGPD / Google Play) & Monétisation Stricte Zéro-Solde-Sans-PUB (`v122`) :
1. **Animation d'Accueil (`#welcomeSplashScreen` dans `index.html`)** : Écran d'accueil animé avec blason 3D flottant, titre doré `تونس تايكون` à reflet animé, sous-titre `إمبراطورية المال والأعمال • من الحومة إلى القمّة`, barre de progression fluide (`0%` -> `100%`) avec statuts dynamiques et petit texte légal en bas (`© EOLabs 2026`).
2. **Profil Connecté Google Conforme RGPD & Google Play (`engine.js`, `index.html`)** : Bouton profil `👤` dans le header + section `#googleProfileSection` avec liaison Google (compatible Google Identity Services + sauvegarde locale dédiée), synchronisation en 1 clic et bouton de déconnexion/suppression immédiate des données (RGPD).
3. **Politique Stricte PUB (`ads_service.js`, `index.html`, `store_animator.js`)** : Suppression de toutes les options donnant du solde gratuit sans PUB (suppression de `#tobaccoTipBtn`, suppression des gains instantanés hors-cycle dans `onCollect` et `triggerServe`) et passage obligatoire de toute accélération ou bonus (`تيربو x2`, `عجلة الحظ`, `صندوق الحظ`, `بريم`, `تحديات`, `شكبة`) par le lecteur publicitaire `AdsService.showRewardedBoost()`.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Modifs : `ads_service.js`, `engine.js`, `engine.test.js`, `store_animator.js`, `index.html`, `www/*`.
- Suite de tests : 70/70 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.
