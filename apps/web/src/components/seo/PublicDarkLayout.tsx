import { useEffect, type ReactNode } from 'react';

import { FooterV3 } from '@/pages/landing-v3/components/FooterV3';
import { HeaderV3 } from '@/pages/landing-v3/components/HeaderV3';

import '@/pages/landing-v3/landing-v3.css';

interface PublicDarkLayoutProps {
  readonly children: ReactNode;
}

/**
 * Shared dark shell for public marketing / SEO / legal pages (aligned with landing-v3).
 */
export function PublicDarkLayout({ children }: PublicDarkLayoutProps) {
  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const hadDarkClass = htmlElement.classList.contains('dark');

    htmlElement.classList.add('dark');
    htmlElement.style.colorScheme = 'dark';
    htmlElement.style.overflow = 'auto';
    htmlElement.style.height = 'auto';
    bodyElement.style.overflow = 'auto';
    bodyElement.style.height = 'auto';
    bodyElement.style.backgroundColor = '#0b1120';

    return () => {
      if (!hadDarkClass) {
        htmlElement.classList.remove('dark');
      }
      htmlElement.style.colorScheme = '';
      htmlElement.style.overflow = '';
      htmlElement.style.height = '';
      bodyElement.style.overflow = '';
      bodyElement.style.height = '';
      bodyElement.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="landing-v3-page flex min-h-screen flex-col">
      <HeaderV3 />
      <div className="relative flex flex-1 flex-col pt-16">{children}</div>
      <FooterV3 />
    </div>
  );
}
