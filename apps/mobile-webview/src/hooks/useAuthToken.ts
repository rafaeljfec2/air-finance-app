import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@air-finance/shared/constants';

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  // Script para injetar token no WebView
  const initialScript = `
    (function() {
      window.MOBILE_APP = true;
      window.postMessage = window.ReactNativeWebView?.postMessage || window.postMessage;
      
      // Interceptar login para salvar token
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        return originalFetch(...args).then(response => {
          const token = response.headers.get('Authorization');
          if (token) {
            window.ReactNativeWebView?.postMessage(JSON.stringify({
              type: 'AUTH_TOKEN',
              token: token
            }));
          }
          return response;
        });
      };
    })();
    true;
  `;

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'AUTH_TOKEN') {
        await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, data.token);
        setToken(data.token);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  return { initialScript, handleMessage, token };
}
