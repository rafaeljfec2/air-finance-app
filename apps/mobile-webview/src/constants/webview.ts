import { API_CONFIG } from '@air-finance/shared/constants';

// URL do app web (desenvolvimento ou produção)
export const WEBSITE_URL = __DEV__
  ? 'http://localhost:5173' // Vite dev server
  : 'https://app.airfinance.com.br';

export const USER_AGENT = 'AirFinanceMobile/1.0';

// Exportando também a config da API para uso futuro
export { API_CONFIG };
