// API Configuration - Shared between web and mobile

export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_URL || "http://localhost:3011",
  PREFIX: "/meu-financeiro/v1",
  TIMEOUT: 30000,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "@air-finance:auth_token",
  USER_DATA: "@air-finance:user_data",
  ACTIVE_COMPANY: "@air-finance:active_company",
  REFRESH_TOKEN: "@air-finance:refresh_token",
} as const;

export const APP_CONFIG = {
  NAME: "Air Finance",
  VERSION: "1.0.0",
  DESCRIPTION: "Gestão financeira inteligente",
} as const;
