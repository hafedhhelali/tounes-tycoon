# HANDOFF — Tounes Tycoon
MAJ: 2026-11-04T17:08:00.000Z - etat = HEAD de main (v119-archetype-customer-gameplay-billiard-kahwa-yachts)

## État en 3 lignes
Machine à États Client & Scènes Intérieures par Archétype Métier (`getBizArchetype` v119) :
1. `salle_de_jeux` (`arcade_billiard`) : Les clients entrent pour JOUER sur une grande Table de Billard 2.5D animée (billes roulantes + queue de billard en mouvement) ou sur console PS5 (`🎮`/`🎱`), ont une jauge de partie en cours, puis passent payer à la caisse et repartent les mains libres (`hasBag = false`).
2. `kahwa` / `salon_de_the` (`kahwa_counter`) : Jusqu'à 5 clients simultanés alignés sur les tabourets du comptoir (`maxActive = 5`), lèvent leur tasse de café/thé à la menthe pour boire par gorgées fumantes (`☕`/`🍵`), paient et sortent sans sac.
3. `croisiere_mer` / `agence_voyages` / `hotel` / `showroom_auto` / `tayaran_el_ghzela` / `promoteur_immobilier` / `taxi_collectif` (`booking_service`) : Zéro marchandise ni tapis roulant ! Bassin lumineux avec Maquette de Yacht naviguant + cordon VIP rouge/or ; les clients consultent, réservent leur croisière/contrat au guichet VIP (`حجز VIP 🎫`) et repartent avec leur billet/clé (`⚓`/`🎫`/`🔑`) sans aucun sac d'épicerie.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Modifs : `store_animator.js`, `index.html`, `www/*`.
- Suite de tests : 68/68 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.
