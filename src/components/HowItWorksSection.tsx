import { useEffect, useRef } from 'react';
import { CheckCircle2, MessageCircle, QrCode, Utensils } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../utils/gsap';
import { WORKFLOW_STEPS } from '../data/brand';
import { AnimatedWords } from './AnimatedText';

const STEP_ICONS = [Utensils, MessageCircle, QrCode, CheckCircle2];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from('.apple-step', {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="text-center">
          <h2 className="font-display text-[clamp(2.1rem,4.5vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#1D1D1F]">
            <AnimatedWords text="Four steps. Zero queue." />
          </h2>
          <p className="mx-auto mt-3 max-w-[460px] text-[17px] leading-[1.5] text-[#6E6E73]">
            Pre-book before the break bell and pick up fresh.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((item, idx) => {
            const Icon = STEP_ICONS[idx];
            return (
              <div
                key={item.step}
                className="apple-step flex flex-col justify-between rounded-[24px] bg-[#F5F5F7] p-7"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                      <Icon className="h-4.5 w-4.5 text-[#F26A05]" />
                    </span>
                    <span className="text-[13px] font-semibold text-[#6E6E73] tabular-nums">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-[20px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-[1.55] text-[#6E6E73]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
