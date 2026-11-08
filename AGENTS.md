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
- Tout changement de code/texte/UI => MAJ immédiate de HANDOFF.md (état, TODO, pièges), CHANGELOG.md, et ARCH.md/README.md si impact.
- Livrer UNIQUEMENT via `scripts/ship.ps1 "<type>(<scope>): <msg>"` (test, sync www, MD auto, commit, push, vérif).
- Hook `.githooks/pre-commit` bloque tout commit de code sans HANDOFF.md+CHANGELOG.md. Activer: `git config core.hooksPath .githooks`.
- Fin de tâche: HANDOFF.md doit permettre une reprise par un autre agent/modèle sans contexte. Ne jamais annoncer "poussé" sans preuve `git status -sb`.

- Mode GitHub-only: commiter via API GitHub, inclure HANDOFF.md + CHANGELOG.md dans le même commit; la CI `docs-guard` + `build-apk` valide.

## 4. AUTONOMIE
- Autorisation PERMANENTE de modifier code/textes/docs, commiter et pousser sans demander. Ne pas poser de questions de confirmation. Stop uniquement si action destructive/irréversible ou demande réellement ambiguë.

## 5. RÈGLE CRITIQUE : ZÉRO ÉCRAN BLANC & VALIDATION SYSTÉMATIQUE DU CHARGEMENT
- **Interdiction formelle de régression sur le chargement (Zero Blank Screen)** :
  - Tout ajout ou modification dans `store_animator.js`, `engine.js`, `index.html`, `audio.js`, `ads_service.js` DOIT valider `index_loading.test.js` et `node scripts/test_index_html.mjs`.
  - Aucune livraison (`ship.ps1`) n'est autorisée si l'exécution de `index.html` en VM sandbox échoue ou si un module présente une erreur de syntaxe ou un import non résolu.
  - Les finders d'événements et objets globaux doivent être protégés par `typeof window !== 'undefined'` pour éviter tout plantage en environnement headless ou test runner.

