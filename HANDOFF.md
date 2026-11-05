# HANDOFF - Tounes Tycoon
MAJ: 2026-11-05 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v134)
1. Afflux continu de clients résolu : correction du crash TypeError `getArchetype`, sécurisation du delta-temps `dt >= 0.001s`, et pré-remplissage immédiat à l'ouverture du projet (un client déjà servi au comptoir, un client qui franchit la porte, et spawner cadencé à 1.1s-1.9s).
2. Compatibilité 100% Postes/Employés : adaptation dynamique du nombre de bureaux (`agency_desks` jusqu'à 3 postes pour showroom, promoteur et tayaran), des caisses (`superette` jusqu'à 3 caisses), et intégration du poste technicien dans `salle_de_jeux`.
3. Banderole de capacité & fluidité : affichage clair de l'adéquation postes/cadres dans le menu employés (`x / y إطارات متطابقة 100% مع أماكن المشروع`), et flux continu de clients au guichet bancaire.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Modifs : `store_animator.js`, `index.html`, `HANDOFF.md`, `CHANGELOG.md`, `www/*`.
- Suite de tests : 70/70 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.
