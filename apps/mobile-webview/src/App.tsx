import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { WEBSITE_URL, USER_AGENT } from './constants/webview';
import { useAuthToken } from './hooks/useAuthToken';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const { initialScript, handleMessage } = useAuthToken();
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <WebView
        ref={webViewRef}
        source={{ uri: WEBSITE_URL }}
        style={styles.webview}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded={initialScript}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        pullToRefreshEnabled={true}
        userAgent={USER_AGENT}
      />

      {isLoading && <LoadingScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
});
