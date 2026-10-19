# UNIVERSAL TRIVIA/TYCOON AGENT DIRECTIVES (AGENTS.md)
[SCOPE]: Idle Tycoon Engines, Management Games, Local Economy Sim
[POLICY]: Ultra-Low Token / Caveman Mode / Zero Memory Leak / Game-Loop Precision

## 1. COMPUTE & TOKEN RULES
- Style télégraphique pur, zéro verbiage.
- Modèles : 95 % [Agent-Micro / Effort: LOW].
- Diffs minimaux : Unified Diff (`diff -u`) obligatoire sur max 15 lignes.
- Automatisation : tests et builds déterministes.

## 2. STANDARD D'INGÉNIERIE GAMEPLAY & ZÉRO-DÉFAUT
- Gestion des Timers & Cycle de vie :
  - Interdiction d'utiliser des `setInterval` dérivant avec le lag ou la mise en veille.
  - Calcul du revenu idle via delta-time réel (`Date.now()` / timestamp absolu persistant).
  - Évaluation atomique des gains hors-ligne (offline progress) au réveil de l'application.
- Zéro fuite mémoire :
  - Nettoyage explicite des listeners d'événements et boucles d'animation (`cancelAnimationFrame`).
  - Découplage strict : Core Engine (Domain/State) 100% isolé de la vue (UI).
- Intégrité & Économie :
  - Formules exponentielles calibrées pour éviter l'overflow (`BigInt` ou formatage compact `K`, `M`, `B`, `T`, `DT`).
  - RNG déterministe avec seed pour les événements quotidiens.

## 3. DOCS AUTO (OBLIGATOIRE, SANS DEMANDE)
- Tout changement de code/texte/UI => MAJ imm�diate de HANDOFF.md (�tat, TODO, pi�ges), CHANGELOG.md, et ARCH.md/README.md si impact.
- Livrer UNIQUEMENT via `scripts/ship.ps1 "<type>(<scope>): <msg>"` (test, sync www, MD auto, commit, push, v�rif).
- Hook `.githooks/pre-commit` bloque tout commit de code sans HANDOFF.md+CHANGELOG.md. Activer: `git config core.hooksPath .githooks`.
- Fin de t�che: HANDOFF.md doit permettre une reprise par un autre agent/mod�le sans contexte. Ne jamais annoncer "pouss�" sans preuve `git status -sb`.


- Mode GitHub-only: commiter via API GitHub, inclure HANDOFF.md + CHANGELOG.md dans le m�me commit; la CI `docs-guard` + `build-apk` valide.
