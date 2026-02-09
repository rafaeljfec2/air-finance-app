import { useEffect } from 'react';
import { HeaderV3 } from './components/HeaderV3';
import { HeroV3 } from './components/HeroV3';
import { SocialProofV3 } from './components/SocialProofV3';
import { ProblemV3 } from './components/ProblemV3';
import { SolutionV3 } from './components/SolutionV3';
import { FeaturesV3 } from './components/FeaturesV3';
import { HowItWorksV3 } from './components/HowItWorksV3';
import { ComparisonV3 } from './components/ComparisonV3';
import { TestimonialsV3 } from './components/TestimonialsV3';
import { PricingV3 } from './components/PricingV3';
import { FAQV3 } from './components/FAQV3';
import { CTAFinalV3 } from './components/CTAFinalV3';
import { FooterV3 } from './components/FooterV3';
import { SEOHead } from '../landing/components/SEOHead';
import './landing-v3.css';

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
          <SocialProofV3 />
          <ProblemV3 />
          <SolutionV3 />
          <FeaturesV3 />
          <HowItWorksV3 />
          <ComparisonV3 />
          <TestimonialsV3 />
          <PricingV3 />
          <FAQV3 />
          <CTAFinalV3 />
        </main>
        <FooterV3 />
      </div>
    </>
  );
}
