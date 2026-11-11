# GDD — Houma Hustle (Idle Tycoon Social PvP)

## Concept
Gère ton quartier tunisien (houma) : cafés, boulangeries, taxis, startups. Idle de base + merge + PvP asynchrone entre quartiers + partage vidéo viral.

## Core loop
1. Collecter revenus idle (delta-time réel, offline).
2. Merger 3 commerces identiques → commerce supérieur (x3 revenus).
3. Recruter staff → automatisation.
4. PvP : comparer revenus avec amis/quartiers, sabotage léger (couper électricité 30s).
5. Partager clip auto-généré (déblocage commerce) → acquisition.

## Systèmes
- **Commerces** : 20+ types (café, boulangerie, taxi, startup, hammam, pâtisserie…).
- **Merge** : 3→1, niveaux 1-5, skin évolutif.
- **Staff** : 1-3 postes par commerce, multiplicateur.
- **PvP asynchrone** : classement wilaya, duel 24h, récompense cosmétique.
- **Crews (guildes)** : 5-30 membres, bonus collectifs, chat.
- **Événements live** : météo, fêtes, grèves → multiplicateurs temporaires.
- **Cosmétiques UGC** : skins boutiques, revenue share créateurs.

## Monétisation (F2P éthique)
- Cosmétiques uniquement (pas pay-to-win).
- Boosts x2 4h via pub récompensée.
- Passe de saison (cosmétiques + badge + titre).
- Achat direct cosmétiques (pas de gacha).

## Rétention
- Idle offline (gains au réveil).
- PvP hebdo.
- Événements quotidiens (RNG déterministe seedé).
- UGC = contenu infini.

## Tech (réutilise Tounes Tycoon)
- Engine delta-time, BigInt/compact, RNG seedé.
- Canvas 60 FPS, audio bus master.
- Capacitor Android, www/ sync.

## MVP (4 semaines)
- Sem 1 : engine merge + 5 commerces + idle.
- Sem 2 : PvP asynchrone + classement.
- Sem 3 : cosmétiques + partage clip.
- Sem 4 : events live + polish + tests.

## KPI cibles
- D1 retention > 40%, D7 > 15%.
- ARPDAU > 0.05 $.
- Partage clip > 5% des sessions.
