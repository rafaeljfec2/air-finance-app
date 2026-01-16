# Air Finance Mobile (WebView)

App mobile do Air Finance usando Expo e React Native WebView.

## Funcionalidades

- Carrega o app web dentro de um WebView
- Intercepta e armazena tokens de autenticação
- Suporte para iOS e Android
- Desenvolvido com Expo para facilitar builds e deploys

## Scripts Disponíveis

- `yarn start` - Inicia o Expo Metro Bundler
- `yarn android` - Roda no emulador/dispositivo Android
- `yarn ios` - Roda no simulador/dispositivo iOS
- `yarn web` - Roda no navegador (para testes)
- `yarn lint` - Executa o linter
- `yarn type-check` - Verifica tipos TypeScript

## Configuração de Desenvolvimento

1. Certifique-se de que o app web está rodando em `http://localhost:5173`
2. Execute `yarn start`
3. Escaneie o QR code com o Expo Go (Android) ou Camera (iOS)

## Configuração de Produção

Atualize a URL em `src/constants/webview.ts`:

```typescript
export const WEBSITE_URL = 'https://app.airfinance.com.br';
```

## Estrutura

- `src/App.tsx` - Componente principal com WebView
- `src/components/` - Componentes reutilizáveis
- `src/hooks/` - Hooks customizados
- `src/constants/` - Constantes e configurações
- `assets/` - Ícones e imagens

## Comunicação com o Web App

O app mobile se comunica com o web app através de:

1. **postMessage**: Para enviar mensagens do web para o mobile
2. **injectedJavaScript**: Para injetar código no WebView
3. **Expo SecureStore**: Para armazenar tokens de forma segura

## Assets Necessários

Para publicar o app, você precisará criar os seguintes assets:

- `assets/icon.png` (1024x1024)
- `assets/splash.png` (1284x2778 para iOS, 1920x3840 para Android)
- `assets/adaptive-icon.png` (1024x1024)
- `assets/favicon.png` (48x48)

## Build para Produção

Para criar builds de produção, use o EAS Build:

```bash
# Configurar EAS
npx eas-cli login
npx eas build:configure

# Build para Android
yarn build:android

# Build para iOS
yarn build:ios
```
