import { useEffect } from 'react';

import { SEOHead } from '../landing/components/SEOHead';

import { CheckupPillarsV3 } from './components/CheckupPillarsV3';
import { CTAFinalV3 } from './components/CTAFinalV3';
import { FAQV3 } from './components/FAQV3';
import { FooterV3 } from './components/FooterV3';
import { HeaderV3 } from './components/HeaderV3';
import { HeroV3 } from './components/HeroV3';
import { InterpretSystemV3 } from './components/InterpretSystemV3';
import { PreviewDashboardV3 } from './components/PreviewDashboardV3';
import { PricingV3 } from './components/PricingV3';
import { ProblemV3 } from './components/ProblemV3';

import './landing-v3.css';

/**
 * Landing narrativa de capacidade (Product OS + UX02):
 * Hero → Problema → Interpretação → Check-up → Preview (no Hero) → CTA → Pricing/FAQ.
 */
export function LandingPageV3() {
  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    htmlElement.style.overflow = 'auto';
    htmlElement.style.height = 'auto';
    bodyElement.style.overflow = 'auto';
    bodyElement.style.height = 'auto';

    return () => {
      htmlElement.style.overflow = '';
      htmlElement.style.height = '';
      bodyElement.style.overflow = '';
      bodyElement.style.height = '';
    };
  }, []);

  return (
    <>
      <SEOHead />
      <div className="landing-v3-page w-full bg-white text-gray-900 antialiased">
        <HeaderV3 />
        <main className="relative w-full">
          <HeroV3 />
          <ProblemV3 />
          <InterpretSystemV3 />
          <CheckupPillarsV3 />
          <PreviewDashboardV3 />
          <CTAFinalV3 />
          <PricingV3 />
          <FAQV3 />
        </main>
        <FooterV3 />
      </div>
    </>
  );
}
