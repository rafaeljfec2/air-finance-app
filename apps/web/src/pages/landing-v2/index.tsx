import { useEffect } from 'react';
import { HeaderV2 } from './components/HeaderV2';
import { HeroV2 } from './components/HeroV2';
import { FeaturesV2 } from './components/FeaturesV2';
import { PricingV2 } from './components/PricingV2';
import { ContactV2 } from './components/ContactV2';
import { CTAV2 } from './components/CTAV2';
import { FooterV2 } from './components/FooterV2';
import { SEOHead } from '../landing/components/SEOHead';
import './landing-v2.css';

export function LandingPageV2() {
  useEffect(() => {
    // Enable scroll on landing page
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    htmlElement.style.overflow = 'auto';
    htmlElement.style.height = 'auto';
    bodyElement.style.overflow = 'auto';
    bodyElement.style.height = 'auto';

    return () => {
      // Restore original styles on unmount
      htmlElement.style.overflow = '';
      htmlElement.style.height = '';
      bodyElement.style.overflow = '';
      bodyElement.style.height = '';
    };
  }, []);

  return (
    <>
      <SEOHead />
      <div className="landing-v2-page w-full bg-gray-50 text-gray-900 antialiased">
        <HeaderV2 />
        <main className="relative w-full">
          <HeroV2 />
          <FeaturesV2 />
          <PricingV2 />
          <CTAV2 />
          <ContactV2 />
        </main>
        <FooterV2 />
      </div>
    </>
  );
}
