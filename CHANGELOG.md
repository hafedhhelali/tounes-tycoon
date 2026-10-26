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

## [v112] - 2026-10-26

### Fixed
- **Élimination définitive du bug d'écran noir (SyntaxError duplicate export)** :
  - Un doublon d'exportation ES Module (`export const TunisianVectorMapEngine = TunisiaMapEngine; export const PanoramicStreetCanvas = QuartierAnimator;`) au milieu du fichier `store_animator.js` provoquait une erreur fatale `SyntaxError: Identifier has already been declared` dès le chargement du script par le navigateur/WebView.
  - Cette erreur interrompait l'exécution de tout le module, empêchant l'initialisation du DOM, de la rue Canvas, de la carte et des écouteurs de clics (laissant l'écran noir avec le contour seul).
  - Suppression du doublon, validation syntaxique stricte avec `node -c store_animator.js` et vérification de l'inline module `index.html`.

## [v111] - 2026-10-26

### Fixed & Enhanced
- **Déblocage de l'achat des projets dans la rue** :
  - La hitbox d'achat a été étendue à l'ensemble du bâtiment verrouillé (au lieu d'être restreinte à un sous-bouton étroit masqué par le tap).
  - Gestion automatique : si le commerce de la ville n'était pas encore instancié au moment du clic, `initCityBusinesses` l'active immédiatement avant `buyBusiness`.
  - Si les fonds sont insuffisants, ouverture automatique de la fiche descriptive avec montant manquant clairement indiqué.
- **Réseau cartographique vectoriel & Tataouine** :
  - Intégration de Tataouine sur la carte géographique de Tunisie (x: 230, y: 515), avec la route GP19 des قصور et la liaison vers Djerba.
- **Perfectionnement visuel par le Lead Directeur Artistique & Animation Canvas 2D** :
  - Rendu haute définition sans rognage sur l'ensemble des 25 projets et bâtiments publics.
  - Animations 60 FPS fluides et boutons fiables.

## [v110] - 2026-10-26

### Added & Customized
- **Budget impérial unifié et partagé entre toutes les villes** :
  - `dinars` (سيولة) et `bankBalance` (رصيد بنكي) sont désormais conservés et utilisables dans n'importe quelle ville tunisienne, supprimant la remise à zéro lors des voyages.
- **Attribution personnalisée et exacte des commerces par ville (`CITY_BUSINESS_MAP`)** :
  - **Tunis** : نصبة كسكروت، فريكاسي، قهوة، سوبيرات، مغازة عامة، وكالة أسفار.
  - **Bizerte** : مارشي فواكه البحر والسمك، عطارية، مغازة عامة، مكتبة.
  - **Nabeul** : مكتبة، سوبيرات، قهوة، رحلات بحرية ويخوت.
  - **Kairouan** : قهوة، حلويات ومقروض، سوبيرات، محل ملابس، قاعة ألعاب.
  - **Sbeitla** : قهوة، سوبيرات، قاعة ألعاب، محل ملابس، مكتبة، عطارية.
  - **Sfax** : فواكه البحر، مكتبة، محل ملابس، قهوة، صالون شاي، سوبيرات.
  - **Djerba** : قهوة، فواكه البحر، نزل وفندق، صالون شاي، سوبيرات، رحلات بحرية ويخوت.
  - **Gabes** : معمل مصبرات، سوبيرات، قهوة، عطارية، محل ملابس، فريكاسي.
  - **Gafsa** : وحدة تعليب وتصدير دقلة النور، عطارية، نزل، محل ملابس، قهوة.
  - **Tozeur** : نزل، صالون شاي، قهوة، عطارية، سوبيرات، قاعة ألعاب، فريكاسي.
  - **Béja** : بيع مشتقات الحليب والأجبان، جزارة وبيع اللحوم، قهوة، عطارية، سوبيرات، فريكاسي.
  - **Le Kef** : جزارة وبيع اللحوم، بيع مشتقات الحليب، سوبيرات، قهوة، حلويات وبقلاوة، قاعة ألعاب.
  - **Tataouine** : نزل، محل ملابس، محل ساعات فاخرة، عطارية، مغازة عامة.
  - **Médenine** : محل ملابس، عطارية، سوبيرات، فريكاسي، حلويات وبقلاوة، قاعة ألعاب.
  - **Monastir** : نزل، صالون شاي، سوبيرات، مغازة عامة، حلويات، محل ملابس، مكتبة، رحلات بحرية ويخوت.
- **Présence garantie dans chaque ville tunisienne** :
  - **Banque (فرع البنك)** avec double solde (سيولة / بنك) et opérations de dépôt/retrait.
  - **Poste de Police (مركز الأمن والشرطة)** avec patrouilles de sécurité.
  - **Guichet de Tabac (قمريڨ ومكتب التبغ والوقيد)** avec vente de cigarettes nationales, timbres fiscaux et pourboire.
- **Nouveaux commerces modélisés dans le moteur & animations Canvas 2D 60 FPS** :
  - `librairie` (📚), `vente_vetements` (👕), `salle_de_jeux` (🎮), `emballage_dattes` (🌴), `produits_laitiers` (🧀), `boucherie` (🥩), `vente_montres` (⌚), `croisiere_mer` (⛵).

## [v109] - 2026-10-26

### Fixed & Enhanced
- **Rétablissement complet de la visibilité des boutons du Header (Gauche & Centre)** :
  - **Correction du débordement / rognage** : Densification et compacité des badges de solde (`balance-hero` : padding 2px 6px, font-size 13px, min-width auto) et des onglets de navigation (`nav-tab-item` : padding 3px 7px, font-size 11px) évitant l'éviction des boutons de gauche (`بريم`, ⚙️, 🔊, 🚪).
  - **Scroll horizontal tactile de secours** : Ajout de `overflow-x: auto` et `-webkit-overflow-scrolling: touch` avec scrollbar masquée sur `header`, garantissant l'accès immédiat à 100% des boutons sur n'importe quel ratio d'écran mobile sans troncature.
- **Correction des coupures haut/bas de la Modale Banque et Police** :
  - `padding: 10px 14px`, `max-height: calc(100vh - 20px)` et `overflow-y: auto` sur `.modal-card` et overlay, éliminant tout texte coupé en haut et en bas.
- **Remplacement du style du message d'arrivée en ville (Alerte danger -> Toast festif vert)** :
  - Création de la variante `.toast-box.toast-success` avec dégradé émeraude prestige, bordure verte `#10b981` et icônes d'ambiance contextuelles (`🚗` / `🎉` / `🚓`) en remplacement du bandeau rouge d'alerte danger.


## [v108] - 2026-10-26

### Balanced & Redesigned
- **Rééquilibrage de la montée de niveau des commerces (Anti-inflation)** :
  - Formule de revenu par niveau recalibrée : `levelMultiplier = 1.0 + ((level - 1) * 0.40)` (croissance progressive de +40% par niveau au lieu d'une explosion exponentielle ou linéaire brutale).
  - Paliers de paliers (milestones) ajustés : L25 (+25%), L50 (+30%), L100 (+50%), L200 (+75%) au lieu de doublements/quadruplements excessifs.
  - Seuil d'amortissement macro-économique ajusté à 2,000,000 DT pour garantir un endgame stimulant sans dérive vers des chiffres infinis.
- **Refonte graphique intégrale des caisses enregistreuses (Vue intérieure des boutiques)** :
  - Postes de caisse 3D biseautés haut de gamme avec socle titane brossé et liseré doré.
  - Écran POS tactile incliné haute brillance avec verre biseauté, reflets lumineux et télémetrie dynamique fluo.
  - Terminal de paiement électronique (TPE) carte bancaire moderne avec voyants LED interactifs.
  - Tiroir-caisse ouvragé en bois de noyer massif avec fente à billets réaliste et poignée dorée.


## [v107] - 2026-10-26

### Added & Enhanced
- **Ajout systématique de la Banque et du Poste de Police dans chaque ville** :
  - **Banque Nationale (`bank_branch`)** : Bâtiment interactif avec DAB/GAB, guichets et porte d'entrée. Permet de déposer et retirer son argent avec gestion de deux soldes distincts :
    - `💵 السيولة (في الجيب)` : Cash liquide disponible pour les achats immédiats.
    - `🏦 الرصيد في البنك` : Argent placé en sécurité dans le compte bancaire.
  - **Affichage Double Solde dans le Header** : Deux badges distincts (`#dinarsDisplay` et `#bankDisplay`) avec accès direct à la banque au tap.
  - **Poste de Police (`police_station`)** : Bâtiment officiel avec gyrophare bicolore animé, fenêtres sécurisées, caméras et patrouille immédiate de sécurité municipale.
  - **Présence garantie dans les 14 villes** : Génération dynamique garantissant la présence d'une banque et d'un commissariat dans chaque artère urbaine.

## [v106] - 2026-10-26

### Fixed & Cleaned
- **Élimination définitive du solde figé à Bizerte (et autres villes)** :
  - **Revenus passifs multi-villes continus** : `engine.update()` calcule désormais en temps réel les cycles passifs de tous les gérants de l'empire dans chaque ville débloquée (`this.cityBusinesses`), maintenant la production active de Tunis même en visite à Bizerte.
  - **Commerce d'entrée accessible à Bizerte** : Insertion de `fricasse` (coût abordable de 30 DT) en tête de rue avant la pâtisserie et les commerces lourds, empêchant tout soft-lock économique.
  - **Anti-softlock par travail d'appoint (« تفتوفة بالنهار »)** : Taper sur un commerce non encore débloqué (niveau 0) verse désormais un salaire d'appoint immédiat (+1.00 DT 🪙) avec animation sonore et bulle dorée.
  - **Architecture Clean & Découplée** : Nettoyage de la synchronisation de `cityBalances` sans boucles redondantes ni spaghetti.

## [v105] - 2026-10-25

### Fixed & Changed
- **Navigation Carte de Tunisie 100% tactile et réactive** :
  - Détection des taps tactiles fiabilisée dans `handlePointerUp` : si aucun glissement n'est détecté, déclenchement immédiat du clic sans blocage ni perte d'événement tactile.
  - Clic direct sur ville : rayon d'action augmenté à 42px. Si la ville est déjà sélectionnée ou tapée deux fois, lancement immédiat du voyage.
  - Surface de frappe du bouton popover élargie pour écrans mobiles.
- **Typographie & Lisibilité de la Ville Active** :
  - Nom de la ville active agrandi (13.5px bold) avec badge contrasté sur la carte.
  - Nom de la ville courante agrandi dans la barre supérieure (`#currentZoneName`, `#currentQuartierBadge`, `#mapActiveCityBadge`).
- **Harmonisation UI "بريم"** :
  - Remplacement de "Prime de présence" par le terme court et authentique "بريم" sur l'onglet et les bannières.

## [v104] - 2026-10-25

### Fixed
- **Carte & Déplacement Villes (Bizerte 99% freeze)** :
  - Remplacement du test strict `progress >= 1.0` par une condition tolérante `progress >= 0.999 || elapsed >= duration` et clampage de la jauge à 100%.
  - Ajout du polyfill Canvas `roundRect` sur mobile WebView et sécurisation des appels audio pour éviter l'interruption de boucle d'animation.
  - Finalisation systématique de la transition d'arrivée avec ouverture garantie de la rue de destination.
- **Affichage des gains de projets (Suppression du HTML brut)** :
  - Remplacement de `formatCurrency` par `formatCurrencyPlain` dans les bulles flottantes et messages de tap des projets pour afficher un texte pur sans balises `<span>`.

## [v103] - 2026-10-25

### Added & Changed
- **Animation de déplacement cinématique et effet d'arrivée sur la Carte de Tunisie** :
  - Trajet de voyage fluide le long des autoroutes avec voiture stylisée, faisceau de phares et jauge de progression.
  - Déclenchement d'un effet d'onde de choc dorée/cyan, étincelles et bannière d'arrivée triomphale (`drawArrivalEffect`) à destination avant fermeture.
  - Basculement automatique après l'animation vers l'onglet rue (`businesses`) avec transition visuelle et sonore de la nouvelle ville.
- **Refonte des onglets et Prime de présence** :
  - Retrait complet du bouton et panneau « الصنعة » de la barre d'onglets pour alléger l'interface.
  - Renommage de l'onglet « البطولة » en « 🎁 Prime de présence ».
  - Remplacement des libellés de jours abrégés « ن1, ن2... » par des intitulés explicites et soignés : « النهار الأوّل », « النهار الثاني », « النهار الثالث », « النهار الرابع », « النهار الخامس », « النهار السادس », « النهار السابع ».

## [v102] - 2026-10-25

### Fixed & Enhanced
- **Déverrouillage définitif du défilement haut de la Popup Paramètres** :
  - Remplacement du double conteneur de défilement imbriqué par un défilement unique fluide géré par `#settingsModal` (`align-items: flex-start !important; justify-content: flex-start !important; overflow-y: auto !important;`).
  - Suppression du blocage de hauteur `max-height: calc(100vh - 48px)` sur `.settings-modal-card` (`max-height: none !important; overflow: visible !important;`) éliminant le bug de centrage vertical flexbox qui coupait le haut de la modale.
  - En-tête épinglé (`position: sticky; top: 0; z-index: 25; background: #131a29;`) garantissant la présence permanente du titre « إعدادات الإمبراطورية والبروفيل » et du bouton fermer `✕`.
  - Réinitialisation systématique du défilement (`scrollTop = 0`) à chaque ouverture de la modale via `requestAnimationFrame`.

## [v101] - 2026-10-25

### Fixed & Enhanced
- **Refonte UI Designer de la Popup Paramètres & Profil** :
  - Suppression de tout rognage haut : `#settingsModal` ajusté à `padding: 24px 12px 36px 12px !important;` et `.settings-modal-card` à `margin: 10px auto !important; max-height: calc(100vh - 48px) !important;`.
  - Neutralisation des `transform: scale(0.88)` globaux qui déplaçaient l'axe d'origine vertical hors du viewport sur mobile (`transform: none !important;`).
  - Finition visuelle enrichie : bordure dorée de séparation de l'en-tête, espacements aérés garantissant une visibilité intégrale immédiate du titre et du bouton fermer `✕`.
- **Intégration du Guide de Démarrage Rapide (Accès direct permanent)** :
  - Déverrouillage du bouton `❓` dans le Header en haut de l'écran (accessible à tout instant sans passer par les réglages).
  - Ajout d'une orbe 3D interactive animée `❓` dans le ciel de la scène de rue 2D (`hud_guide`), permettant d'ouvrir le guide complet d'un simple tap sur le ciel.

## [v100] - 2026-10-25

### Fixed
- **Modale Paramètres & Profil (Header entièrement visible)** :
  - Définition explicite de `align-items: flex-start !important; overflow-y: auto !important; padding: 12px 10px 24px 10px !important;` sur `#settingsModal`.
  - Encadrement de `.settings-modal-card` avec `max-height: calc(100vh - 24px)` et `margin: 0 auto;`, éliminant tout débordement ou coupure du haut de la modale sur les écrans mobiles et paysages.
- **Dégel & Réactivité Instantanée du Solde au Tap** :
  - Dans `triggerServe` (`index.html`), crédit immédiat des revenus au tap manuel sur le bouton « سربّي » ou sur l'avatar du commerce, avec mise à jour immédiate du DOM (`dinarsDisplay` et `bizBalanceEl`) et synchronisation de `cityBalances[currentCityId]`.
  - Déverrouillage visuel de la barre de progression : affichage fluide 60 FPS lors de la production manuelle (`biz.isProducing`) même sans manager recruté, offrant un retour visuel instantané au joueur.

## [v99] - 2026-10-25

### Fixed
- **Dégel définitif du solde (Rassid 16.1 DT)** :
  - Suppression de l'accolade orpheline `}` dans `index.html` (L.3444) et déclaration stricte de `isAppPaused` et `mainTickRafId` garantissant l'exécution 60 FPS ininterrompue de `tick()`.
  - Synchronisation automatique de `cityBalances[currentCityId]` à chaque frame dans `engine.update()` et au tap `onCollect`.
  - Mise à jour instantanée du DOM (`dinarsDisplay` et `bizBalanceEl`) lors des collectes de revenus.
- **Affichage Taxi Collectif & Décor Métier** :
  - Remplacement des étagères d'épicerie/conserves par un panneau des lignes de louage tunisien (`محطة التاكسي الجماعي واللواج`), horloge murale, râtelier de clés et tickets `🔑 🎫 🚖 🛣️`.
  - Poste de travail adapté avec pneu de secours `🛞` et radio de dispatching `📋`.
- **Supérette & Ergonomie Caissier** :
  - Z-index corrigé : étagères au mur du fond -> caissier au sol Y=148 -> comptoir Kadhel au 1er plan (les étagères ne masquent plus le caissier et il ne flotte plus).
  - Suppression des emojis `💤`, icônes métiers alignées et centrées (`💳`, `👔`, `⚡`).
- **Interaction Façade vs Porte** :
  - Clic façade = servir et encaisser dans le quartier (100% Canvas, aucune modale intempestive).
  - Seul le clic direct et ciblé sur la porte ou le bouton « زيارة » déclenche la visite de l'intérieur du projet.
  - Suppression de l'ouverture forcée de modale au clic d'upgrade lorsque les fonds sont insuffisants.

## [v98] - 2026-10-25

### Fixed
- **Protection Sauvegarde & Boot sans échec** : encapsulation de `JSON.parse(localStorage)` dans un `try/catch` avec fallback automatique évitant tout arrêt du `<script type="module">`.
- **Résilience événements actifs** : sécurisation par chaînage de `this.activeEvent.event.multipliers[business.id]` dans `engine.js`.
- **Moteur d'animation des piétons** : correction de `this.buildingLayout` vers `this.streetLayout` dans `store_animator.js` pour éviter les `TypeError` après quelques secondes de jeu.
- **Fonction toast manquante** : implémentation de `showFeedbackToast` pour les transitions entre villes.
- **Ordre d'initialisation** : exécution de `applyZoneTheme()` avant `renderDOM()`.

## [v97] - 2026-10-25

### Fixed
- **Écran vide et boutons inactifs résolus** : suppression de l'accolade orpheline et code dupliqué dans `store_animator.js` qui causait `SyntaxError: Unexpected identifier 'canAfford'`, empêchant le chargement de l'ES module et l'initialisation de `QuartierAnimator` et des écouteurs tactiles.
- Validation ESM et 66 tests unitaires passés avec succès.

## [v96] - 2026-10-25

### Fixed / Changed
- Architecture carte de Tunisie : correction du dimensionnement `TunisiaMapEngine.resize()` avec fallback garanti évitant l'écran noir.
- Séparation des repères graphiques : la carte popover inférieure est désormais isolée du pan vertical, rétablissant la réactivité tactile 100 % fiable sur les boutons de voyage.
- Élimination des réinitialisations de contexte en boucle : passage à `requestAnimationFrame` unifié sans timers concurrents (`setTimeout`).
- Dégel du portefeuille (Rasid figé) : encaissement direct des gains clients et des services manuels dans `engine.dinars`.
- Dépenses réalistes et équilibrées : calcul des charges périodiques proportionné au revenu réel.
- Amélioration visuelle designers : étagères en olivier massif, caisse tactile avec affichage dynamique, chéchia animée et effets d'aura aux paliers.
- Paramètres mobiles : conteneur scrollable sans coupure des dépenses.

## [v95] - 2026-10-25

### Added / Changed
- Évolution visuelle des paliers : façades, auras et enseignes dynamiques pour chaque palier (L25 vert, L50 violet, L100 cyan, L200 or pur).
- Refonte des étagères et de la caisse : étagères garnies de produits artisanaux tunisiens (harissa, huile d'olive, miel) et comptoir vernis avec caisse tactile enrichie.
- Gestion réaliste des clients sans personnel : si aucun gérant n'est recruté et qu'aucun service manuel n'est déclenché, les clients attendent puis sortent fâchés (😡) avec animation d'incitation au recrutement.
- Affichage conditionnel de la barre d'activité : la jauge ne s'affiche désormais que si du personnel est recruté ou si une production manuelle est active.
- Nettoyage ergonomique de la rue : suppression du panneau central 'افتح خريطة تونس' et agrandissement royal du bouton Map en haut à droite avec ruban et pulsation dorée.
- Fix de la fenêtre Paramètres : conteneur scrollable évitant la coupure de la section des dépenses en bas d'écran.

## [v94] - 2026-10-25

### Fixed / Changed
- Solde ville en temps réel : synchronisation continue de cityBalances[currentCityId] à chaque tick de gain, éliminant tout blocage/gel du solde.
- Barres de progression de production : rétablissement complet de l'animation de jauge 60 FPS sur les bâtiments en rue (Canvas store_animator.js) et au-dessus des cartes projets (DOM).
- Remplacement du terme « صابة » par « مربوح » dans toute l'interface et le moteur (مربوح الأسبوع، مربوح النهار، اقبض المربوح).
- Bascule automatique Map -> Rue : sortie immédiate de la carte dès l'arrivée en ville avec transition cinématique fluide sur la rue du quartier.

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
