/**
 * Tounes Tycoon - Service Publicités & Monétisation Google AdMob
 * © EOLabs 2026. Clean Architecture / Interface découplée.
 * Politique stricte : Toute accélération ou récompense bonus passe obligatoirement par une PUB.
 */

export class AdPolicy {
  /**
   * Interrupteur maître publicités (v152) :
   * false = packaging 100% SANS pubs — `showRewardedBoost()` accorde la récompense
   * immédiatement sans aucun affichage (pont AdMob natif ET lecteur intégré neutralisés).
   * Architecture prête : mettre `true` pour réactiver le funnel AdMob complet
   * (1. pont natif Capacitor AdMob -> 2. lecteur publicitaire intégré 3s avec barre de progression).
   */
  static ADS_ENABLED = false;
  // Boost x2 temporaire (4 heures)
  static BOOST_DURATION_MS = 4 * 60 * 60 * 1000;
  // Plafond de boost cumulable (max 24h)
  static MAX_BOOST_MS = 24 * 60 * 60 * 1000;
}

export class AdsService {
  constructor() {
    this.isReady = false;
    this.rewardedReady = true;
    this.isShowingAd = false;
  }

  async initialize() {
    this.isReady = true;
    return true;
  }

  /**
   * Affiche une publicité vidéo récompensée (AdMob natif ou lecteur publicitaire intégré).
   * Retourne true UNIQUEMENT si l'utilisateur regarde la publicité jusqu'au bout.
   */
  async showRewardedBoost(contextLabel = 'تيربو ومضاعفة الإنتاج ⚡') {
    if (this.isShowingAd) return false;

    // OFF (ADS_ENABLED = false) : zéro pub affichée — récompense accordée directement.
    // Tous les boutons "watched ?" du jeu reçoivent true et fonctionnent normalement.
    if (!AdPolicy.ADS_ENABLED) return true;

    // 1. Pont natif Capacitor AdMob si disponible sur Android
    if (typeof window !== 'undefined' && window.Capacitor?.Plugins?.AdMob?.showRewardVideoAd) {
      try {
        this.isShowingAd = true;
        await window.Capacitor.Plugins.AdMob.showRewardVideoAd();
        this.isShowingAd = false;
        return true;
      } catch (e) {
        this.isShowingAd = false;
        // Continue vers l'écran publicitaire intégré si le SDK natif n'est pas chargé
      }
    }

    // 2. Environnement Node.js (tests unitaires sans DOM)
    if (typeof document === 'undefined') {
      return true;
    }

    // 3. Lecteur publicitaire vidéo interactif obligatoire (3 secondes avec barre de progression)
    return new Promise((resolve) => {
      this.isShowingAd = true;
      let overlay = document.getElementById('rewardedAdOverlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'rewardedAdOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:20000;background:rgba(2,6,23,0.94);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:14px;direction:rtl;font-family:"Cairo",sans-serif;';
        document.body.appendChild(overlay);
      }

      const durationMs = 3200;
      const startTime = performance.now();
      let rafId = null;
      let finished = false;

      overlay.innerHTML = `
        <div style="background:linear-gradient(145deg,#0f172a 0%,#1e293b 100%);border:2px solid #f59e0b;border-radius:18px;max-width:420px;width:96%;padding:16px;box-shadow:0 20px 50px rgba(0,0,0,0.85);display:flex;flex-direction:column;gap:10px;text-align:right;color:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">
            <span style="background:rgba(245,158,11,0.2);border:1px solid #f59e0b;color:#fde047;font-size:10.5px;font-weight:900;padding:2px 8px;border-radius:6px;">🎬 إشهار مموّل • PUB</span>
            <span id="adTimerBadge" style="font-size:12px;font-weight:900;color:#38bdf8;">⏳ 3 ثواني...</span>
          </div>
          <div style="background:radial-gradient(circle at center,rgba(245,158,11,0.22),rgba(2,6,23,0.95));border:1px solid rgba(251,191,36,0.35);border-radius:12px;height:132px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;position:relative;overflow:hidden;padding:10px;text-align:center;">
            <div style="font-size:38px;filter:drop-shadow(0 4px 12px rgba(245,158,11,0.5));">🚀💰</div>
            <div style="font-size:14px;font-weight:900;color:#fef08a;">تونس تايكون • شبكة إعلانات الأعمال</div>
            <div style="font-size:11px;color:#cbd5e1;">تفرّج حتى النهاية لتفعيل : <b style="color:#34d399;">${contextLabel}</b></div>
          </div>
          <div style="width:100%;height:8px;background:rgba(255,255,255,0.1);border-radius:999px;overflow:hidden;border:1px solid rgba(255,255,255,0.12);">
            <div id="adProgressBarFill" style="width:0%;height:100%;background:linear-gradient(90deg,#f59e0b,#10b981);transition:width 0.08s linear;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:2px;">
            <span id="adStatusHint" style="font-size:10.5px;color:#94a3b8;font-weight:700;">لا تغلق الإشهار قبل انتهاء العداد للحصول على التسريع</span>
            <button id="adCancelSkipBtn" style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.45);color:#fca5a5;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:800;cursor:pointer;">إلغاء ✕</button>
          </div>
        </div>
      `;
      overlay.style.display = 'flex';

      const timerBadge = overlay.querySelector('#adTimerBadge');
      const progressFill = overlay.querySelector('#adProgressBarFill');
      const cancelBtn = overlay.querySelector('#adCancelSkipBtn');

      const cleanup = (granted) => {
        if (finished) return;
        finished = true;
        if (rafId) cancelAnimationFrame(rafId);
        overlay.style.display = 'none';
        this.isShowingAd = false;
        resolve(granted);
      };

      if (cancelBtn) {
        cancelBtn.onclick = () => cleanup(false);
      }

      const step = (now) => {
        if (finished) return;
        const elapsed = now - startTime;
        const pct = Math.min(100, (elapsed / durationMs) * 100);
        const remSec = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (timerBadge) {
          timerBadge.innerText = remSec > 0 ? `⏳ باقي ${remSec} ث...` : '✓ تمّ الإشهار !';
        }
        if (elapsed >= durationMs) {
          cleanup(true);
        } else {
          rafId = requestAnimationFrame(step);
        }
      };

      rafId = requestAnimationFrame(step);
    });
  }

  async showRewardedOfflineMultiplier() {
    return this.showRewardedBoost('مضاعفة مداخيل الغياب x2 💰');
  }
}

