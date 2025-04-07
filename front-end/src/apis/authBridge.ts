interface TokenBridge {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  saveTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
}

declare global {
  interface Window {
    TokenBridge?: TokenBridge;
  }
}

// 앱 환경인지 감지
const isAppEnvironment = typeof window !== 'undefined' && !!window.TokenBridge;

// localStorage 키 상수
const ACCESS_TOKEN_KEY = 'aicheck_access_token';
const REFRESH_TOKEN_KEY = 'aicheck_refresh_token';

class AuthBridge {
  getAccessToken(): string | null {
    if (isAppEnvironment) {
      return window.TokenBridge!.getAccessToken();
    } else {
      // 웹 환경에서는 localStorage 사용
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
  }

  getRefreshToken(): string | null {
    if (isAppEnvironment) {
      return window.TokenBridge!.getRefreshToken();
    } else {
      // 웹 환경에서는 localStorage 사용
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    if (isAppEnvironment) {
      window.TokenBridge!.saveTokens(accessToken, refreshToken);
    } else {
      // 웹 환경에서는 localStorage 사용
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  clearTokens(): void {
    if (isAppEnvironment) {
      window.TokenBridge!.clearTokens();
    } else {
      // 웹 환경에서는 localStorage 사용
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  // // localStorage 접근 오류에 대한 안전 처리 추가 메서드
  // private safeLocalStorage(operation: () => any): any {
  //   try {
  //     return operation();
  //   } catch (e) {
  //     console.error('localStorage 접근 오류:', e);
  //     return null;
  //   }
  // }
}

export const authBridge = new AuthBridge();

///////

// interface TokenBridge {
//   getAccessToken(): string | null;
//   getRefreshToken(): string | null;
//   saveTokens(accessToken: string, refreshToken: string): void;
//   clearTokens(): void;
// }

// declare global {
//   interface Window {
//     TokenBridge?: TokenBridge;
//   }
// }

// // 앱 환경인지 감지
// const isAppEnvironment = typeof window !== 'undefined' && !!window.TokenBridge;

// // localStorage 키 상수
// const ACCESS_TOKEN_KEY = 'aicheck_access_token';
// const REFRESH_TOKEN_KEY = 'aicheck_refresh_token';

// class AuthBridge {
//   getAccessToken(): string | null {
//     if (isAppEnvironment) {
//       return window.TokenBridge!.getAccessToken();
//     } else {
//       // 웹 환경에서는 localStorage 사용
//       return this.safeLocalStorageGet(ACCESS_TOKEN_KEY);
//     }
//   }

//   getRefreshToken(): string | null {
//     if (isAppEnvironment) {
//       return window.TokenBridge!.getRefreshToken();
//     } else {
//       return this.safeLocalStorageGet(REFRESH_TOKEN_KEY);
//     }
//   }

//   saveTokens(accessToken: string, refreshToken: string): void {
//     if (isAppEnvironment) {
//       window.TokenBridge!.saveTokens(accessToken, refreshToken);
//     } else {
//       this.safeLocalStorageSet(ACCESS_TOKEN_KEY, accessToken);
//       this.safeLocalStorageSet(REFRESH_TOKEN_KEY, refreshToken);
//     }
//   }

//   clearTokens(): void {
//     if (isAppEnvironment) {
//       window.TokenBridge!.clearTokens();
//     } else {
//       this.safeLocalStorageRemove(ACCESS_TOKEN_KEY);
//       this.safeLocalStorageRemove(REFRESH_TOKEN_KEY);
//     }
//   }

//   private safeLocalStorageGet(key: string): string | null {
//     try {
//       return localStorage.getItem(key);
//     } catch (e) {
//       console.error('localStorage 읽기 오류:', e);
//       return null;
//     }
//   }

//   private safeLocalStorageSet(key: string, value: string): boolean {
//     try {
//       localStorage.setItem(key, value);
//       return true;
//     } catch (e) {
//       console.error('localStorage 쓰기 오류:', e);
//       return false;
//     }
//   }

//   private safeLocalStorageRemove(key: string): boolean {
//     try {
//       localStorage.removeItem(key);
//       return true;
//     } catch (e) {
//       console.error('localStorage 삭제 오류:', e);
//       return false;
//     }
//   }
// }

// export const authBridge = new AuthBridge();

//이후 주석 풀고 위쪽 거 사용
