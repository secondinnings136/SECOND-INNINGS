/**
 * Cashfree Client-Side Checkout Helper (v3 SDK)
 * Dynamically loads the official Cashfree JS SDK for seamless in-page checkout.
 */

let cashfreeSdkPromise = null;

export function loadCashfreeSDK() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.Cashfree) return Promise.resolve(window.Cashfree);

  if (!cashfreeSdkPromise) {
    cashfreeSdkPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.Cashfree));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      script.onload = () => {
        if (window.Cashfree) {
          resolve(window.Cashfree);
        } else {
          reject(new Error('Cashfree SDK loaded but window.Cashfree is undefined'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load Cashfree checkout SDK. Please check your internet connection.'));
      };
      document.head.appendChild(script);
    });
  }

  return cashfreeSdkPromise;
}

/**
 * Launch Cashfree Payment Checkout
 * @param {string} paymentSessionId - Cashfree payment session ID from backend
 * @param {string} [mode='production'] - 'production' or 'sandbox'
 * @param {string} [redirectTarget='_modal'] - '_modal' (popup) or '_self' (page redirect)
 */
export async function launchCashfreeCheckout({
  paymentSessionId,
  mode = 'production',
  redirectTarget = '_modal'
}) {
  const Cashfree = await loadCashfreeSDK();
  if (!Cashfree) {
    throw new Error('Cashfree SDK is not available');
  }

  const cashfreeInstance = Cashfree({
    mode: mode.toLowerCase() === 'production' ? 'production' : 'sandbox'
  });

  return new Promise((resolve) => {
    cashfreeInstance.checkout({
      paymentSessionId,
      redirectTarget
    }).then((result) => {
      resolve(result);
    }).catch((err) => {
      resolve({ error: err });
    });
  });
}
