# HANDOFF — Tounes Tycoon
MAJ: 2026-11-04T17:28:00.000Z - etat = HEAD de main (v120-authentic-tunisian-darja-and-zero-overflow-ergonomics)

## État en 3 lignes
Révision Linguistique Darja Tunisienne 100% Authentique & Ergonomie Zéro-Débordement (`v120`) :
1. **Darja Tounsia Pure (`engine.js`, `index.html`, `store_animator.js`)** : Suppression intégrale des expressions machrékines/syriennes (`مطعم ابو علي الشامي` -> `مطعم المصلّي والمشوي`, `الحناء الجبسية` -> `الحنّة القابسية`, `الحوت الشامي` -> `الحوت الأزرق`, `قرصة كستناء` -> `طرشية بندق ولوز`), administratives Fusha (`بيع مشتقات الحليب...` -> `حليب وأجبان باجة`, `جزارة وبيع اللحوم...` -> `جزّار اللحم البلدي`, `سجائر` -> `دخّان وطني`, `دوريات الشرطة` -> `دوريات الحاكم`, `فيش` -> `جيتون`, `مطماطة الشمال` -> `مطمورة الشمال`) et des parenthèses françaises (`(Showroom Auto)`, `(Croisières en mer)`).
2. **Ergonomie Canvas 2D & CSS Zéro-Coupure / Zéro-Débordement** : Suppression des `.slice(0, 8)` et `.slice(0, 48)` qui coupaient les mots arabes sur la carte (`drawCaravanAnimation`, `drawSelectedCityOverlay`) au profit d'un auto-dimensionnement dynamique (`measureText` + `maxWidth`), bornage anti-collision entre `bonusDesc` et le bouton d'action de la carte, et durcissement CSS (`overflow-wrap: break-word`, `max-width`) sur les cartes et toasts.
3. **Intégrité des Tests** : 68/68 tests unitaires au vert (`npm test`).

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Modifs : `engine.js`, `store_animator.js`, `index.html`, `www/*`.
- Suite de tests : 68/68 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.
