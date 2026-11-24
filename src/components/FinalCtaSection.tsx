import { useEffect, useRef } from 'react';
import { ChevronRight, Mail, MessageCircle, Phone } from 'lucide-react';
import { attachMagneticEffect, gsap, prefersReducedMotion } from '../utils/gsap';
import { BRAND, buildWhatsAppOrderUrl } from '../data/brand';
import { useOrder } from '../context/OrderContext';
import { AnimatedWords } from './AnimatedText';

export function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const { totalCount, setDrawerOpen, feedback } = useOrder();

  useEffect(() => {
    const detachMagnetic = attachMagneticEffect(ctaRef.current, 0.2);

    if (prefersReducedMotion()) {
      return () => {
        detachMagnetic();
      };
    }

    const ctx = gsap.context(() => {
      gsap.from('.cta-apple', {
        y: 22,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);

    return () => {
      detachMagnetic();
      ctx.revert();
    };
  }, []);

  const directWhatsAppUrl = buildWhatsAppOrderUrl(
    'Hi Grab N Go! I want to place a pre-book order.',
  );

  return (
    <footer id="order-footer" ref={sectionRef} className="bg-white">
      {/* Apple-style Dark Spotlight CTA */}
      <div className="bg-[#1D1D1F] py-24 text-center text-white sm:py-32">
        <div className="mx-auto max-w-[780px] px-5 sm:px-8">
          <p className="cta-apple text-[14px] font-medium text-[#F26A05]">
            {BRAND.positioning}
          </p>

          <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.04em]">
            <AnimatedWords
              text="Skip the queue. Not the meal."
              highlightWords={['Not', 'the', 'meal.']}
              highlightClassName="text-[#A1A1A6]"
            />
          </h2>

          <p className="cta-apple mx-auto mt-5 max-w-[460px] text-[17px] leading-[1.5] text-[#A1A1A6]">
            Order on WhatsApp, confirm via UPI, and grab your meal fresh at break time.
          </p>

          <div className="cta-apple mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              ref={ctaRef}
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => feedback('success')}
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#159B55] px-7 py-3 text-[15px] font-medium text-white transition-all duration-150 hover:bg-[#118246] active:scale-[0.95]"
            >
              <MessageCircle className="h-4.5 w-4.5" />
              <span>Order on WhatsApp</span>
            </a>

            {totalCount > 0 ? (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex min-h-12 cursor-pointer items-center gap-1 rounded-full bg-[#F26A05] px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#E85D04]"
              >
                <span>Review Bag ({totalCount})</span>
              </button>
            ) : (
              <a
                href="#menu"
                className="inline-flex min-h-12 items-center gap-1 rounded-full px-5 py-3 text-[15px] font-medium text-[#F26A05] transition-colors hover:bg-white/5"
              >
                <span>Browse Menu</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Minimal Apple-style Footer Bar */}
      <div
        className={`bg-[#F5F5F7] pt-8 text-[#6E6E73] ${
          totalCount > 0 ? 'pb-24' : 'pb-8'
        }`}
      >
        <div className="mx-auto flex max-w-[1120px] flex-col justify-between gap-4 px-5 text-[12.5px] sm:flex-row sm:items-center sm:px-8">
          <div className="flex items-center gap-2 text-[#1D1D1F]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#1D1D1F] text-[10px] font-bold text-white">
              G
            </span>
            <span className="font-semibold">Grab N Go</span>
            <span className="text-[#6E6E73]">· {BRAND.tagline}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href={`tel:${BRAND.displayPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 text-[#1D1D1F] transition-colors hover:text-[#F26A05]"
            >
              <Phone className="h-3.5 w-3.5 text-[#F26A05]" />
              <span>{BRAND.displayPhone}</span>
            </a>

            <a
              href={`mailto:${BRAND.email}`}
              className="inline-flex items-center gap-1.5 text-[#1D1D1F] transition-colors hover:text-[#F26A05]"
            >
              <Mail className="h-3.5 w-3.5 text-[#F26A05]" />
              <span>{BRAND.email}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
