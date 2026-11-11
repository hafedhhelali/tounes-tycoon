# HANDOFF - Tounes Tycoon
MAJ: 2026-11-11 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v167)
1. **Suppression pays étrangers & focus 100% Tunisie** (`store_animator.js` & `index.html`) : suppression de la liste des pays voisins (pilules et silhouettes Maroc, Algérie, Libye, Égypte, Mauritanie supprimées). Carte et titre unifiés : `خريطة تونس الخضراء 🇹🇳`.
2. **Navigation régionale optimisée & routes réelles** (`store_animator.js`) : chips de navigation par région (`تونس كاملة 🇹🇳`, `الشمال 🌾`, `الساحل 🏖️`, `الوسط 🏛️`, `الجنوب 🌴`), 26 villes et gouvernorats tunisiens intégrés (Tabarka, Jendouba, Zaghouan, Siliana, Mahdia, Kasserine, Sidi Bouzid, Kébili/Douz, Zarzis, Remada...) et réseau routier réaliste (A1, A3, A4, GP16 Chott El Jerid, Voie Romaine El Kantara, Bac Jorf...).
3. **Tests & Intégrité** : 150/150 tests au vert (`npm test`), sandbox VM `node scripts/test_index_html.mjs` 100% OK, zéro régression.

## État en 3 lignes (v166)
1. **Onglet 'الخريطة' restauré & unifié** (`index.html`) : onglet nav `#tabBtnZones` libellé `الخريطة` avec badge ville active, titres unifiés, header pill `#openMapBtn` câblé sur `switchTab('zones')`, et bouton retour `#returnToStreetBtn` ("🏪 رجوع للشارع ←") propre dans le header sans collision canvas.
2. **Clics carte & HUD 100% opérationnels** (`store_animator.js`) : séparation stricte monde 2D (zoom/pan/offset) vs écran HUD/overlays (boutons zoom, pilules pays, carte basse cliqués et dessinés en espace écran direct). Hitboxes villes élargies (52px), clic ville active avec retour direct rue, seuil drag 16px anti-jitter.
3. **Tests & Intégrité** : 136/136 tests au vert (`npm test`), suite `tunisia_map.test.js` complète, sandbox VM `node scripts/test_index_html.mjs` 100% OK, zéro régression.

## État en 3 lignes (v165)
1. **Guichet de banque dégagé** (`store_animator.js` & `index.html`) : guichet surélevé (`by=86`, sol dégagé à 50px), actions Dépôt/Retrait compactées en grille 2 colonnes ergonomique (hauteur divisée par 2, zéro masquage ni défilement).
2. **Carte démarrage & fluidité 60 FPS** (`store_animator.js` & `index.html`) : échelle responsive (`0.48..1.25`), centrage auto direct sur la ville active (`onOpen()`, `focusCity()`), mise en cache offscreen (`bgCanvas`) et élimination des `shadowBlur` (rendu à 60-120 FPS constant).
3. **Tests & Intégrité** : 129/129 tests au vert, sandbox VM OK, code synchronisé.

## État en 3 lignes (v164)
1. **Bouton retour renommé** (`index.html`) : `returnToStreetBtn` libellé `الخريطة` (🗺️).
2. **Animation taxi** + carte recentrée + UI tweaks (v160-v163).
3. **Tests & Intégrité** : 129/129 tests au vert, sandbox OK.

## État en 3 lignes (v163)
1. **Animation rue taxi** (`store_animator.js`) : piéton héle un taxi, taxi s’arrête, bulle "mekech fi thniti", repart ; bras levé.
2. **Carte recentrée sur Tunis** + bouton map supprimé + bouton retour restauré.
3. **Tests & Intégrité** : 129/129 tests au vert, sandbox OK.

1. **Bouton carte visible** (`index.html`) : ajout `#openMapBtn` "🗺️ الخريطة" dans `header-system-actions`, câblé à l'ouverture de `#zonesModal`.
2. **Bouton profil visible** (`index.html`) : ajout `#openProfileBtn` "👤 البروفيل" ouvrant le modal profil/settings (settings à l'intérieur).
3. **Prime + sortie** (`index.html`) : ajout bouton `#closeLeaguePanelBtn` "رجوع للشارع" dans `#panelLeague` pour revenir au tab businesses.
4. **Banque compacte** (`index.html`) : canvas agrandi (170px), boutons/textes réduits pour ne plus masquer l'agent.
5. **Tests & Intégrité** : 129/129 tests au vert, sandbox OK.

## État en 3 lignes (v162)
1. **Bouton settings supprimé** (`index.html`) : `openSettingsBtn` (⚙️) retiré du header ; wiring déjà gardé.
2. **Bouton piment inutile supprimé** : clic `joujmaHeroPill` retiré (affichage conservé).
3. **Tests & Intégrité** : 129/129 tests au vert, sandbox OK.

## État en 3 lignes (v161)
1. **Bouton "map" supprimé** (`index.html`) : l'onglet `خريطة تونس` retiré de la barre de navigation ; `returnToStreetBtn` restauré ; wiring JS gardé (`if (tabBtnZones)`).
2. **Carte recentrée sur Tunis** : zoom 1.3 + pan 40, bouton 🇹🇳 cohérent.
3. **Tests & Intégrité** : 129/129 tests au vert, sandbox OK.

## État en 3 lignes (v160)
1. **Carte recentrée sur Tunis** (`store_animator.js`) : vue initiale zoom 1.3 + pan 40 (Tunis au centre), bouton 🇹🇳 centrage Tunisie cohérent ; minPanX -100.
2. **Bouton retour en haut supprimé** (`index.html`) : seul le bouton de navigation onglet reste.
3. **Tests & Intégrité** : 129/129 tests au vert, sandbox OK.

## État en 3 lignes (v159)
1. **Hooks debug CDP headless** (`index.html`) : `window.__bankSceneSims.bank`, `window.__tobaccoSceneSim`, `window.__quartierEngine` exposés pour forcer le rendu rAF en onglet arrière-plan et vérifier les scènes hors UI.
2. **Vérification pixel CDP** : banque intérieure agent visible (peau 47 px + chéchia 23 px + buste 28 px), zéro flamme au-dessus (0 px), badge `الشباك 1` compact en bas ; banque extérieure épuree (DAB 0 px, guichets 0 px, porte conservée) ; kiosque tabac (buraliste 78 px visible, file 0 px, texte rayon 0 px, enseigne بيع الفواكه الجافة seule).
3. **Tests & Intégrité** : 129/129 tests au vert (`npm test`), exécution sandbox `node scripts/test_index_html.mjs` 100% OK sans écran blanc.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `opencode.json`, `store_animator.js`, `index.html`, `.gitignore`, `HANDOFF.md`, `CHANGELOG.md`.
- Suite de tests : 129/129 tests au vert (`npm test`).
- Validation VM sandbox : `node scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
