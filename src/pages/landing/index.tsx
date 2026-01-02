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
import { usePageScroll } from '@/hooks/usePageScroll';
import './landing.css';

export function LandingPage() {
  usePageScroll();

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
