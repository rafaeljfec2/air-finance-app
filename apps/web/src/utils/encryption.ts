/**
 * Encryption utilities for sensitive data in localStorage
 * Uses AES encryption via crypto-js
 */

import CryptoJS from 'crypto-js';

/**
 * Get encryption key from environment or generate a device-specific key
 * In production, this should come from a secure environment variable
 */
const getEncryptionKey = (): string => {
  // Try to get from environment variable first
  const envKey = import.meta.env.VITE_ENCRYPTION_KEY;
  if (envKey) {
    return envKey;
  }

  // Fallback: Use a device-specific key stored in sessionStorage
  // This is less secure but better than plain text
  const deviceKey = sessionStorage.getItem('device-encryption-key');
  if (deviceKey) {
    return deviceKey;
  }

  // Generate a new device key (not ideal, but better than nothing)
  const newKey = CryptoJS.lib.WordArray.random(256 / 8).toString();
  sessionStorage.setItem('device-encryption-key', newKey);
  return newKey;
};

/**
 * Encrypts a string using AES encryption
 */
export const encrypt = (data: string): string => {
  try {
    const key = getEncryptionKey();
    return CryptoJS.AES.encrypt(data, key).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    // Fallback: return data as-is if encryption fails (should not happen)
    return data;
  }
};

/**
 * Decrypts an encrypted string
 */
export const decrypt = (encryptedData: string): string => {
  try {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Decryption failed: empty result');
    }

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

/**
 * Encrypts an object by stringifying and encrypting
 */
export const encryptObject = <T>(data: T): string => {
  const jsonString = JSON.stringify(data);
  return encrypt(jsonString);
};

/**
 * Decrypts and parses an encrypted object
 */
export const decryptObject = <T>(encryptedData: string): T => {
  const decrypted = decrypt(encryptedData);
  return JSON.parse(decrypted) as T;
};
