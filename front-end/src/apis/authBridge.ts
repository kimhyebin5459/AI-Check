interface AndroidBridge {
  getAccessToken(): string; // accessToken과 refreshToken이 포함된 JSON 문자열 반환
  saveTokens(accessToken: string, refreshToken: string): void;
  clearAuthTokens?(): void; // 선택적 메서드 (안드로이드에 존재하지 않을 수 있음)
  getFcmToken?(): string; // FCM 토큰을 가져오는 메서드 추가
}

interface TokenBridge {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  saveTokens(accessToken: string, refreshToken: string): void;
  clearAuthTokens(): void;
  getFcmToken?(): string | null; // FCM 토큰을 가져오는 메서드 추가
}

interface AndroidBiometric {
  authenticate(): void;
}

declare global {
  interface Window {
    AndroidBridge?: AndroidBridge;
    AndroidBiometric?: AndroidBiometric;
    TokenBridge?: TokenBridge; // 하위 호환성을 위해 유지
  }
}

// localStorage 키
const ACCESS_TOKEN_KEY = 'aicheck_access_token';
const REFRESH_TOKEN_KEY = 'aicheck_refresh_token';
const FCM_TOKEN_KEY = 'fcmToken'; // FCM 토큰 키 추가

// 안드로이드 앱 환경인지 확인
const isAndroidApp = typeof window !== 'undefined' && !!window.AndroidBridge;
const isWebWithTokenBridge = typeof window !== 'undefined' && !!window.TokenBridge;

class AuthBridge {
  getAccessToken(): string | null {
    if (isAndroidApp) {
      try {
        // AndroidBridge에서 JSON 문자열 파싱
        const tokenData = JSON.parse(window.AndroidBridge!.getAccessToken());
        return tokenData.accessToken || null;
      } catch (e) {
        return null;
      }
    } else if (isWebWithTokenBridge) {
      return window.TokenBridge!.getAccessToken();
    } else {
      // 웹 환경에서는 localStorage 사용
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
  }

  getRefreshToken(): string | null {
    if (isAndroidApp) {
      try {
        // AndroidBridge에서 JSON 문자열 파싱
        const tokenData = JSON.parse(window.AndroidBridge!.getAccessToken());
        return tokenData.refreshToken || null;
      } catch (e) {
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

  clearAuthTokens(): void {
    if (isAndroidApp) {
      if (window.AndroidBridge!.clearAuthTokens) {
        window.AndroidBridge!.clearAuthTokens();
      } else {
        window.AndroidBridge!.saveTokens('', '');
      }
    } else if (isWebWithTokenBridge) {
      window.TokenBridge!.clearAuthTokens();
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  // FCM 토큰 가져오는 메서드 추가
  getFcmToken(): string | null {
    if (isAndroidApp) {
      try {
        // AndroidBridge에 getFcmToken 메서드가 있는지 확인
        if (window.AndroidBridge!.getFcmToken) {
          return window.AndroidBridge!.getFcmToken();
        }
        return null;
      } catch (e) {
        return null;
      }
    } else if (isWebWithTokenBridge) {
      // TokenBridge에 getFcmToken 메서드가 있는지 확인
      if (window.TokenBridge!.getFcmToken) {
        return window.TokenBridge!.getFcmToken();
      }
      return null;
    } else {
      // 웹 환경에서는 localStorage 사용
      return localStorage.getItem(FCM_TOKEN_KEY);
    }
  }

  // FCM 토큰 저장 메서드 추가
  saveFcmToken(fcmToken: string): void {
    if (!isAndroidApp && !isWebWithTokenBridge) {
      // 웹 환경에서만 localStorage에 저장
      localStorage.setItem(FCM_TOKEN_KEY, fcmToken);
    }
    // 안드로이드/TokenBridge 환경에서는 네이티브 쪽에서 직접 관리하므로 별도 저장 필요 없음
  }
}

export const authBridge = new AuthBridge();
