import { useState } from 'react';
import { OrderProvider } from './context/OrderContext';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { SolutionSection } from './components/SolutionSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { OrderDrawer } from './components/OrderDrawer';

export function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <OrderProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <div className="min-h-screen bg-white text-[#1D1D1F]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#1D1D1F] focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main-content">
          <Hero />
          <MenuSection />
          <HowItWorksSection />
          <SolutionSection />
        </main>

        <FinalCtaSection />
        <OrderDrawer />
      </div>
    </OrderProvider>
  );
}

export default App;
