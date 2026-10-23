package tn.eolabs.tounestycoon;

import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Interception native absolue du bouton retour matériel Android pour empêcher la fermeture brusque
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                // Notifie le WebView / JS pour ouvrir la modale de confirmation ou fermer la vue active
                if (getBridge() != null && getBridge().getWebView() != null) {
                    getBridge().getWebView().evaluateJavascript(
                        "window.handleBackNavigation ? window.handleBackNavigation() : document.dispatchEvent(new Event('backbutton'));",
                        null
                    );
                }
            }
        });
    }
}
