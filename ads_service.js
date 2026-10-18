/**
 * Tounes Tycoon - Service Publicités & Monétisation Google AdMob
 * © EOLabs 2026. Clean Architecture / Interface découplée.
 */

export class AdPolicy {
  // Boost x2 temporaire (ex: 4 heures dans un Idle game)
  static BOOST_DURATION_MS = 4 * 60 * 60 * 1000;
  // Plafond de boost cumulable (max 24h)
  static MAX_BOOST_MS = 24 * 60 * 60 * 1000;
}

export class AdsService {
  constructor() {
    this.isReady = false;
    this.rewardedReady = true; // Prêt par défaut / simulable
  }

  async initialize() {
    // Initialisation Google Mobile Ads SDK (AdMob)
    // Mode offline-friendly / fallback sans crash si pas de réseau
    this.isReady = true;
    return true;
  }

  async showRewardedBoost() {
    // Dans l'app Android finale : appel au pont natif AdMob RewardedVideo.
    // Dans le prototype : simulation immédiate ou via modal.
    return new Promise((resolve) => {
      // Simule la complétion de la pub récompensée
      resolve(true);
    });
  }

  async showRewardedOfflineMultiplier() {
    // Vidéo pour doubler les gains engrangés pendant l'absence
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}
