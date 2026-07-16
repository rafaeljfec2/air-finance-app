import { useEffect } from 'react';

import { SEOHead } from '../landing/components/SEOHead';

import { ScrollProgress } from './components/animations';
import { CTAFinalV3 } from './components/CTAFinalV3';
import { FAQV3 } from './components/FAQV3';
import { FooterV3 } from './components/FooterV3';
import { HeaderV3 } from './components/HeaderV3';
import { HeroV3 } from './components/HeroV3';
import { HowItWorksV3 } from './components/HowItWorksV3';
import { InterpretSystemV3 } from './components/InterpretSystemV3';
import { ModelBehindV3 } from './components/ModelBehindV3';
import { NewMindsetV3 } from './components/NewMindsetV3';
import { PreviewDashboardV3 } from './components/PreviewDashboardV3';
import { PricingV3 } from './components/PricingV3';
import { ProblemV3 } from './components/ProblemV3';

import './landing-v3.css';

export function LandingPageV3() {
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
    <>
      <SEOHead />
      <div className="landing-v3-page w-full antialiased">
        <ScrollProgress />
        <HeaderV3 />
        <main className="relative w-full">
          <HeroV3 />
          <ProblemV3 />
          <NewMindsetV3 />
          <ModelBehindV3 />
          <InterpretSystemV3 />
          <PreviewDashboardV3 />
          <HowItWorksV3 />
          <CTAFinalV3 />
          <PricingV3 />
          <FAQV3 />
        </main>
        <FooterV3 />
      </div>
    </>
  );
}
