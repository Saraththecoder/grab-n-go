import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { attachMagneticEffect, gsap, prefersReducedMotion, ScrollTrigger } from '../utils/gsap';
import { buildWhatsAppOrderUrl } from '../data/brand';
import { AnimatedWords } from './AnimatedText';
import { useOrder } from '../context/OrderContext';

const HeroFoodScene = lazy(() =>
  import('./HeroFoodScene').then((m) => ({ default: m.HeroFoodScene })),
);

class SceneErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const primaryCtaRef = useRef<HTMLAnchorElement>(null);
  const visualWrapRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [webglReady, setWebglReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { feedback } = useOrder();

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    setWebglReady(detectWebGLSupport());
  }, []);

  useEffect(() => {
    const detachMagnetic = attachMagneticEffect(primaryCtaRef.current, 0.2);

    if (prefersReducedMotion()) {
      return () => {
        detachMagnetic();
      };
    }

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'transform',
      });

      if (visualWrapRef.current) {
        gsap.from(visualWrapRef.current, {
          scale: 0.96,
          opacity: 0,
          duration: 0.9,
          delay: 0.25,
          ease: 'power3.out',
          clearProps: 'transform',
        });
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => setScrollProgress(self.progress),
      });
    }, sectionRef);

    return () => {
      detachMagnetic();
      ctx.revert();
    };
  }, []);

  const quickWhatsAppUrl = buildWhatsAppOrderUrl(
    'Hi Grab N Go! I would like to pre-book food for pickup.',
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative overflow-hidden bg-white pt-28 pb-16 sm:pt-32 sm:pb-20"
    >
      <div className="mx-auto max-w-[1120px] px-5 text-center sm:px-8">
        <p className="hero-stagger text-[14px] font-medium tracking-[-0.01em] text-[#F26A05] sm:text-[15px]">
          Fast. Affordable. Hygienic.
        </p>

        <h1 className="mx-auto mt-3 max-w-[780px] font-display text-[clamp(2.75rem,6.4vw,4.75rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-[#1D1D1F]">
          <AnimatedWords
            text="Your break. Your food."
            triggerOnMount
            delay={1.35}
            stagger={0.07}
          />{' '}
          <AnimatedWords
            text="Your time."
            wordClassName="text-[#6E6E73]"
            triggerOnMount
            delay={1.65}
            stagger={0.07}
          />
        </h1>

        <p className="hero-stagger mx-auto mt-5 max-w-[540px] text-[17px] leading-[1.5] text-[#6E6E73] sm:text-[19px]">
          Fresh momos, bowls, wraps, and biryani pre-booked on WhatsApp. Pick up at your slot
          without standing in a queue.
        </p>

        <div className="hero-stagger mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            ref={primaryCtaRef}
            href="#menu"
            onClick={() => feedback('tap')}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F26A05] px-7 py-2.5 text-[15px] font-medium text-white transition-all duration-150 hover:bg-[#E85D04] active:scale-[0.95]"
          >
            Explore the Menu
          </a>

          <a
            href={quickWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => feedback('success')}
            className="inline-flex min-h-11 items-center gap-1 rounded-full px-5 py-2.5 text-[15px] font-medium text-[#159B55] transition-all duration-150 hover:bg-[#F5F5F7] active:scale-[0.95]"
          >
            <span>Order on WhatsApp</span>
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div
          ref={visualWrapRef}
          className="relative mx-auto mt-10 aspect-[16/10] w-full max-w-[820px] overflow-hidden rounded-[28px] bg-[#F5F5F7] sm:mt-12"
        >
          {webglReady ? (
            <SceneErrorBoundary
              fallback={
                <img
                  src="/images/steamed-momos.jpg"
                  alt="Steamed momos with spicy red dipping chutney"
                  className="h-full w-full object-cover"
                />
              }
            >
              <Suspense
                fallback={
                  <img
                    src="/images/steamed-momos.jpg"
                    alt="Steamed momos with spicy red dipping chutney"
                    className="h-full w-full object-cover"
                  />
                }
              >
                <HeroFoodScene scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
              </Suspense>
            </SceneErrorBoundary>
          ) : (
            <img
              src="/images/steamed-momos.jpg"
              alt="Steamed momos with spicy red dipping chutney"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <p className="mt-4 text-[12.5px] text-[#6E6E73]">
          Steamed &amp; Fried Momos from ₹40 · Interactive 3D plate
        </p>
      </div>
    </section>
  );
}
