## [1.40.0] - 2026-11-11
### Fixed & Improved
- **Restauration de l'onglet 'الخريطة' & unification visuelle** (`index.html`) :
  - Bouton d'onglet `#tabBtnZones` restauré avec le label exact `الخريطة` et badge dynamique de la ville courante.
  - Titres et headers unifiés sous le nom `الخريطة 🇹🇳 🇩🇿 🇲🇦 🇱🇾 🇪🇬 🇲🇷`.
  - Bouton retour `#returnToStreetBtn` ("🏪 رجوع للشارع ←") intégré dans le header de la carte pour éviter tout chevauchement avec le canvas.
  - Pill header `#openMapBtn` câblé sur `switchTab('zones')`.
- **Correction intégrale des clics carte & HUD** (`store_animator.js`) :
  - Découplage strict des coordonnées : le monde 2D (autoroutes, villes, caravanes) est rendu et cliqué en coordonnées monde scalées, tandis que le HUD (boutons zoom `+`, `🇹🇳`, `-`, pilules pays, carte de détails basse) est rendu et cliqué au pixel près en espace écran direct (indépendant du zoom/pan).
  - Hitbox des villes élargie de 42 à 52px pour une détection tactile fluide et sans ratés sur mobile.
  - Clic sur la ville active dans la popover ou sur la carte offre un feedback chaleureux et un retour direct au gameplay rue.
  - Détection de glissement `hasDraggedMap` avec seuil élevé (16px) pour éviter toute confusion entre tap tactile et pan.
- **Tests unitaires et de non-régression** :
  - Ajout de la suite de tests automatisés `tunisia_map.test.js` couvrant l'ensemble des interactions HUD et monde (136/136 tests passants).

## [1.39.0] - 2026-11-11
### Added & Fixed
- **Bouton carte visible** (`index.html`) : ajout `#openMapBtn` "🗺️ الخريطة" dans `header-system-actions`, câblé à `#zonesModal`.
- **Bouton profil visible** (`index.html`) : ajout `#openProfileBtn` "👤 البروفيل" ouvrant le modal profil/settings.
- **Prime : bouton de sortie** (`index.html`) : ajout `#closeLeaguePanelBtn` "رجوع للشارع" dans `#panelLeague`.
- **Banque compacte** (`index.html`) : canvas agrandi à 170px, boutons/textes réduits pour ne plus masquer l'agent guichet.
- **Docs** : HANDOFF.md + CHANGELOG.md mis à jour.

## [1.38.0] - 2026-11-11
### Added
- **Config OpenCode projet** (`opencode.json`) : modèle par défaut `opencode-go/beam-free` (illimité/gratuit) pour le dev jeu, instructions AGENTS.md + ARCH.md chargées, watcher ignore dist/www/node_modules/*.apk.
- **Docs** : HANDOFF.md + CHANGELOG.md mis à jour.

## [1.37.0] - 2026-11-10
### Fixed & Improved
- **Scène intérieure & façades de rue épurées** (`store_animator.js`) :
  - **Banquier & Buraliste dégagés sans flamme** : Le banquier dans la scène de banque est désormais dessiné après l'arche et le comptoir avec `workFx=false`, éliminant tout recouvrement de tête et l'effet flamme ✨ au-dessus du crâne. De même pour le caissier du kiosque avec l'enseigne `🚭 قمريڨ تونس`.
  - **Suppression du fouillis visuel dans la rue** : Nettoyage des façades de la banque et du kiosque de tabac dans `QuartierAnimator` (`drawBank`, `drawTobaccoKiosk`) ; suppression des reflets hygiaphones superflus, des étiquettes débordantes et des silhouettes redondantes qui encombraient la visibilité des piétons.
- **Support debug quartier** (`index.html`) :
  - Exposition de `window.__quartierEngine` pour inspection et capture sans altération du DOM.

## [1.36.0] - 2026-11-08
### Added & Improved
- **Moteur Micro-Motion Mobile & Physique de Ressorts** (`motion_engine.js`) :
  - **Interpolation exponentielle continue** (`exponentialDecay`) : Déplacement de caméra fluide et lissage sans à-coups indépendant des variations de framerate.
  - **Simulateur de ressort physique** (`SpringSimulator`) : Modèle masse-ressort-amortissement avec intégration Euler semi-implicite pour inertie et rebonds naturels.
  - **Pool WAAPI GPU Compositor** (`DomCoinPool`) : Recyclage à zéro allocation d'éléments de pièces animées sur le GPU, éliminant tout GC stutter et layout-thrashing lors du tap rapide.
  - **Squash & Stretch tactile universel** (`triggerTactileSquash`) : Déformation élastique instantanée sur chaque bouton et onglet du jeu.
- **Rendu Graphique Canvas Haute Fidélité & 60 FPS** (`store_animator.js`) :
  - **Clamp adaptatif DPR (max 2.5)** : Rendu haute netteté sur écrans mobiles denses (AMOLED / Retina) sans surcharge de fill-rate ni baisse de framerate.
  - **Ombres de contact radiales douces** (`drawContactShadow`) sous tous les bâtiments, piétons et véhicules pour ancrer les éléments dans la rue.
  - **Pièces 3D paraboliques** avec projection d'épaisseur, reflets dorés et tranche métallique dynamique.
  - **Ondes de choc dorées interactives** (`tapRipples`) au toucher sous le doigt du joueur dans la rue.
  - **Squash & stretch élastique des boutiques** lors des collectes de production.
  - **Passe d'éclairage atmosphérique** crépuscule et nuit renforçant la profondeur visuelle.
- **Ergonomie Mobile & Interface Tactile** (`index.html`) :
  - Intégration safe-area `env(safe-area-inset-*)` et viewport dynamique `100dvh` compatible encoches et barres Android.
  - Transitions élastiques `var(--spring-bounce)` sur les boutons et fenêtres modales.
  - Flash doré dynamique sur le solde (`.balance-val.bump`).
- **Tests Unitaires & Qualité** (`motion_engine.test.js`) :
  - 4 nouveaux tests unitaires pour le moteur de mouvement, portant la suite à 76/76 tests réussis.

## [1.35.0] - 2026-11-06
### Added & Improved
- **Mode Joujma Mania / Fever Rush Tunisien x3** (`engine.js`, `store_animator.js`, `audio.js`, `index.html`) :
  - **Moteur d'excitation & Jauge d'ambiance 🌶️ جوجمة** : Chaque tap manuel, récolte ou interaction charge la jauge Joujma de 0% à 100%.
  - **Déclenchement du Rush x3 (15s)** : Dès 100%, l'écran passe en mode fête survoltée tunisienne : production globale multipliée par 3, fanfare dynamique (`playJoujmaFanfare`), roulements de darbouka et cascade d'accords Maqam.
  - **FX visuels 60 FPS** : Cadre néon or & rouge pulsant autour de la rue, pluie de confettis multicolores en dérive et bannière flamboyante animée `🔥 جوجمة تايم x3 ! 🔥`.
- **Personnages VIP Tunisiens interactifs dans la rue** (`store_animator.js`, `engine.js`, `audio.js`, `index.html`) :
  - **La rue devient un terrain de jeu actif** : Apparition dynamique de personnages VIP traversant le quartier avec badge flottant lumineux `[💎 اضغط!]` :
    - 📸 **السائح الثري (Le Touriste Riche)** : Chemise hawaïenne et appareil photo, octroie un gros pourboire en devises au clic (+Dinars instantanés).
    - 🧐 **ناقد الماكلة والصنعة (Le Critique Gastronomique)** : Costume chic et calepin de notes, booste la jauge Joujma et la réputation (+40% chaleur).
    - 👰🚗 **كرهبة العروسة (Le Cortège Nuptial Tunisien)** : Berline blanche ornée de rubans roses et fleurs, déclenche un méga jackpot et le mode Joujma direct !
    - 🧰 **الصنايعي المتجول (L'Artisan de Quartier)** : Boîte à outils et salopette, coup de main rapide et bonus de dinars.
- **Barre de progression des paliers & Engagement actif continu** (`index.html`) :
  - **Jauge de palier intégrée (`.milestone-track-wrap`)** : Visualisation claire et motivante de la progression vers le prochain palier multiplicateur (`🎯 18/25 (x1.25)`).
  - **Bouton d'accélération active même avec manager** : Le bouton de production reste jouable en mode `🌶️ تسريع جوجمة ⚡` pour raboter 25% du cycle et charger la jauge Joujma sans bloquer l'automatisation.
- **Tests unitaires et zéro régression** (`engine.test.js`) :
  - 2 nouveaux tests unitaires complets validant la jauge Joujma, le multiplicateur x3, l'expiration et les gains VIPs (72/72 tests passants).

## [1.34.0] - 2026-11-06
### Added & Improved
- **Vue projet plein écran sans marges latérales** (`index.html`) :
  - **Suppression intégrale des bandes noires à gauche et à droite** : Suppression du `max-width: 940px` restrictif sur `.modal-card.biz-immersive` et passage en `width: 100% !important; max-width: 100% !important; height: 100vh !important; padding: 0 !important; margin: 0 !important; border-radius: 0 !important;`.
  - La scène de boutique intérieure (comptoirs, étagères, clients, caisse) et les barres HUD haute et basse s'étirent désormais d'un bord à l'autre de l'écran avec une immersion totale.
- **Révolution esthétique & Ergonomie cartographique de la Carte du Grand Maghreb** (`store_animator.js`) :
  - **Cartographie maritime & côtière de prestige** :
    - Halo aquamarine cyan (`rgba(56, 189, 248, 0.55)`) le long de toutes les côtes méditerranéennes et atlantiques, simulant les hauts-fonds lagunaires et découpant les silhouettes avec relief.
    - Graticule nautique avec coordonnées de latitude (37°N Bizerte, 35°N Sousse, 33°N Gabès, 31°N Sahara) et longitude (0°, 5°E Alger, 10°E Tunis, 15°E Tripoli, 30°E Le Caire).
    - Rose des vents ornée à 8 pointes dorées avec facettes d'ombrage et indications cardinales (N, S, E, W).
    - Égypte avec le fleuve du Nil (ruban cyan éclatant) et les 3 Grandes Pyramides de Gizeh dorées `🔺🔺`.
    - Chott el Djerid cristallin avec cristaux de sel étincelants `✨` et reflets aquatiques animés.
  - **Moteur de Zoom interactif & Commandes HUD tactiles** :
    - Zoom dynamique fluide (0.55x à 2.6x), compatible pinch-to-zoom tactile à 2 doigts et molette souris.
    - Boutons flottants tactiles à droite : `➕` (Zoom In), `🇹🇳` (Centrage Tunisie), `➖` (Zoom Out) avec jauge de pourcentage.
    - Barre supérieure de saut instantané vers les 6 nations : `[🇹🇳 تونس] [🇩🇿 الجزائر] [🇲🇦 المغرب] [🇱🇾 ليبيا] [🇪🇬 مصر] [🇲🇷 موريتانيا]`.

## [1.33.0] - 2026-11-06
### Added & Improved
- **Header ultra-compact sur une seule ligne & Bulle d'accès Carte 3D** (`index.html`, `store_animator.js`) :
  - **Header sur une seule ligne** : Restauration de l'en-tête `<header>` sur une rangée fine (`min-height: 38px`), libérant un espace vertical maximal sur mobile sans aucun défilement.
  - **Bulle 3D Haute Visibilité dans le Canvas** : Réintégration de l'orbe d'accès carte dans le ciel (`hud_map`) avec double anneau doré pulsant, dégradé azur vibrant, lueur néon et ruban `خريطة تونس 🇹🇳`.
  - **Bouton retour immédiat** : `🏪 رجوع للشارع ←` intégré dans l'en-tête de la carte pour revenir en 1 tap à la vue commerces.
- **Carte élargie du Grand Maghreb & Afrique du Nord avec toutes les capitales** (`store_animator.js`, `index.html`) :
  - **Canvas géographique agrandi (1040 x 760)** : Système de déplacement tactile 2D (pan horizontal & vertical avec inertie de glissement) permettant de naviguer fluidement du Maroc/Mauritanie à l'Égypte.
  - **Intégration vectorielle des 5 pays frères d'Afrique du Nord** :
    - **المملكة المغربية 🇲🇦** (Maroc) : relief atlantique et rifain, côtes océaniques, badge officiel.
    - **الجمهورية الإسلامية الموريتانية 🇲🇷** (Mauritanie) : désert et côte atlantique, badge officiel.
    - **الجمهورية الجزائرية 🇩🇿** (Algérie) : masse continentale centrale, frontières est/ouest et badge officiel.
    - **دولة ليبيا 🇱🇾** (Libye) : littoral méditerranéen et frontière Ras Jedir, badge officiel.
    - **جمهورية مصر العربية 🇪🇬** (Égypte) : delta du Nil, canal de Suez et côtes orientales, badge officiel.
    - **الجمهورية التونسية 🇹🇳** (Tunisie) : côtes, îles (Djerba, Kerkennah, La Galite, Zembra) et 18 villes jouables parfaitement positionnées.
  - **Les 6 Grandes Capitales régionales interactives (`regionalCapitals`)** :
    - **الرباط (Rabat)** 🇲🇦 (Maroc)
    - **الجزائر العاصمة (Alger)** 🇩🇿 (Algérie)
    - **تونس العاصمة (Tunis)** 🇹🇳 (Tunisie avec couronne royale `👑`)
    - **طرابلس (Tripoli)** 🇱🇾 (Libye)
    - **القاهرة (Le Caire)** 🇪🇬 (Égypte)
    - **نواكشوط (Nouakchott)** 🇲🇷 (Mauritanie)
    - Pins dorés `🏛️⭐`, auras néon animées, fiches modales au clic avec descriptif historique et bonus commercial international.
    - Tracé du réseau autoroutier maghrébin reliant toutes les capitales avec flux de caravanes de marchands.

## [1.32.0] - 2026-11-06
### Added & Improved
- **Header épuré & Navigation ergonomique fluide (Zéro Scroll)** (`index.html`) :
  - **Suppression intégrale du défilement horizontal** : Le header est verrouillé en `overflow: hidden; width: 100%;` avec disposition responsive en 2 rangées aérées adaptées aux petits et grands écrans mobiles.
  - **Barre de navigation segmentée 3D [🏪 الشارع والمشاريع | 🗺️ خريطة تونس]** : Sélecteur de vue tactile large (hauteur 40px, cibles ergonomiques 50% de la largeur) pour basculer instantanément entre la rue des commerces et la carte géographique de Tunisie.
  - **Bouton retour immédiat sur la carte (`returnToStreetBtn`)** : Ajout d'un bouton d'action `🏪 رجوع للشارع ←` directement dans l'en-tête de la carte de Tunisie pour un retour à la rue en 1 tap.
  - **Élimination de la pollution visuelle et des doublons** :
    - Bouton Carte unique : Suppression de l'orbe doublon dans le ciel du canvas (`hud_map`), navigation carte unifiée sur le switcher principal et retour ergonomique.
    - Bouton Guide unique : Suppression du doublon `?` dans le canvas (`hud_guide`) et simplification du header ; accès au guide rapide centralisé dans les Paramètres (`⚙️`).
    - Réduction du nombre de boutons en barre supérieure : Déplacement des actions système (Profil Google, sortie, mentions légales) dans la modale Paramètres (`#settingsModal`).
- **Piétons et ambiance urbaine (`store_animator.js`)** :
  - **Silence par temps clair** : Les piétons ne parlent plus en marchant sous le soleil (réduction drastique du bruit visuel). Leurs bulles de dialogue et répliques tunisiennes n'apparaissent désormais que lorsqu'il pleut et qu'ils courent s'abriter sous les auvents.
  - **Clarté de la سحابة البركة (Golden Cloud)** : Remplacement de l'étiquette par un libellé clair et incitatif `🎁 كاش هدية (انقر!)`.
- **Intérieur de boutique et caisse enregistreuse (`store_animator.js`)** :
  - **Caisse enregistreuse démasquée** : L'indicateur circulaire de cycle de production (loader radial) est déplacé sur le flanc de la caisse (`regX - 12, counterY + 6`), ne masquant plus jamais l'afficheur digital des prix.
  - **Boutique de vêtements (محلّ الملابس) ancrée au sol** : Portant métallique à roulettes reposant au sol (`floorY - 2`), socle chromé du mannequin de vitrine posé au sol (`floorY - 1`), grand miroir d'essayage sur pied incliné et étagère murale rabaissée avec équerres en laiton.

## [1.31.0] - 2026-11-06
### Added & Improved
- **Révolution Graphique Mobile & Direction Artistique (`store_animator.js`)** :
  - **Devantures et vitrines haute définition** : Ajout de vitrines de magasins biseautées avec reflets spéculaires brillants à 45° (`linearGradient`), cadres moulurés et éclairage intérieur dynamique réagissant au cycle de production.
  - **Auvents et tentes parasols 3D festonnées** : Tentes rayées au-dessus des portes de magasins avec rebords ondulés et ombrages portés sur la façade.
  - **Éclairage nocturne atmosphérique & Fanous Médina** : Lanternes tunisiennes en laiton ciselé installées aux entrées des boutiques qui diffusent des halos dorés chaleureux (`createRadialGradient`) sur les murs et le trottoir à la tombée de la nuit.
  - **Vœu magique de la fontaine municipale** : Clic direct sur la fontaine de la place publique déclenchant un son de vœu d'eau et de pièce étincelant (`playFountainWish`) avec toast de prospérité.
- **Architecture Audio Studio & Bus Master Compresseur (`audio.js`)** :
  - **Bus Master professionnel** : Intégration d'un `DynamicsCompressorNode` et d'un `masterGain` centralisant tous les instruments et SFX, prévenant toute saturation ou distorsion harmonique lors d'actions simultanées.
  - **Nouveaux SFX cohérents & tactiles** :
    - `playTap()` : Clic haptique feutré (340 Hz -> 140 Hz) pour chaque interaction tactile de l'interface.
    - `playCoffeeSteam()` : Bruit blanc filtré passe-bande simulant la buse vapeur d'un espresso ou d'un thé zzaouia.
    - `playSizzle()` : Frémissement de gril croustillant pour sandwichs kaskrout, fricassé et restaurant.
    - `playFountainWish()` : Tintement harmonique suivi d'un splash cristallin.
    - `playLevelUp()` : Arpège ascendant triomphal de 5 cloches harmoniques pour les montées de paliers.
  - **Mappage sonore contextuel par boutique (`playWorkSound`)** : Chaque commerce émet désormais un retour sonore thématique authentique lors de la collecte et du service.
- **Expérience Utilisateur & Animations Shimmer (`index.html`, `ARCH.md`)** :
  - Câblage d'un listener global passif déclenchant le clic tactile `playTap()` sur l'ensemble des boutons, onglets et cartes.
  - Animation de reflet spéculaire mobile (`btnGlint`) sur les boutons d'action d'élite (`.btn-serve`, `.btn-upgrade.can-afford`, `.btn-cookie-accept`).
  - Documentation d'architecture mise à jour dans `ARCH.md`.

## [1.30.0] - 2026-11-06
### Added & Improved
- **Compositeur audio polyphonique 4 voix procédural tunisien (`audio.js`)** :
  - Synthétiseur Web Audio API à 4 voix indépendantes : Bourdon et basse Oud (onde triangle avec filtre passe-bas résonant), accords et arpèges Oud (gamme Hijaz tunisienne), flûte Ney soliste expressive avec modulation vibrato LFO (5 Hz), Kanoun scintillant et percussions Darbouka (Doum et Tak sur mesure selon la cellule rythmique Malfouf).
  - Horloge audio déterministe basée sur `AudioContext.currentTime` avec lookahead constant, zéro dérive de timer, et système de nettoyage explicite de nœuds audio (`registerNode` / `disconnect`) garantissant zéro fuite mémoire.
  - SFX enrichis et tactiles : tintement de dinars harmoniques, caisse enregistreuse mécanique, cliquetis de tasse de café/thé zzaouia, fanfare d'amélioration royale, chkobba win et fanfare d'ascension.
- **Écran d'accueil royal (Splash Screen) & Ergonomie Paysage (`index.html`)** :
  - Emblème 3D autonome en SVG avec médaillon d'or, croissant, couronne impériale et voûte d'émeraude sans dépendance externe.
  - Typographie arabe soignée avec reflets dorés animés et barre de progression fluide.
  - Ergonomie paysage et écrans basse hauteur (`@media (max-height: 520px)` / paysage) : disposition compacte en 2 colonnes sans débordement vertical, barre de progression adaptée, protection contre le scroll indésirable.
- **Forme et ergonomie des boutons d'interaction 3D (`index.html`)** :
  - Boutons de jeu (`.btn-game`, `.btn-serve`, `.btn-upgrade`, `.btn-manager`, `.nav-tab-item`, `.modal-btn`) refondus avec biseau tactile 3D, bordure brillante et effet d'enfoncement physique au tap (`:active { transform: translateY(3px) }`).
  - Cibles tactiles ergonomiques garanties (hauteur minimale 44px - 46px).
  - Nuances de couleurs vibrantes (rouge tunisien velours, bleu saphir méditerranéen, vert émeraude impérial).
- **Google Ads, Mentions Légales & Gestion des Cookies (`index.html`)** :
  - Intégration du SDK Google Ads / AdMob avec gestion des annonces récompensées et fallback sécurisé hors-ligne.
  - Bannière de consentement aux cookies et au stockage local (`#cookieConsentBanner`) non-intrusive, conforme RGPD et loi tunisienne INPDP (n° 2004-63).
  - Modal Mentions Légales & Confidentialité enrichi avec panneau de contrôle des préférences de cookies (techniques indispensables / personnalisation des annonces Google).
  - Persistance locale du consentement dans `localStorage.tounes_cookie_consent`.

## [1.29.0] - 2026-11-05
### Added & Improved
- **Brouette Kaskrout Ayari (`kaskrout`) - Refonte complète & Human scale** :
  - **Brouette abaissée à hauteur humaine réaliste** : Structure redimensionnée (hauteur 75px au lieu de 120px perchée trop haut) : caisse en bois patiné d'olivier à hauteur de hanche (`groundY - 30`), roues cerclées d'acier posées directement au sol (`wheelR = 10`), vitrine basse d'ingrédients frais (`🥚`, `🥖`, `🌶️`, `🥫`), mât inox et parasol rouge et blanc d'ombrage rabaissé harmonieusement.
  - **Suppression du bouton visite inutile** : Élimination du bouton superflu `زيارة 🏪` et de l'action inspect. Le tap direct sur la brouette collecte immédiatement les recettes (`collect`).
  - **Marchand de Kaskrout (الشاف عياري)** : Vendeur positionné fièrement derrière sa brouette avec tablier blanc, col rouge, chéchia tunisienne traditionnelle (`الشاشية`) et moustache. Gestuelle animée : découpe énergique de la baguette au couteau (`🔪🥖`), garniture d'œufs durs et de harissa, et service à deux mains vers le client.
  - **Animation vivante de rue (Passager qui s'arrête, commande, paye et repart)** :
    - Un piéton s'approche et s'arrête devant la brouette avec bulle de commande : `"🥖 كسكروت عياري حار عيشك !"`.
    - Le chef répond `"حاضر يا باهي ! 🔥"` et prépare activement le sandwich.
    - Échange : le chef tend le sandwich, le client tend les dinars (`🪙 3.5 DT`) avec pop de dinars flottants (`+3.5 DT`).
    - Le client repart sur le trottoir son kaskrout en main (`🥖`), bulle satisfaite : `"صحّة لينا ! بنّة عالمية 👌"`.
- **Correction affichage Square, Statue/Horloge et Fontaine (`monument_square`)** :
  - Résolution du bug de filtrage dans `buildZoneLayout` : `monument_square` est désormais compilé et inséré sans faille dans `streetLayout` de toutes les villes.
  - Remplacement direct des anciens jardins statiques par la `ساحة الساعة والنافورة والحديقة` complète dans Tunis / Bab Souika et toutes les villes.

## [1.28.0] - 2026-11-05
### Added & Improved
- **Square / Jardin Public & Tour de l'Horloge / Fontaine Animée dans TOUTES les villes (`monument_square`)** :
  - **Monument Square garanti dans chaque ville** : Insertion automatique et garantie dans toutes les villes tunisiennes (Tunis, Bab Souika, La Goulette, Lac 2, Hammamet, Sousse, Monastir, Mahdia, Bizerte, Nabeul, Kairouan, Sbeitla, Sfax, Gabes, Gafsa, Tozeur, Béja, Le Kef, Tataouine, Médenine, Djerba, Annaba, Tripoli).
  - **Square / Jardin Public arboré** : Esplanade dallée en marbre et pierre taillée, calades décoratives, parterres de pelouse verte soignée (`#15803d`), buissons de jasmins odorants (`🌸`, `🌿`), banc public tunisien en fer forgé avec petit chat de la médina assoupi (`🐱`), lampadaire traditionnel en fer forgé à lanterne dorée chaleureuse (`💡`).
  - **Tour de l'Horloge monumentale & Statue** : Socle à degrés en pierre dorée de Chemtou, fût élancé avec motifs géométriques et arcades mauresques en relief, chambre haute à grand cadran d'horloge lumineux avec aiguilles tournantes en temps réel (heures & minutes synchronisées sur l'horloge système), toit pyramidal en tuiles vernissées vertes tunisiennes surmonté d'une flèche dorée et d'un croissant étincelant (`🌙`).
  - **Fontaine municipale d'eau vive jaillissante** : Grand bassin en marbre mouluré à miroir d'eau turquoise et ondes concentriques animées, double vasque sur pied sculpté, jet d'eau vertical jaillissant à hauteur variable (`Math.sin(timeSec * 5)`), cascades d'eau latérales paraboliques, débordements et gouttelettes étincelantes au soleil.
  - **Interaction tactile / Vœu dans la fontaine** : Taper sur la fontaine permet de faire un vœu de prospérité avec tintement de pièces (`soundEngine.playCoin`) et toast de bénédiction tunisien (`🪙 رميت دينار في النافورة وتمنيت البركة والتوفيق ! ✨`).
- **Comptoirs et commerçants sans pieds visibles (Toutes les boutiques)** :
  - Zéro pieds ou chaussures visibles sous les tables et comptoirs dans tous les commerces (`showLegs = false` par défaut dans `drawWorker`).
  - Seuls les employés qui se déplacent activement à pied dans la boutique (garçon de café, poissonnier ambulant) affichent leurs jambes et chaussures.
- **Vente de fruits de mer (`fruits_de_mer`)** :
  - Caisses de marée en bois de pêcheur avec rebords, garnies de glace pilée étincelante et de produits frais (dorades `🐟`, crevettes royales & citrons `🦐🍋`, poulpes `🦑`, crabes `🦀`, étiquettes ardoise de prix à la craie).
  - Assistant poissonnier ambulant avec machine à états (`moving_to_crate` -> `picking` penché sur la caisse -> `moving_to_counter` avec plateau en main -> `giving_order` au client).
- **Correction des bugs de recrutement et du popup employés (Tous commerces & Toutes villes)** :
  - Harmonisation rigoureuse de `hiredCount` et `managers.length` entre `engine.js`, `index.html` et `store_animator.js`.
  - Élimination de la fausse carte doublon statique `عون الخدمة القار` qui faussait le popup du café et de tous les commerces.
  - Seul le PROCHAIN poste de travail recrutable affiche le bouton `drawHireButton` (`خدّم`) avec coût exact. Les postes ultérieurs non débloqués affichent `مغلق 🔒` sans bouton d'embauche intempestif.

## [1.27.0] - 2026-11-05
### Added & Improved
- **Café Populaire (`kahwa` / `kahwa_counter`)** :
  - **Conversations animées** : Les clients assis au comptoir interagissent entre eux (hochements de tête expressifs vers le voisin, gesticulations des mains animées à la tunisienne).
  - **Cigarettes allumées** : Certains clients fument au comptoir avec une vraie cigarette fine tenue entre les doigts, portée périodiquement aux lèvres, dotée d'une braise rouge ardente qui pulse et de volutes de fumée montant et s'évaporant avec fluidité.
- **Salon de thé (`salon_de_the`) & Restaurant (`restaurant`)** :
  - **Correction du masquage de table (profondeur 2.5D)** : Découplage de l'ordre d'affichage (fauteuil en fond -> client assis -> plateau de table et service au premier plan) : la table, la nappe, les couverts et les décors ne sont plus jamais masqués par le buste ou les jambes du client !
  - **Chicha tunisienne majestueuse (`شيشة معسّل`)** : Les clients du salon de thé peuvent commander une chicha posée à côté de la table (vase tulipe en verre teinté aux reflets d'eau, tige laiton ciselée, plateau pare-cendres, foyer terre cuite avec braise de charbon incandescent ardent, tuyau flexible brodé "marrach" relié à la main du client avec embout précieux, et bouffées de fumée blanche vaporeuses expirées vers le haut).
  - **Service de restauration** : Plats chauds tunisiens mijotants (tajine, couscous, grillades) avec volutes de vapeur chaude devant chaque convive.
- **Météo dynamique de la rue (`QuartierAnimator`)** :
  - **Averses et pluie dynamique** : Cycle météo alternant avec intensité progressive, rideau de gouttes de pluie tombant en diagonale avec le vent.
  - **Flaques d'eau sur l'asphalte** : Flaques d'eau réalistes à reflets bleutés formées sur la chaussée avec cercles d'ondulation concentriques animés par les impacts de gouttes.
  - **Éclaboussures de véhicules (splashes)** : Quand les taxis, louages et voitures franchissent les flaques d'eau, des gerbes d'eau arquées jaillissent en éventail des roues.
  - **Réaction des piétons** :
    - Piétons avec parapluie (`☂️`) : Déploient un dôme de parapluie coloré au-dessus de la tête et continuent leur marche paisiblement à l'abri.
    - Piétons sans parapluie : Se mettent immédiatement à courir vite (vitesse x2.3, foulée rapide, corps penché en avant, mains levées pour protéger leur tête) avec exclamations tunisiennes (`"يا لطيف صبّت ! 🌧️"`, `"جري جري ! 💨"`).

## [1.26.0] - 2026-11-05
### Added & Improved
- **Épicerie (`attariya`)** : Étagères murales d'épicerie garnies de produits tunisiens diversifiés (`🥫`, `🍅`, `🫒`, `🍯`, `🥛`, `🧀`, `🍞`, `☕`), personnel positionné fièrement derrière le comptoir, disparition du bloc au-dessus de la caisse remplacé par un calendrier mural éphéméride tunisien traditionnel (`📅 5 NOV` / `خميس`), balance en laiton (`⚖️`) sur la table.
- **Suppression des icônes sur la tête des clients** : Dans toutes les boutiques, élimination complète de la bulle d'icône flottante au-dessus de la tête des clients pour un rendu fluide et naturel.
- **Amélioration de la caisse et du comptoir** : Caisse enregistreuse POS moderne (clavier rétroéclairé, scanner code-barres avec laser rouge `🔴`, fente à ticket `🧾`, écran vert avec prix dynamique), table de comptoir avec tablette supérieure soignée, finitions acajou et double poignée dorée.
- **Boutique de vêtements (`vente_vetements`)** : Étagères avec piles de vêtements pliés (`👕`, `👖`, `👗`), étendoir/portant chromé roulant avec cintres et vestes (`🧥`, `👔`), mannequins de vitrine en plastique beige sur socle chromé avec robe élégante, sacs shopping sur le comptoir.
- **Supérette (`superette`)** : Rayonnage modernisé avec 3 gondoles de supermarché à liserés de prix, produits alimentaires, boissons fraîches, snacks et paniers de fruits frais.
- **Banque (`bank_branch`)** : Guichet bancaire sécurisé ultra-réaliste avec vitre blindée, hygiaphone en laiton (`🎤`), passe-documents inox, compteuse de billets (`💵`), tapis rouge d'honneur menant au guichet, et client VIP à mallette diplomatique.
- **Guichet de tabac (`tobacco_kiosk`)** : Suppression des textes encombrants et du bouton retour superflu dans le modal, armoire murale garnie de paquets de cigarettes multicolores (`🚭 قمريڨ تونس`), comptoir avec journaux, briquets et caisse actualisée.
- **Salle de jeux (`salle_de_jeux`)** : Table de billard totalement dégagée (zéro écran qui la masque), espace repensé avec 3 postes consoles distincts (FIFA `⚽`, Course auto `🏎️`, Combat `🥊`) sur grands écrans 16:9 montés au mur avec meubles gaming et diodes néon.
- **Vente de dattes (`emballage_dattes`)** : Étagères en bois noble garnies de cagettes et coffrets de dattes Deglet Nour Tozeur dorées (`🌴`, `📦`, `🍯`), panonceau officiel Tozeur, coffret dégustation sur le comptoir.

## [1.25.0] - 2026-11-05
### Added & Fixed
- **Caisses enregistreuses dynamiques** : Le prix affiché sur les caisses (comptoir standard, écrans POS supermarché/supérette, guichet de tabac, écrans croisière/voyage) évolue désormais en temps réel avec le niveau du commerce (+1.5%/niveau) au lieu de rester figé sur le prix de base.
- **Recrutement direct au niveau de la place libre** : Ajout d'un bouton d'embauche clair et élégant (`➕ انتداب` / `➕ خدّم`) avec coût formaté (`DT`) directement sur les postes vacants (caisses libres du supermarché/supérette, 2ème bureau libre croisière/voyage, postes artisans vacants) permettant le recrutement en un clic.
- **Fermeture automatique au clic extérieur** : Disparition immédiate du panneau des employés (`الخدّامة`) et du menu des produits (`اللائحة`) dès qu'on clique ou touche n'importe où en dehors du tiroir ; fermeture automatique de toutes les modales/popups au tap hors de leur carte centrale.

## [1.24.0] - 2026-11-05
### Added & Improved
- **Salon de thé & Restaurant** : 5 tables assises dédiées avec nappes et bougies ; suppression totale des étagères génériques au profit d'une déco d'ambiance haut de gamme (lustres cristal, miroir baroque doré, plantes d'intérieur, assiettes zellige). Au restaurant, service dynamique de plats chauds tunisiens (`🍲`, `🍛`, `🍗`, `🥩`, `🥘`, `🥗`) apportés par le serveur aux clients attablés.
- **Magasin Général (supermarché)** : Suppression des étagères génériques et des numéros sur les caisses (remplacés par des indicateurs LED discrets `✓`) ; ajout de 3 grands linéaires/rayons d'hypermarché en arrière-plan avec catégories (Épicerie, Boissons, Frais).
- **Supérette** : Configuration calibrée à 2 caisses maximum, diversification des produits (fruits frais, boissons, snacks, produits laitiers) et gondoles de proximité soignées.
- **Pâtisserie** : Élimination des étagères murales brutes, ajout d'une grande vitrine réfrigérée bombée de boulangerie/pâtisserie en bas avec étalages de gâteaux fins et viennoiseries/baklawa dorée.
- **Salle de jeux** : Table de billard + postes consoles avec de grands écrans 16:9 montés au mur affichant des scènes de jeux animées et rétroéclairage ambilight néon RGB.
- **Librairie & autres métiers** : Remplacement des étagères brutes par une majestueuse bibliothèque en acajou avec volumes reliés cuir/or, globe terrestre et lampe banquier ; suppression des étagères moches sur l'ensemble des commerces au profit de décors muraux épurés et contextuels.

## [1.23.0] - 2026-11-04
### Changed
- Icône appli/APK futuriste finance & business, sans drapeau.
- Prix réalistes tunisiens (+1.5%/niveau) ; réservations yacht/voyage par personne.
- Intérieurs épurés (HUD sans chevauchement, zéro gros texte), 1 travailleur minimum dès le départ.
### Fixed
- Projets inachetables (Sousse, Annaba, Tripoli, Tunis/fricassé) ; achat avec solde bancaire ; raison du verrouillage affichée.

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

## 2026-11-11
- fix(map,ui): restauration onglet 'الخريطة' et correction complete des clics carte et HUD
- fix(map,ui): restauration onglet 'الخريطة' et correction complete des clics carte et HUD
- fix(bank,map): degager le guichet banque (grille 2 col) et fluidifier la carte a 60fps avec centrage direct
- fix(ui): renommage bouton retour en haut a droite en 'الخريطة'
- feat(anim): interaction taxi rue - pieton hele, taxi s'arrete, mekech fi thniti, repart
- fix(ui): suppression bouton settings (⚙️) et bouton piment (joujma) inutile
- fix(ui): suppression bouton settings (⚙️) et bouton piment (joujma) inutile
- feat(ui): bouton carte/profil visibles, sortie prime, banque compacte
- fix(map,ui): suppression bouton 'map' (tab خريطة تونس), restoration bouton retour en haut
- fix(map,ui): recentrer carte sur Tunis (zoom 1.3, pan 40) + suppression bouton retour en haut
- fix(map,ui): recentrer carte sur Tunis (zoom 1.3, pan 40) + suppression bouton retour en haut
- fix(tabac,uiux): enseigne kiosque 'بيع الفواكه الجافة'
- docs(gdd): houma hustle game design doc
- feat(tabac,uiux): petite affiche paquet de cigarettes sur facade kiosque
- fix(tabac,uiux): enseigne kiosque 'bay3 fewekh jaffa'
- fix(tabac,uiux): enseigne kiosque 'قمر vaping' sans ي
- fix(tabac,uiux): enseigne kiosque reduite a '🚬 قمريڨ' seule
- chore(dev,debug): hooks CDP headless __bankSceneSims/__quartierEngine/__tobaccoSceneSim + verif pixel CDP scenes epurees
- chore(config): opencode.json model beam-free illimite pour dev jeu

## 2026-11-10
- fix(ui,anim): banquier & buraliste nets sans flamme ni superposition, facades rue epurees
- fix(banque,uiux): flamme tete banquier supprimee (workFx), badge chobbek1 petit en bas sur comptoir, bulles texte raccourcies, debug hook scene sims
- feat(banque,tabac,audio): guichets banque visibles rue, hygiaphone+file tabac, reverb sfx+playBankVault cable
- feat(graphics): couche pixi GPU activee (pixi.min.js -> window.PIXI), 3 FX nouveaux archetypes kahwa/studio/hotel, SDK AdSense externe retire
- feat(graphics): activez couche Pixar GPU (pixi.min.js charge, window.PIXI branche) + 3 FX nouveaux archetypes kahwa/studio/hotel, SDK AdSense externe retire
- docs(handoff): reprise v153 zero pub, 116/116 tests
- feat(ads): kill-switch ADS_ENABLED=false zéro pub affichée, récompenses accordées sans vidéo, funnel AdMob complet prêt derriere le drapeau
- feat(ads): kill-switch ADS_ENABLED=false zéro pub affichée, récompenses accordées sans vidéo, funnel AdMob complet prêt derriere le drapeau
- docs(handoff): reprise v152 studio jeux video UI/UX, 110/110 tests
- feat(studio): recrutement equipe graphistes UI/UX + expert jeux tycoon, studio_jeux_video a Tunis/Sousse, 2 nouveaux evenements gaming, neon coder studio

## 2026-11-08
- fix(loading,map): fix webview module 404, restore visible nav tabs and realistic tunisia map
- fix(loading,map): fix webview module 404, restore visible nav tabs and realistic tunisia map
- fix(splash): pure css auto-dismiss and instant tap unlock to prevent any loading overlay freeze
- fix(loading,street): remove blocking head script, add splash fallback and sync projects in street layout
- feat(graphics): integrate PixiJS 2D HD GPU engine with vector textures and dynamic lighting
- fix(loading): resolve syntax error and enforce zero-blank-screen test in CI and ship script
- feat(map,projects): realistic cartographic map and new bar cha3bi and nightclub projects
- fix(boot): resolve app launch freeze by bundling motion primitives and updating apk assets sync
- feat(motion): 60fps mobile motion engine, spring physics, glassmorphism and canvas visual depth

## 2026-11-06
- feat(fricasse): sidi bou said authentic shop with 2 frying pans, kais saied portrait and 2026 calendar
- feat(gameplay,art): joujma fever mode x3, interactive street vips, milestone progress bars and rush serve button
- feat(map,biz): fullwidth project view with zero side margins, beautiful cartography with coastal shelf, nile, pyramids, zoom controls and country jump pills
- feat(map,ui): single row header, canvas map bubble, enlarged north africa map with algeria, morocco, libya, egypt, mauritania and all capitals
- feat(ui,ux): clean header without scroll, single prominent map button, silenced sunny pedestrians, grounded boutique and unmasked cash loader
- feat(graphics,audio,ui): mobile game art revolution, dynamic store vitrines, master audio compressor and tactile haptics
- feat(ui,audio,ads): polyphonic composer, 3d ergonomic buttons, splash landscape, google ads and cookie consent
- fix(mobile): restore app startup on Android and fix AGENTS.md encoding
- fix(mobile): restore app startup on Android and fix AGENTS.md encoding
- fix(tycoon): resolve drawPOSTerminal timeSec ReferenceError restoring customer rendering across all 30 businesses

## 2026-11-05
- fix(tycoon): customer continuous stream vitality and exact 1:1 staff workstation capacity match
- feat(tycoon): 4 new authentic businesses, dynamic atmospheric sky, golden fortune cloud, and ergonomic zero-overflow layout
- feat(tycoon): 4 new authentic businesses, dynamic atmospheric sky, golden fortune cloud, and ergonomic zero-overflow layout
- fix(tycoon): solve hire modal closing bug, dynamic pos registers without overflow, 2-person restaurant tables, bank visibility and street tobacco kiosk flow

## [v122] - 2026-11-04

### Added, Changed & Fixed (Royal Welcome Splash Screen, GDPR Google Profile & Strict Rewarded-Ad Gating)
- **Animation d'Accueil Royale (`#welcomeSplashScreen` dans `index.html`)** :
  - Écran d'accueil animé plein écran avec médaillon 3D en lévitation, grand titre calligraphié doré à reflet animé (`تونس تايكون`), devise encadrée (`✨ إمبراطورية المال والأعمال • من الحومة إلى القمّة ✨`), barre de progression dorée/émeraude (`0%` $\rightarrow$ `100%`) avec messages d'étape dynamiques, et petit texte légal en bas (`© EOLabs 2026 • جميع الحقوق محفوظة • النسخة الذهبية`).
- **Fonctionnalité Profil Connectée au Compte Google — 100% Conforme RGPD & Google Play (`engine.js`, `index.html`, `engine.test.js`)** :
  - Bouton d'accès rapide au Profil (`👤` / `🟢`) dans le header principal et section dédiée `#googleProfileSection` en tête du modal Profil & Paramètres.
  - Liaison volontaire au compte Google (supportant `window.google.accounts.id` et la liaison locale sécurisée sans collecte sur serveur tiers), sauvegarde synchronisée dédiée (`tounes_tycoon_google_backup_<email>`), bouton de synchronisation manuelle (`🔄 مزامنة الحفظ الآن`) et bouton de déconnexion/effacement immédiat des données liées (`🚪 فصل الحساب` — droit à l'oubli RGPD).
- **Suppression de tout "Solde" Gratuit sans PUB & Passage Obligatoire de toute Accélération par PUB (`ads_service.js`, `index.html`, `store_animator.js`)** :
  - Suppression du bouton de solde gratuit `#tobaccoTipBtn` dans `#tobaccoModal`.
  - Suppression des gains instantanés hors-cycle au clic dans `onCollect` et `triggerServe` (ainsi que du gain gratuit `+1.00 د.ت` sur les bâtiments verrouillés) : un clic sur un commerce démarre uniquement son cycle de production normal (`engine.startProduction`), et le revenu n'est versé qu'à l'issue du cycle.
  - Lecteur vidéo publicitaire intégré dans `AdsService.showRewardedBoost()` (avec barre de progression, compte à rebours obligatoire et annulation sans récompense si fermé avant la fin) verrouillant toutes les accélérations et récompenses bonus (`تيربو x2`, `عجلة الحظ`, `صندوق الحظ`, `بريم الحضور`, `تحديات اليوم`, `طرح شكبة`, `مهمات`).

## [v121] - 2026-11-04

### Added, Changed & Fixed (Wealth Logo, Bespoke Business Animations, Bank & Tobacco Live Scenes, Simplified City Unlocks)
- **Logo de l'Application Inspiré Argent & Fortune — Sans Drapeau (`index.html`)** :
  - Nouveau blason vectoriel 3D `.brand-logo-mark` inspiré de l'argent et de la richesse (couronne dorée, médaillon coffre émeraude, lingots d'or empilés et pièce centrale `د.ت`), sans aucun drapeau, croissant ni étoile rouge.
- **Animations Intérieures 2.5D Sur-Mesure par Type de Projet (`store_animator.js`, `engine.js`, `index.html`)** :
  - **Café (`kahwa` -> `'kahwa_counter'`)** : Comptoir abaissé et proportionné (`deskH = 38`, `barY = 141`), serveur mobile actif (`سرباي`) qui apporte et sert la boisson au client au comptoir (`☕`/`🍵`), puis le client se déplace jusqu'à la caisse (`الكاسة`), paye et sort.
  - **Salon de Thé (`salon_de_the` -> `'tea_lounge'`)** : 3 tables de salon avec fauteuils où les clients s'assoient (`isSeated = true`) ; le serveur mobile (`سرباي`) leur apporte les boissons sur plateau (`🍹`/`☕`), puis les clients se lèvent, passent à la caisse (`الكاسة`) pour payer et sortent.
  - **Croisières (`croisiere_mer`) & Agence de Voyage (`agence_voyages` -> `'agency_desks'`)** : Aucune marchandise exposée au milieu ; deux bureaux exécutifs (`مكتب المدير 💻` et `مكتب المساعد 🖥️`) équipés d'ordinateurs ; les clients entrent, passent commande aux bureaux, payent et repartent avec leurs contrats/papiers (`📄`) en main.
  - **Magasin Général / Supermarché (`supermarche`, `superette` -> `'supermarket_checkout'`)** : Clients poussant des chariots de supermarché (`🛒`) remplis d'articles et passant tous par la caisse ; les employés sont des caissiers (`كاشير الكاسة 1..3`) ; le projet démarre avec 1 seule caisse active et permet de recruter jusqu'à 3 caissiers avec tapis roulants et terminaux POS ergonomiques.
  - **Guichet de Tabac (`tobaccoModal` -> `'tobacco_kiosk'`)** : Scène Canvas 60 FPS intégrée avec un seul employé (`عون وحيد`) ; les clients entrent, commandent (`🚬`/`📰`/`💧`), payent à la caisse et repartent ; ergonomie compacte 3 colonnes sans débordement.
  - **Banque (`bankModal` -> `'bank_branch'`)** : Scène Canvas 60 FPS d'entrée à la banque où le client franchit l'entrée sur tapis rouge jusqu'au guichet blindé (`شباك العمليات البنكية 💳`) et l'agent de guichet (`عون الشباك`) l'accueille et valide son opération (`✓ مرحبا! العملية مقبولة`).
- **Simplification des Critères d'Accès aux Nouvelles Villes (`engine.js`, `engine.test.js`)** :
  - Allègement des prérequis sur les 18 villes (Bizerte : niv 5, Béja : niv 10, Le Kef : 60k DT seuls, Sousse : 150k DT + 1 projet niv 15 sans Prestige requis, Monastir : 2 managers, Kairouan : 1 projet niv 20, Sfax : 1 projet niv 25 sans Prestige requis, Gafsa : 4.5M DT seuls, Tozeur : 1 projet niv 30, Djerba : Prestige 3 sans titre Légende requis).

## [v120] - 2026-11-04

### Changed & Fixed (Authentic Tunisian Darja Overhaul & Zero-Overflow UI Ergonomics)
- **Révision Linguistique 100% Darja Tunisienne Authentique (`engine.js`, `index.html`, `store_animator.js`)** :
  - **Élimination des textes machrékins / syriens / égyptiens et erreurs culturelles** :
    - `مطعم ابو علي الشامي` & `شاورما سوري ومقبلات شامية` $\rightarrow$ **`مطعم المصلّي والمشوي`** (`مصلّي علّوش، كفتاجي سخون ومشوي على الكانون يردّ الروح !`, `صحن كفتاجي وعصبان وتسطيرة`, `المعلّم مبروك الكبابجي`).
    - `باجة : مطماطة الشمال` $\rightarrow$ **`مطمورة الشمال`** (grenier à blé historique).
    - `قابس : الحناء الجبسية` $\rightarrow$ **`الحنّة القابسية`**.
    - `المنستير : الحوت الشامي الأزرق` $\rightarrow$ **`الحوت الأزرق والسرغوس`**.
    - `ماء زهر وقرصة كستناء` $\rightarrow$ **`ماء زهر وطرشية بندق ولوز`** ; `كرني الكريدي المورود` $\rightarrow$ **`كرني الكريدي الوردي`** ; `بوڨاع سيدر` $\rightarrow$ **`بوڨا سيدر`**.
  - **Remplacement du Fusha administratif & suppression des parenthèses en français** :
    - Noms de projets concis et 100% tunisiens (max 16–24 caractères) : `مارشي الحوت وفواكه البحر`, `حليب وأجبان باجة` (قوتة ورايب وسمن عربي), `جزّار اللحم البلدي` (هبرة بقري وعلّوش بركوس), `مكتبة وورّاقة الحومة`, `بوتيك الحوايج والفريب`, `مونقالات وصياغة فاخرة`, `صالة بلياردو وبلاي` (`جيتون 🎱🎮`), `تكييف وتصدير دقلة النور`, `رحلات بحرية ويخوت`, `صالون دي تاي البحيرة`, `وكالة أسفار قرطاج`, `المول والمركّب التجاري`, `شوروم كراهب فاخرة`, `شركة البنيان والعقارات`.
    - Modales & Toasts en Darja naturelle : `قمريڨ • كشك الدخّان والوقيد والجرائد` (`دخّان وطني ووقيد`), `دوريات الحاكم مأمّنة حوانتك والشارع الكلّ`, `همزة باهية طاحتلك !`, `إيه، عاود من الصفر 🔥`, `مرحبا بيك في ...`.
- **Ergonomie UI & Zéro-Débordement / Zéro-Coupure (`store_animator.js`, `index.html`)** :
  - Suppression des `.slice(0, 8)` et `.slice(0, 48)` sur les textes arabes dans `drawCaravanAnimation` et `drawSelectedCityOverlay` (qui tronquaient les mots au milieu) au profit d'un calcul `ctx.measureText` avec auto-ajustement de police et `maxWidth` natif Canvas 2D.
  - Protection anti-collision dans la carte de ville sélectionnée (`maxBonusW = cardW - btnW - 32`) pour que le bonus `🎁` ne chevauche jamais le bouton d'action à gauche.
  - Contrainte `maxWidth` explicite sur toutes les enseignes de bâtiments (`drawBuilding`, `drawAmbience`, `drawArrivalEffect`) et durcissement CSS (`overflow-wrap: break-word`, `max-width: calc(100vw - 24px)`) sur `.toast-box` et `.btn-manager`.

## [v119] - 2026-11-04

### Added & Enhanced (Archetype-Driven Tycoon Customer Gameplay)
- **Comportements Clients & Mobilier Interactif 100% Adaptés au Métier (`getBizArchetype`)** :
  - **Salle de Jeux & Billard (`salle_de_jeux` -> `'arcade_billiard'`)** :
    - Grande Table de Billard 2.5D en acajou et tapis vert émeraude avec 6 poches et 5 billes roulantes en temps réel + station Console PS5 / Écran Gaming LED.
    - Les clients entrent pour **JOUER** d'abord (animation de visée avec queue de billard en va-et-vient ou manette `🎮` vibrante en main + jauge radiale de partie), puis passent à la caisse payer et repartent les mains libres (sans cabas d'épicerie).
  - **9ahwa Chaabeyya & Salon de Thé (`kahwa`, `salon_de_the` -> `'kahwa_counter'`)** :
    - Grand comptoir de dégustation en bois sculpté et cuivre avec **5 tabourets et sous-tasses alignés** permettant d'accueillir **jusqu'à 5 clients simultanément**.
    - Les clients s'installent, **boivent leur café/thé à la menthe par gorgées animées** (bras levant la tasse `☕`/`🍵` vers la bouche + volutes de vapeur blanche), paient au comptoir et sortent.
  - **Yachts & Croisières, Voyages, Hôtels, Showroom Auto, Immobilier, Aviation (`croisiere_mer`, etc. -> `'booking_service'`)** :
    - **Aucune marchandise ni tapis roulant** : bassin marin lumineux avec **Maquette de Yacht de Luxe** naviguant sur les vaguelettes (ou podium VIP avec cordon de velours rouge et potelets dorés).
    - Les clients entrent, consultent l'offre (`📋`), **réservent leur croisière/contrat** au guichet `حجز VIP 🎫` et repartent avec leur billet/clé (`⚓`/`🎫`/`🔑`) sans aucun sac d'achat.
  - **Restauration Chaude (`kaskrout`, `fricasse`, `restaurant` -> `'food_counter'`)** : Dégustation chaude au comptoir vitré puis encaissement.
  - **Usines (`usine_conserves`, `emballage_dattes` -> `'industrial_belt'`)** : Conservent exclusivement le tapis roulant industriel motorisé 2.5D.
  - **Boutiques & Commerces (`attariya`, `patisserie`, `boucherie`, `fruits_de_mer`, etc. -> `'retail_shop'`)** : Choix devant la vitrine d'exposition, passage en caisse et départ avec cabas de shopping.

## [v118] - 2026-11-04

### Added, Refactored & Cleaned (True Tycoon Interior Engine)
- **Boucle Visuelle Tycoon Authentique (`CanvasStoreEngine`)** :
  - **Jauges Radiales & Barres Temps Réel (`drawRadialGauge`)** : Synchronisées au milliseconde près avec `biz.progressMs / biz.cycleDurationMs` au-dessus de chaque artisan recruté, sur l'écran POS de la caisse, sur l'enseigne supérieure et au-dessus du client en cours d'encaissement.
  - **Supply Chain & Tapis Roulant 2.5D (`conveyorItems` & `counterStock`)** : Les postes de travail fabriquent physiquement des produits sur plateaux dorés qui glissent sur un rail convoyeur animé jusqu'au présentoir vitré du comptoir avant d'être remis aux clients.
  - **Évolution Architecturale par Palier (`getStoreTier` Tier 1..5)** : Déblocage automatique de tapis VIP à franges dorées (Tier >= 2), bandeaux Néons LED sur les corniches et sous le marbre du comptoir (Tier >= 3), comptoirs dorés (Tier >= 4) et badge `★T1..T5` sur l'enseigne.
  - **Porte Vitrée Battante, File d'Attente Structurée & Sac de Sortie** :
    - Vraie porte d'entrée vitrée battante à droite (`drawEntranceDoor`) avec enseigne lumineuse `مفتوح` et clochette dorée (`🔔`) qui oscille à chaque passage.
    - File d'attente déterministe à 4 emplacements (`96, 122, 148, 174`) éliminant toute superposition entre clients.
    - Les clients servis repartent vers la porte de sortie avec un cabas de shopping vectoriel en main (`c.hasBag`) d'où dépasse l'article acheté, sans jamais traverser le meuble comptoir.
  - **Onde de Choc Interactive au Tap (`tapRipples`)** : Chaque tap dans la boutique génère une onde dorée et propulse immédiatement un produit turbo sur la chaîne de production.
- **Audit Lead Dev — Clean Code, Zéro Fuite Mémoire & Intégrité Économique** :
  - Suppression de tout le code mort (`this.steamWisps`, `drawRoleTag`, `this.avatarsPool`, `this.onUpgradeClick`, doublons de variables).
  - Mise en cache intelligente de `engine.getBusinessDetail(bizId)` dans la boucle 60 FPS (recalculé uniquement lors d'un changement de niveau ou d'effectif).
  - Plafonnement strict FIFO des pools mémoire (`particles <= 42`, `moneyPuffs <= 14`, `conveyorItems <= 6`, `tapRipples <= 6`).
  - Correction du bug d'exploit de double/triple créditation de `engine.dinars` dans `triggerPayment`, `handleCanvasClick` et `onServe` (`engine.update` demeure la source unique de vérité financière).
  - Correction du ratio vertical `clickY` dans `handleCanvasClick`.

## [v117] - 2026-10-26

### Fixed & Enhanced
- **Correction critique d'affichage de la raison des villes bloquées** :
  - Correction du bug de portée ES Module : `showFeedbackToast` et `showRewardModalUI` n'étaient pas attachés à `window`, ce qui empêchait `store_animator.js` d'afficher le toast lors du clic sur une ville verrouillée.
  - Ajout d'un bandeau d'explication pleine largeur en bas de la Popover de la Carte (`⚠️ علاش مقفولة : ...`) pour ne jamais tronquer le texte.
  - Affichage direct de la condition sous l'épingle de chaque ville verrouillée sur la carte (`🔒 برستيج 1`, `🔒 4xL35`, `🔒 5 معلّم`, etc.).
- **Visibilité permanente des animations intérieures des projets** :
  - Auparavant, les boutons de recrutement (`➕ خدّم`) étaient dessinés par-dessus les machines (`y = 92..146`), cachant complètement les animations tant que les employés n'étaient pas recrutés, et `isBusy` figeait les machines hors clic.
  - Désormais, les postes et machines fonctionnent en continu dès que le projet est acheté (`level > 0`), le bouton de recrutement est compacté et placé au-dessus de la machine sans la couvrir, et un spectacle central animé (`drawCentralActionShowcase`) fait circuler les produits fabriqués au cœur de la boutique.
- **Synchronisation `www/` & Cache-Busting `?v=117`** :
  - Synchronisation complète de `www/` (qui était resté sur la version du 24/10) et ajout de `?v=117` sur les imports ES Modules pour invalider tout cache navigateur/WebView.

## [v116] - 2026-10-26

### Added & Enhanced
- **Animations Intérieures Révolutionnées par Métier (`CanvasStoreEngine`)** :
  - *Café & Salon de thé* : Théière inclinée en l'air versant un jet de thé ambré parabolique dans le verre moussant à la menthe.
  - *Poissonnerie & Croisière* : Étalage réfrigéré de glace pilée cristalline avec poissons et crevettes sautillants.
  - *Boucherie* : Billot en bois d'olivier et couperet de boucher animé en cadence.
  - *Horlogerie & Bijouterie* : Vitrine blindée et éclats stellaires rotatifs sur le diamant.
  - *Librairie, Laiterie de Béja, Mode, Salle de Jeux Arcade Néon, Dattes Deglet Nour, Hôtel & Voyages* : Postes de travail animés dédiés (plus aucun carton générique).
  - *Éclairage Volumétrique & Vie* : Faisceaux lumineux dorés sous les lanternes orientés vers le sol, clignement naturel des yeux des artisans (`Blinking State Machine`) et rebond physique élastique de la caisse enregistreuse à chaque encaissement.
- **Amélioration du Moteur Audio (`audio.js`)** :
  - Ajout de `playCashRegister()` (claquement mécanique du tiroir + double clochette Cha-Ching!), `playWorkSound(bizId)` synchronisé avec chaque encaissement client, et enrichissement harmonique de `playCoin()` et `playTeaCup()`.
- **Diagnostic Temps Réel des Villes Verrouillées (`getCityLockDiagnosis`)** :
  - Calcul dynamique exact de la raison du blocage affiché sur la Carte et dans la liste (ex: `ناقصك X د.ت في الكاسة`, `يلزم برستيج 1 (إنت في 0)`, `يلزم 4 مشاريع مستوى 35 (عندك 2/4)`, `يلزم 5 معلّمين مسيّرين (عندك 3)`).

## [v115] - 2026-10-26

### Fixed & Enhanced
- **Élimination de la troncature des critères sur la Carte** :
  - Suppression de la coupure artificielle `.slice(0, 24)` qui masquait la fin des conditions de déblocage (ex. pour Kairouan, la mention essentielle « 4 مشاريع مستوى 35 » était tronquée).
  - Taille de police adaptative proportionnelle à la longueur du texte.
- **Calibrage précis de la Hitbox de clic de la Carte** :
  - Alignement exact de la zone réactive tactile sur le bouton visuel de la popover (`cardX - 8, cardY + 48, 125x34 px`).
- **Apparition immédiate de la patrouille de Police (`دورية`)** :
  - Ajustement du point de spawn directement à côté du viewport de la caméra (`cameraX ± 60 px`) au lieu des extrémités éloignées du monde, réduisant le délai d'apparition de 10s à moins de 0.3s.
  - Vitesse portée à 240 px/s et prolongation de la sirène officielle à 2.5 secondes.

## [v114] - 2026-10-26

### Added & Enhanced
- **Feedback d'accès aux Villes (Toast cadenas & critères)** :
  - Sur la Carte vectorielle et dans les listes de villes, tout clic sur une ville verrouillée déclenche immédiatement un toast clair avec cadenas 🔒 et les critères exacts requis :
    - **سوسة (Sousse)** : `150,000 د.ت + برستيج 1`
    - **القيروان (Kairouan)** : `800,000 د.ت + 4 مشاريع مستوى 35`
    - **صفاقس (Sfax)** : `2,000,000 د.ت + برستيج 2`
    - Et tous les critères précis pour l'ensemble des 14 villes (Bizerte, Nabeul, Béja, Le Kef, Monastir, Sbeïtla, Gafsa, Tozeur, Gabès, Médenine, Djerba Holding).
- **Animation et Sirène de Patrouille de Police (`دورية`)** :
  - Synthèse audio WebAudio de la sirène officielle tunisienne à deux tons (`playPoliceSiren()`).
  - Déploiement en temps réel d'un véhicule de patrouille rapide de la police nationale avec gyrophare clignotant rouge/bleu traversant la rue.

## [v113] - 2026-10-26

### Fixed & Enhanced
- **Accès intérieur restreint aux projets achetés** :
  - Interdiction formelle d'entrer à l'intérieur d'un commerce ou de voir la simulation Canvas si `level === 0` (notification contextuelle : « لازم تشري المشروع قبل باش تنجم تدخل للمحلّ ! »).
  - Suppression de la hitbox de visite tactile sur les bâtiments et parasols non débloqués.
- **Orientation de la voiture sur la Carte de Tunisie** :
  - Élimination du retournement du véhicule (roues en l'air) lors des trajets Sud/Nord ou Est/Ouest grâce à un flip horizontal `scale(-1, 1)` et un angle d'inclinaison borné (voiture toujours les 4 roues sur la route).
- **Intérieur et Kiosque de Tabac** :
  - Ajout de la modale d'entrée au kiosque de tabac avec articles conformes (cigarettes 20 Mars/Cristal 4.5 DT, journaux 1.2 DT, bouteilles d'eau 0.8 DT) et pourboire.
  - Caissier rehaussé, montant LED dynamique sans débordement, icône superflue supprimée, étagères 100% compatibles par métier (librairie, marée, etc.).

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
