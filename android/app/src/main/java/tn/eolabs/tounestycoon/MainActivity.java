package tn.eolabs.tounestycoon;

import android.os.Bundle;
import android.view.KeyEvent;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // 1. Interception native OnBackPressedDispatcher (Android 13+ et moderne)
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                dispatchBackToWeb();
            }
        });
    }

    // 2. Interception physique bas niveau KeyEvent (Bouton matériel retour et navigation bar classique)
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            dispatchBackToWeb();
            return true; // Bloque toute fermeture native de l'application
        }
        return super.onKeyDown(keyCode, event);
    }

    private void dispatchBackToWeb() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().post(new Runnable() {
                @Override
                public void run() {
                    getBridge().getWebView().evaluateJavascript(
                        "(function() { if (window.handleBackNavigation) { window.handleBackNavigation(); } else { document.dispatchEvent(new Event('backbutton')); } })();",
                        null
                    );
                }
            });
        }
    }
}
