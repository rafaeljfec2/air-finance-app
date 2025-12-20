import { useEffect } from 'react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { CTASection } from './components/CTASection';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PricingSection } from './components/PricingSection';
import { SecuritySection } from './components/SecuritySection';
import { SEOHead } from './components/SEOHead';
import { TestimonialsSection } from './components/TestimonialsSection';
import './landing.css';

export function LandingPage() {
  useEffect(() => {
    // Enable scrolling for landing page
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';

    return () => {
      // Restore default overflow when leaving landing page
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <SEOHead />
      <div className="landing-page min-h-screen bg-gradient-to-br from-background to-white text-text relative">
        <AnimatedBackground />
        <Header />
        <main className="relative z-10">
          <HeroSection />
          <FeaturesSection />
          <SecuritySection />
          <TestimonialsSection />
          <PricingSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
