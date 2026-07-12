import {
  MAX_AVATAR_BYTES,
  estimateDataUrlBytes,
  validateAvatarDataUrl,
  validateAvatarFile,
} from './validateAvatarFile';

describe('validateAvatarFile', () => {
  it('rejects non-image mime types', () => {
    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    expect(validateAvatarFile(file)).toMatch(/formato/i);
  });

  it('rejects files larger than 500KB', () => {
    const file = {
      type: 'image/png',
      size: MAX_AVATAR_BYTES + 1,
    } as File;
    expect(validateAvatarFile(file)).toMatch(/500/);
  });

  it('accepts valid image under size limit', () => {
    const file = new File(['tiny'], 'ok.webp', { type: 'image/webp' });
    expect(validateAvatarFile(file)).toBeNull();
  });
});

describe('estimateDataUrlBytes / validateAvatarDataUrl', () => {
  it('estimates decoded size from base64 payload', () => {
    const dataUrl = `data:image/png;base64,${'a'.repeat(8)}`;
    expect(estimateDataUrlBytes(dataUrl)).toBe(6);
  });

  it('rejects oversized data URLs', () => {
    const oversized = `data:image/png;base64,${'a'.repeat(700_000)}`;
    expect(validateAvatarDataUrl(oversized)).toMatch(/500/);
  });

  it('allows http(s) avatar URLs without data-url size check', () => {
    expect(validateAvatarDataUrl('https://cdn.example/a.png')).toBeNull();
  });
});
