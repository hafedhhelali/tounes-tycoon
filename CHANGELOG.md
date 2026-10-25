## [0.80.0] - 2026-10-24
### Added
- Spécialités régionales adaptées selon la ville (Béja: fromages/laiterie, Tozeur: dattes, Nabeul: poterie, Djerba: artisanat/poterie, Sfax: poissons/fruits de mer).
- Décors urbains tunisiens : station-service (⛽), agence bancaire (🏦), paraboles sur les toits, jardins et oliviers.
- Musique Malouf tunisien classique authentique procédurale (Oud et Kanoun) sans aucun copyright.

### Changed
- Carte de Tunisie : noms de villes épurés (NOM DE VILLE ONLY), hauteur d'affichage minimale garantie à 520px.
- Portes de projets : descendues au sol, badge d'entrée « ادخل 🚪 » agrandi et très contrasté.
- Maisons : suppression des enseignes de texte pour des façades épurées et authentiques.
- Carrefour : suppression de la grande arche « باب العبور بين المدن », bouton voyage élégamment positionné au niveau de la route.
- Onglet projet : renommé en « اللائحة ».
- Solde boutique (bizBalance) : formatage compact adapté sans débordement.
- Audio : coupure automatique du son sur mise en veille (visibilitychange) et sortie de l'application.

# CHANGELOG

## [v93] - 2026-10-25

### Added / Changed
- Soldes indépendants par ville (errassid) : chaque ville gère sa propre trésorerie locale (cityBalances). La fortune globale de l'empire est consolidée et affichée dans le profil/paramètres (statEmpireFortune).
- Nouvelles villes et capitales historiques : ajout de Sbeitla (سبيطلة 🏛️), Annaba (عنابة 🇩🇿) et Tripoli (طرابلس 🇱🇾) avec leurs routes et autoroutes.
- Vente de fruits de mer et poissons frais (fruits_de_mer 🦐) : intégration exclusive pour les villes côtières Sfax, Monastir et Djerba avec recettes traditionnelles et gérants dédiés.
- Célébration et transition fluide vers la rue : animation d'arrivée cinématique et basculement automatique vers la vue de rue du quartier lors de tout arrivée en ville.

## [v92] - 2026-10-25

### Added / Changed
- Isolation intégrale des projets et niveaux par ville : chaque gouvernorat possède son propre parc d'entreprises, ses niveaux d'avancement et sa rentabilité autonome.
- Routage autoroutier et national réaliste : ajout de la RN3 reliant Tunis et Kairouan directement (trajet Kairouan -> Tunis -> Bizerte via RN3 et A4 validé).
- Hitboxes tactiles "اشري المحل" élargies et réactives sur mobile.
- Nettoyage ergonomique du header : déplacement des boutons secondaires (? guide, 📜 mentions) dans les Paramètres, agrandissement des boutons tactiles restants.
- Initialisation immédiate du solde en DT au démarrage de l'application sans gel à 0.
- Clarification du mode البطولة avec bannière explicative des récompenses journalières et de la ligue hebdomadaire.

## [v91] - 2026-10-25

### Added / Changed
- Agrandissement substantiel de la carte géographique (canvas 460x760px, hauteur d'affichage responsive 640px).
- Ajout des pays voisins géographiques limitrophes : Algérie à l'Ouest (`الجزائر 🇩🇿`) et Libye au Sud-Est (`ليبيا 🇱🇾`) avec frontières pointillées.
- Cartographie détaillée des îles tunisiennes : archipel de La Galite (`جالطة`), Zembra & Zembretta (`زمبرة`), archipel des Kerkennah (`قرقنة`), îles Kuriat (`قوريا`) et île de Djerba (`جربة`).
- Défilement tactile vertical ultra-smooth avec capture de pointeur, suivi de vélocité instantanée et inertie physique sans à-coups.

## [v90] - 2026-10-25

### Fixed / Changed
- Rétablissement du glissement manuel dans la rue : correction des bindings d'événements pointer dans `QuartierAnimator` permettant un drag & fling horizontal fluide et sans accroc.
- Clics et entrée dans les projets opérationnels : inspection instantanée au tap sur la façade ou la porte du magasin.
- Remplacement du badge lourd « ادخل » par un panonceau subtil et raffiné « زيارة 🚪 » respectant le style architectural tunisien.
- Bouton carte du ciel agrandi (r=21px, diamètre 42px avec zone tactile élargie) pour un confort tactile immédiat.
- Fiabilisation du bouton autoroutier « افتح خريطة تونس 🚗 » avec ouverture directe de la carte des 14 villes.

## [v89] - 2026-10-25

### Fixed
- Correction critique de la `SyntaxError` dans `store_animator.js` (accolade orpheline post-refactor de la map) qui bloquait l'import ES module et provoquait un écran noir complet.
- Rétablissement total de l'exécution, de tous les boutons de l'interface et du canvas interactif.

## [v88] - 2026-10-25

### Added / Changed
- Système de navigation routière réaliste : les trajets inter-villes suivent désormais fidèlement les autoroutes (A1, A3, A4, GP) avec calcul d'itinéraire (ex: Kairouan -> Sousse -> Tunis -> Bizerte).
- Carte de Tunisie complète & scrollable : intégration d'un défilement vertical tactile/molette fluide (`panY`) permettant d'explorer toutes les régions du Nord verdoyant au Sud saharien (Gabès, Médenine, Djerba).
- Visibilité du bouton carte dans le header renforcée avec badge stylisé (`🗺️ الخريطة`).
- Arrivée en ville conditionnelle : le pop-up et l'effet de niveau (« ارتقيت للمستوى ») s'affichent EXCLUSIVEMENT lors de l'ouverture d'une nouvelle ville. Une simple salutation de voyage s'affiche pour les villes déjà ouvertes.
- Révision réaliste des prix : café dans قهوة شعبية à 1.8 DT, café dans salon de thé à 3.0 DT, menus et articles harmonisés sur toute la grille économique.
- Scroll de la rue rendu ultra-léger et direct (`touch-action: none`, `setPointerCapture`, vélocité instantanée).

## [v87] - 2026-10-25

### Added / Changed
- Début du jeu au Niveau 1 (`مستوى 1`) : chaque ville débloquée propulse le niveau du joueur jusqu'au Niveau 14 (`مستوى 14`).
- Système de titres impériaux évolutifs selon le niveau (`تاجر مبتدئ`, `معلّم الحومة`, `صاحب محلات`, `سيّد الأعمال الجهوي` ... jusqu'à `إمبراطور التجارة التونسية`).
- Synchronisation continue du badge d'en-tête et félicitations visuelles à l'arrivée dans une nouvelle ville.
- Pins de carte enrichis indiquant le niveau actif et popovers de villes avec indication d'étape impériale.
- Économie recalibrée, scroll de rue fluide à inertie, bulles clients uniquement à la caisse.

## [v86] - 2026-10-25

### Added / Changed
- Résolution du crash d'initialisation de `TunisiaMapEngine` (bindings indéfinis retirés, accès window sécurisé) : carte affichée immédiatement sans blocage.
- Hitbox tactile des nœuds de villes agrandie (r=30) pour déblocage et voyage direct d'un simple clic ou toucher.
- Comportement des bulles clients révisé : aucune icône au-dessus de la tête lors de la marche ; apparition de la commande uniquement quand le client arrive au comptoir de la caisse.
- Rééquilibrage macroéconomique réaliste : recalibrage des 5 plus grands projets (centre commercial, usine, showroom, promoteur, compagnie aérienne) pour éliminer les montants astronomiques irréalistes.
- Fluidité du scrolling de rue optimisée : intégration d'inertie physique (fling scroll), vélocité dynamique et suppression des méthodes doublons.

## [v85] - 2026-10-25

### Added / Changed
- Fix bouton achat projet (« اشري ») et clics d'inspection de façade sur mobile et canvas tactile.
- Suppression du panneau « كرني الثقة » dans l'épicerie, remplacé par des rayons authentiques avec conserves, olives et condiments.
- Correction économique du libellé « دورة إنتاج » pour refléter le panier global par cycle et non par client individuel.
- Graphismes et personnages ultra-réalistes : modélisation vectorielle soignée des employés et clients (tenue, démarche, reflets, col, chéchia).
- Fiabilisation interactive de la carte de Tunisie et adaptation multi-résolution.

## [v84] - 2026-10-25

### Added / Changed
- Fix affichage carte de Tunisie dans l onglet zones avec redimensionnement et relance de la boucle d animation.
- Titre de la carte épuré strictement à « خريطة تونس 🇹🇳 ».
- Villes verrouillées signalées avec mention élégante « 🔒 مقفلة ».
- Caissier positionné physiquement derrière le meuble de comptoir au premier plan.
- Caisse enregistreuse moderne et soignée avec touches dorées et écran LED.
- Suppression des étiquettes redondantes (plaque projet sur le comptoir et rôle permanent au-dessus de la tête).
- Affichage du rôle et nom de l employé uniquement au tap/clic.
- Étagères de l épicerie (attariya) diversifiées avec vrais produits tunisiens (harissa, thon, couscous, lait, huile d olive, savon vert).
- Suppression du bouton de revente du commerce.



## 2026-10-25
- feat(v82): independent city business progression, street vendor cart for kaskrout, interactive pan-zoom map with arrival transition
- feat(v82): independent city business progression, street vendor cart for kaskrout, interactive pan-zoom map with arrival transition
- feat(v81): zero parasite memory lifecycle, clean map without grid, single city names, enhanced cafe & grocery

## 2026-10-24
- feat(city-map-audio): regional adaptation, clean map, street decor & classic malouf
- fix(anomalies,travel,hud): fix interior overlapping text, elevated customer bubbles, enlarged neon sign and interactive travel map button
- feat(attariya,anim,signs,car): authentic grocery interior, item pickup animation, rooftop level badge and car travel
- feat(attariya,anim,signs,car): authentic grocery interior, item pickup animation, rooftop level badge, clean 3D crossroad and car travel
- feat(street,anim,cats,ui): floating progress bar, prominent L badge, 3D crossroad, walking cats, authentic kaskrout
- feat(street,anim,cats,ui): floating progress bar over roof, highly visible level badge, single 3D bevelled crossroad sign, walking Tunisian street cats, authentic kaskrout tuna/olives props and zero text overflow
- fix(street,doors,ui): realistic doors, discreet level badge, city names on signs, concise roles
- fix(street,doors,ui): realistic doors, discreet level badge, city names on signs, concise roles
- fix(street,doors,ui): realistic doors, discreet level badge, city names on signs, concise roles
- fix(street,doors,ui): realistic doors, discreet level badge, city names on signs, concise roles
- fix(street,doors,ui): realistic door proportions, discreet level badge on store sign, concise staff role titles, strict city names on crossroad signs without text overflow
- fix(runtime): restore clean startup stability and add futuristic app icon
- fix(runtime): resolve startup blank screen and restore pure modular engine stability
- feat(icon): futuristic cyberpunk mobile icon with neon cyan halo, gold hexagon and quantum star
- feat(graphics,assets): modular procedural assets library, Tunisian palettes and FX engine
- feat(graphics,assets): modular procedural assets library (assets_library.js), Tunisian color palettes, Chibi characters, vehicles and zero-allocation FX engine
- feat(street,anim,hud): direct HUD map, monumental city gates, discrete door entry, 3s auto-close drawer
- feat(street,anim,hud): direct HUD map, monumental city gates, discrete door entry, 3s auto-close drawer
- feat(street,anim,hud): direct HUD map access, monumental Bab El Medina crossroad gates, discrete door engraving, level badge above store sign, 3s auto-dismiss drawer and Tunisian Bourse ticker
- feat(map-street): fix highway buttons door entry vector characters and copy
- feat(map,cities,economy,anim): 14 Tunisian cities map, authentic Bab Arbi doors, advanced store animations, 7arif terminology and corporate expenses system
- feat(icon,ui,anim): new app icon, uncropped project texts, vector animated employees
- fix(ui,nav,anim): visible toasts above popups, bidirectional zone nav, tap-to-serve, clear hire buttons, resilient loops, no cashier wording
- feat(store-view): immersive full-popup canvas scene with overlay HUD, glass drawer and animated ambience
- fix(wheel,chkobba,modals): ad-triggered wheel spin, visible chkobba cards contrast & zero-scroll landscape popups
- feat(anim,ux,fix): detailed pedestrians & vehicles, 3D crossroads, click-outside modal close, fix persistent toast and reset to first zone
- feat(ui,graphics,guide): zero-scroll landscape modals, 3D orb icons, cinematic zone transitions, 60fps tick optimization and quick start guide
- fix(ui,canvas): remove DOM alert banners breaking layout and replace with compact circular icons inside canvas
- feat(world): zone-specific projects, Tunisian houses and animated crossroads per neighborhood
- chore(ci): sort artifacts by workflow run id descending in fetch_apk.ps1
- fix(ui,canvas): remove bottom bar occlusion, render offer & alert icons inside 2D sky canvas, dynamic street groundY
- feat(ui,canvas): fullscreen living 2D street, ultra-sleek HUD and direct shop entrance on tap
- feat(ui,canvas): fullscreen living 2D street, ultra-sleek HUD and direct shop entrance on tap
- fix(anim,lifecycle): mount and start QuartierAnimator before initial renderDOM and theme application
- fix(anim,lifecycle): mount and start QuartierAnimator before initial renderDOM and theme application
  - 🎬 Instant Animation Loop: Instantiated and started `QuartierAnimator` ahead of initial DOM rendering and zone theme binding to prevent idle canvas blanking on startup.
- fix(ui,modal,viewport): fix landscape modal clipping with overflow auto and 94vh max bounds
- fix(ui,modal,viewport): fix landscape modal clipping with overflow auto and 94vh max bounds
  - 🖥️ Full Modal Visibility: Removed `contain: strict` on `.modal-overlay` that clipped tall dialogs in landscape view. Added `overflow-y: auto`, `padding: 10px` and responsive `max-height: 94vh` to `.modal-card`.
  - 📦 APK Run #58 Deployed: Downloaded and verified APK artifact into `dist/tounes-tycoon-58-beta.apk`.
- feat(ui,ads,legal): direct header legal and exit buttons, polished ad reward touchpoints
- feat(ui,ads,legal): direct header legal and exit buttons, polished ad reward touchpoints
- feat(ui,ads,legal): direct header legal and exit buttons, polished ad reward touchpoints
  - 📜 Direct Legal Terms Access: Added quick header button (`📜`) opening the comprehensive legal & privacy modal with full AdMob compliance, data terms and contact details.
  - 🚪 Direct Exit Trigger & Android Back Lock: Integrated dedicated exit button (`🚪`) invoking the Arabic exit confirmation modal (`exitAppModal`), seamlessly paired with native Android onKeyDown hardware interception.
  - 🚀 Polished Ad Touchpoints: Enhanced styling and glow on AdMob rewarded pills (`#adBoostBtn`, `#adCashBtn`) and verified Lucky Drop & Wheel of Fortune ad reward loops.
- fix(android,backbutton): hardware onKeyDown interception to enforce exit confirmation modal
- feat(landscape,world-anim): horizontal layout & 2D panoramic living neighborhood city canvas

## 2026-10-23
- feat(landscape,world-anim): horizontal layout & 2D panoramic living neighborhood city canvas
  - 🔄 Mode Paysage Forcé (Horizontal Only): Configuré `android:screenOrientation="sensorLandscape"` dans `AndroidManifest.xml` et adapté le viewport CSS avec layout responsive panoramique et grille adaptative.
  - 🌆 Moteur Canvas 2D Panoramique 60 FPS du Quartier Tunisien (`QuartierAnimator`): Représentation vivante des 17 projets en façades et échoppes stylisées défilantes avec parallaxe, minarets, horloge municipale, palmiers oscillant au vent et mouettes méditerranéennes.
  - 🚶 Piétons et Circulation Citadine: Citoyens tunisiens qui marchent et visitent les commerces, bulles d'avis populaires, taxis collectifs jaunes et voitures en mouvement, cheminées fumantes et drapeaux tunisiens ondulants.
  - 👑 Évolution Visuelle par Paliers: Ornements de façades évolutifs aux niveaux 25 (émeraude), 50 (royal), 100 (néon éclatant) et 200 (aura d'or mythique).
  - 🎬 Transitions Cinématiques de Quartiers: Passage fluide d'une ville/quartier à l'autre (Bab Souika, La Goulette, Lac 2, Hammamet, Djerba) avec filtre atmosphérique et repositionnement de caméra.
  - 👑 Nouveau Logo 3D Tycoon Royal: Couronne dorée d'empire sculptée, croissant et étoile tunisiens rubis étincelants et halo solaire.
  - 🧪 Qualité & Tests: 100% de tests validés (`npm test` = 12/12 PASS).
- fix(backbutton,ui,simulation): native android back press interception, eliminate modal jitter and tailor business items
- fix(backbutton,ui,simulation): native android back press interception, eliminate modal jitter and tailor business items
  - 🚪 Native Back Button Interception: Implemented `OnBackPressedCallback` in `MainActivity.java` and installed `@capacitor/app` so pressing the phone's hardware back button never exits the game abruptly, cleanly prompting the Arabic exit confirmation modal (`exitAppModal`).
  - 🖥️ Zero Jitter Overlay: Added `contain: strict` and isolated GPU compositing layers on `.modal-overlay` eliminating viewport jitter and repainting tremors when reward/offer modals pop up.
  - 🥖 100% Tailored Business Simulation: Configured custom, contextual Tunisian goods and props across all 17 businesses in `store_animator.js` (including mall, usine conserves, car showroom, promoteur, and airline).
- fix(build,assets): include store_animator.js in www assets and CI workflow to fix app freeze
- fix(build,assets): include store_animator.js in www assets and CI workflow to fix app freeze
- fix(clicks,navigation): eradicate history popstate hijack and prevent click freeze permanently
- fix(clicks,navigation): eradicate history popstate hijack and prevent click freeze permanently
  - 🛡️ Zero Click Freeze: Removed synthetic `history.pushState` / `popstate` hook that hijacked gesture events and froze interactive taps on mobile browsers.
  - 🔒 Hardware Back Isolation: Dedicated listener exclusively on native Capacitor `backButton` and document `backbutton`.
  - 🧠 Anti-Regression Memorization: Formalized rule in `HANDOFF.md` and directives to permanently eliminate navigation-induced click freezes.
- feat(animation): introduce dedicated Canvas2D high-fidelity visual simulation engine for businesses
  - 🎨 High-Definition Canvas 2D Engine (`store_animator.js`): Replaced basic DOM divs with custom HTML5 Canvas 2D rendering pipeline featuring DevicePixelRatio (`dpr = window.devicePixelRatio || 1`) support and 60 FPS requestAnimationFrame loop.
  - 🏪 Authentic Tunisian Store Themes: Architectural backdrops customized per business (zellige frieze, wooden counters, shelves with glass jars, spice pots, espresso machine, plancha grill, pastry rotating oven, shared taxi station).
  - 👥 Active Animated Staff & Stations: Interactive staff positions with animated working cycles, bobbing, rotating tools, cooking steam, active/sleepy states, and direct one-tap hiring zones on canvas.
  - 🚶 Dynamic Customer Lifecycle: Organic walking cadence with bounce and tilt, order thoughts (`☕`, `🥖`, `🚖`, `🍯`), payment interaction at the counter with coin/sparkle particle bursts, satisfied reactions, and natural exits.
  - 🛡️ Zero Memory Leaks: Complete cleanup on modal close via `cancelAnimationFrame`, context clearing, and event listener lifecycle management.
- feat(navigation,uiux,legal): portrait lock, back button navigation with exit modal, legal terms and sleek emote animations
- feat(navigation,uiux,legal): portrait lock, back button navigation with exit modal, legal terms and sleek emote animations
  - 📱 Screen Orientation Lock: Added `android:screenOrientation="portrait"` to AndroidManifest to prevent inverted and unwanted landscape rotations.
  - 🔙 Hardware & UI Back Button Navigation: Modal back stack navigation closing open overlays (`bizDetailModal`, `settingsModal`, etc.) or triggering a clean Arabic exit confirmation modal (`exitAppModal`).
  - 📜 Legal & Privacy Modal (`legalModal`): Complete terms, data protection notice, AdMob compliance, EOLabs contact (`contact@eolabs.tn`) and `© EOLabs 2026 beta` copyright.
  - 🎨 Sleek Emote Simulation: Replaced verbose text bubbles over walking customers with clean contextual emoji badges (`☕`, `🥖`, `🚖`, `😋`, `⭐`), fluid entrance and checkout departure.
  - 📊 Balanced Evolution Panel: Restructured `.biz-evolution-banner` into clean top and bottom rows with uncompressed upgrade buttons and multi-line business descriptions.
- fix(uiux,simulation): align staff stations in unified flex container and polish hire slots
- fix(uiux,layout,animation): harmonize card button proportions, refine vacant staff slots & fit dialog bubbles
- fix(uiux,simulation,text): fix html leakage in coin popups, redesign project modal & expand 2d stage
- fix(ui,clicks,branding): fix click handlers by removing duplicate block and design luxury tycoon vector logo
- feat(ui,simulation): polish shop modal typography, add current & next-level income evolution card, upgrade button and 3D entrance button
- feat(ui,simulation): polish shop modal typography, add current & next-level income evolution card, upgrade button and 3D entrance button
  - 🚪 3D Glassmorphism Entrance Button: Replaced discreet link with golden interactive 3D button (`🏪 ادخل للمحلّ 🔍 تفقد`) on every business card.
  - 📊 Income & Evolution Card: Clear financial breakdown inside modal with current cycle earnings (`+X.XX د.ت`), cadence per second, next level net gain projection (`+Δ د.ت`), milestone countdown (next speed x2 multiplier), and instant quick upgrade button.
  - 🎭 Enhanced Visual Storytelling: Authentic contextual order bubbles per business type (e.g. capucin/express, kaskrout ayari, taxi la marsa), dynamic real-time coin popup displaying exact cycle earnings on register pop, active/sleepy staff states and customer satisfaction reactions (`😋 ❤️ ⭐⭐⭐⭐⭐`).
- feat(visual-simulation): add 2D cutaway live animated store simulation with register, dynamic staff stations and customer flow
- feat(visual-simulation): add 2D cutaway live animated store simulation with register, dynamic staff stations and customer flow
  - 🏪 Interactive 2D Stage (`#bizDetailVisualStage`): Cutaway store view styled in dark luxury & Tunisian tiles.
  - 📠 Cash Counter & Register: Register drawer pops with gold sparkles (`+د.ت ✨`) on each transaction; dedicated cashier station (active sprite with sparkles when hired, dashed silhouette with one-tap hire when vacant).
  - 👥 Workstations: Animated staff slots working with tools/fire; vacant slots invite direct tap recruitment.
  - 🚶 Animated Customer Flow: Dynamic queue of customers (`🚶‍♂️`, `🧑‍💼`, `🧕`, `🧔`) walking in, displaying item order bubbles (`☕`, `🥖`, `🚖`), paying at the register and walking out happy (`😊`).
  - ⚡ 60 FPS Engine Lifecycle: Clean loop lifecycle automatically started on modal open and stopped on close (`cancelAnimationFrame`, zero memory leaks).
- fix(derja): replace قص البونيس with اربح البونيس on lucky ad modal
- fix(derja): replace 'قصّ البونيس' with 'اربح البونيس' on rewarded ad bonus modal
- feat(biz-interior,audio,economy): add inside business view, Mediterranean lounge BGM, ad-gated rebalanced bonuses and ifles lexical overhaul
- feat(biz-interior,audio,economy): add inside business view, Mediterranean lounge BGM, ad-gated rebalanced bonuses and ifles lexical overhaul
  - 🔍 Inside Project View (`#bizDetailModal`): Click on any business card to enter the shop with 3 interactive tabs:
    - 👥 Staff Roster: Employee role distribution, active status, direct hiring and productivity boosts.
    - 📜 Recipe & Economy: Breakdown of core Tunisian products sold, unit prices and revenue shares (e.g. Express, Direct, Capucin, Bambalouni).
    - ⚡ Live Activity Simulation: Real-time customer footfall (customers/minute), crowd gauge, and live customer order ticker.
  - 🎵 Mediterranean Lounge BGM: Replaced old synth track with a soft, warm 60 BPM Mediterranean nylon guitar & Rhodes progression (Dm9-G13-Cmaj9-Am9, gentle lowpass filter).
  - 🎬 Ad-Gated & Rebalanced Bonuses: Lucky drop now gates full rewards behind AdMob rewarded video with reduced, sustainable cash amounts.
  - 💥 Lexical Overhaul: Replaced all occurrences of "تصفير" with authentic business bankruptcy term "إفلاس".
- feat(fx,animations,bonus): eliminate raw HTML text leaks, add CSS alive business animations and re-pace gift drops
- feat(fx,animations,bonus): eliminate raw HTML text leaks, add CSS alive business animations and re-pace gift drops
  - 🧹 Zero HTML Leaks: Added `formatCurrencyPlain` preventing `<span class="num-ltr">` from appearing inside `innerText`, toast messages and dialog buttons.
  - 🎨 Alive Business Animations (Pure CSS 60 FPS):
    - Micro-animations: Steam rising (`♨️`) on café/fricassé/restaurant/conserverie, pulsing neon light on tearooms/hotels/malls, vehicle exhaust puff (`💨`) on taxi collectif, and gold glimmers on real-estate holdings.
    - Dynamic States: `is-idle-breathing` (gentle breathing scale), `is-producing` (high-tempo kinetic shake), and `is-upgraded` (golden milestone flash).
  - 🎁 Re-paced & High-Impact Lucky Drops: Dropped frequency to 60-90s, replaced static drop with bouncing gift box (`@keyframes giftBounce`) emitting a festive burst of coins and confetti (`launchCelebrationBurst`).
- feat(profile,settings): add empire profile modal, project name customization, progress metrics and secure hard reset
- feat(profile,settings): add empire profile modal, project name customization, progress metrics and secure hard reset
  - 👑 Empire Profile & Settings Modal: accessed via clean header gear button (⚙️), custom empire name with persistent save.
  - 📊 Deterministic Progression Analytics: calculated Empire Level, overall completion percentage (0-100%), unlocked businesses (X/17), managers hired count, lifetime gross earnings, and prestige counter.
  - ⚠️ Two-Step Secure Hard Reset: full zero-state wipe with explicit confirmation box preventing accidental taps.
- fix(ui,clicks): restore missing adCashBtn and questBox elements, add defensive guards and fix card shockwave id
- fix(ui,clicks): restore missing adCashBtn and questBox elements, add defensive guards and fix card shockwave id
- feat(ui,motion,clean-code): declutter airy layout, bottom nav, physics coin shower and clean code architecture
- feat(ui,motion,clean-code): declutter airy layout, bottom nav, physics coin shower and clean code architecture
  - 🎨 UI/UX Declutter: Divided top sticky header by 3, eliminated all visual overlap, spacious cards with 88px bottom nav clearance.
  - 🪙 Motion Engine: Quadratic Bezier coin cannon (`launchCoinShower`) flying to balance, completion shockwave pulse (`biz-shockwave`), squash & stretch.
  - ⚡ Clean Code & Architecture: Strict decoupling, 10/10 automated tests pass, resilient JSON save/load with defensive fallbacks.

## 2026-10-21
- feat(revolution): complete game revolution with airy 4-tab UI, social league, daily streak rewards and authentic derja overhaul
- feat(revolution,social,ui,derja): complete game revolution by 3 PhD experts :
  - 🎨 UI/UX Tycoon Art Director: 4-tab spacious layout (المشاريع / الصنعة / الأحياء / البطولة والصابة), airy royal header, crisp tactile cards.
  - 🏆 Social & Retention Tycoon: weekly Merchants Championship ('بطولة تجار تونس' 4 tiers), 7-day daily login streak ('صابة النهار'), and daily missions ('تحديات اليوم').
  - 🇹🇳 Authentic Derja Overhaul: PhD linguist street dialect polish for slogans, staff titles, and community rivalries.
- fix(ui,layout): streamline header compactness, prevent overlap, increase scroll padding and optimize fluid rendering
- fix(ui,layout): streamline header compactness, prevent overlap, increase scroll padding & optimize fluid rendering
- feat(gameplay,immersion): major attractiveness overhaul with zones, tactical upgrades, milestones, lucky wheel, and street dilemmas
- feat(gameplay,immersion): major attractiveness overhaul :
  - 🗺️ Tunisian Urban Conquest: 5 iconic zones (Bab Souika, La Goulette, Lac 2, Hammamet, Djerba Holding) with dedicated bonuses and atmospheric backdrops.
  - ⚡ Tactical Upgrades Tree: secret culinary recipes, neon signs, turbo engines multiplying business revenue permanently.
  - 🎯 Level Milestones: x25, x50, x100, x200 multipliers with milestone fanfare and shiny visual effects.
  - 🎡 Tunisian Lucky Wheel ('عجلة الحظ التونسية') with procedural ticking sound and instant dopamine rewards.
  - 📜 Interactive Street Dilemmas: moral & comic local choices with immediate consequences.
- fix(ui,balance): render toast HTML correctly, rebalance prestige & pacing, constrain lucky drop positioning
- fix(ui,balance): render toast HTML correctly, rebalance prestige & pacing, constrain lucky drop positioning
- feat(gameplay): add business synergies, chkobba reflex challenge, prestige ascension, warm lounge BGM, and niveau to mostawa
- fix(ui): arabic currency format (ألف دينار, مليون دينار), 4 سوايع, العب و لمّ بزايد فلوس
- fix(ui): balance button bidi numbers, remove paren spaces, compact event button
- fix(ui): balance button bidi numbers, remove paren spaces, compact event button
- fix(android): remove hyphenated ic_launcher-playstore from res folder
- feat(branding,ui): add custom HD app icons, update business names & fix bidi numbers
- feat(balance,derja): recalibrate economic curve & overhaul authentic street Derja
- docs(agents): permanent autonomy rule
- feat(businesses): add promoteur immobilier before Tayaran El Ghzela
- ci(docs): docs-guard workflow + GitHub-only mode documented
- chore(docs): changelog cleanup
- chore(docs): dedupe changelog
- docs(process): auto-update MD via ship.ps1 + pre-commit hook
- `be8a9b6` derja: réécriture (MSA → tunisien): rôles, noms, enseignes, messages.
- `0ddaa65` derja: rôles de gérants, événements, quêtes.
- `cb55d21` UI/UX: palette or/émeraude/carmin, barre shiny (translate3d), badge Niv., boutons 3D tactiles, reduced-motion. Derja: textes UI. Audio: nouvelle BGM simple (arpège doux + basse).

## Avant
- `f3abf70` Tayaran El Ghzela (compagnie aérienne).
- `701ba84` recrutement multi-gérants, BGM Jaw Tounsi (remplacée), Ella9la9, centre commercial, usine conserves, showroom auto.

- feat(v82): independent city business progression, street vendor cart for kaskrout, interactive pan-zoom map with arrival transition

- feat(v83): single kaskrout cart in start city, sell business mechanic, green park replacement, balanced realistic economy
