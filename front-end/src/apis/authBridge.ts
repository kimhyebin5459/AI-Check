interface AndroidBridge {
  getAccessToken(): string; // Returns JSON string with accessToken and refreshToken
  saveTokens(accessToken: string, refreshToken: string): void;
  clearTokens?(): void; // Optional method that may not exist in Android
}

interface TokenBridge {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  saveTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
}

interface AndroidBiometric {
  authenticate(): void;
}

declare global {
  interface Window {
    AndroidBridge?: AndroidBridge;
    AndroidBiometric?: AndroidBiometric;
    TokenBridge?: TokenBridge; // Keep for backward compatibility
  }
}

// localStorage keys
const ACCESS_TOKEN_KEY = 'aicheck_access_token';
const REFRESH_TOKEN_KEY = 'aicheck_refresh_token';

// Check if we're in the Android app environment
const isAndroidApp = typeof window !== 'undefined' && !!window.AndroidBridge;
const isWebWithTokenBridge = typeof window !== 'undefined' && !!window.TokenBridge;

class AuthBridge {
  getAccessToken(): string | null {
    if (isAndroidApp) {
      try {
        // Parse the JSON string from AndroidBridge
        const tokenData = JSON.parse(window.AndroidBridge!.getAccessToken());
        return tokenData.accessToken || null;
      } catch (e) {
        console.error('Error parsing token data:', e);
        return null;
      }
    } else if (isWebWithTokenBridge) {
      return window.TokenBridge!.getAccessToken();
    } else {
      // Web environment uses localStorage
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
  }

  getRefreshToken(): string | null {
    if (isAndroidApp) {
      try {
        // Parse the JSON string from AndroidBridge
        const tokenData = JSON.parse(window.AndroidBridge!.getAccessToken());
        return tokenData.refreshToken || null;
      } catch (e) {
        console.error('Error parsing token data:', e);
        return null;
      }
    } else if (isWebWithTokenBridge) {
      return window.TokenBridge!.getRefreshToken();
    } else {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    if (isAndroidApp) {
      window.AndroidBridge!.saveTokens(accessToken, refreshToken);
    } else if (isWebWithTokenBridge) {
      window.TokenBridge!.saveTokens(accessToken, refreshToken);
    } else {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  clearTokens(): void {
    if (isAndroidApp) {
      // Check if clearTokens exists in AndroidBridge
      if (window.AndroidBridge!.clearTokens) {
        window.AndroidBridge!.clearTokens();
      } else {
        // Fallback: save empty tokens
        window.AndroidBridge!.saveTokens('', '');
      }
    } else if (isWebWithTokenBridge) {
      window.TokenBridge!.clearTokens();
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  // Method to request biometric authentication
  requestBiometricAuth(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.AndroidBiometric) {
        try {
          window.AndroidBiometric.authenticate();
          // Note: This doesn't actually wait for authentication result
          // You'll need a callback mechanism from Android
          resolve(true);
        } catch (e) {
          console.error('Biometric authentication error:', e);
          resolve(false);
        }
      } else {
        console.warn('Biometric authentication not available');
        resolve(false);
      }
    });
  }
}

export const authBridge = new AuthBridge();
