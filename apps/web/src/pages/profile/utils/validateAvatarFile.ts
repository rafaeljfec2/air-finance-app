export const MAX_AVATAR_BYTES = 500 * 1024;

const ALLOWED_AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
    return 'Formato de imagem inválido. Use JPEG, PNG, WebP ou GIF.';
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return 'A imagem deve ter no máximo 500 KB.';
  }
  return null;
}

export function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.includes(',') ? (dataUrl.split(',')[1] ?? '') : dataUrl;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

export function validateAvatarDataUrl(dataUrl: string): string | null {
  if (!dataUrl.startsWith('data:image/')) {
    return null;
  }
  if (estimateDataUrlBytes(dataUrl) > MAX_AVATAR_BYTES) {
    return 'A imagem deve ter no máximo 500 KB.';
  }
  return null;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('Failed to read file'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
