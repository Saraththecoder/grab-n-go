import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../utils/gsap';
import { HYGIENE_HIGHLIGHTS } from '../data/brand';
import { AnimatedWords } from './AnimatedText';

export function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from('.hygiene-apple', {
        y: 22,
        opacity: 0,
        duration: 0.7,
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
      id="hygiene"
      ref={sectionRef}
      className="bg-[#F5F5F7] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[28px] bg-white p-6 sm:p-10 lg:grid-cols-12 lg:p-12">
          <div className="hygiene-apple lg:col-span-6">
            <div className="aspect-[4/3] overflow-hidden rounded-[20px] bg-[#F5F5F7]">
              <img
                src="/images/hygiene-prep.jpg"
                alt="Clean kitchen prep counter with staff wearing hygienic caps and aprons"
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/steamed-momos.jpg';
                }}
              />
            </div>
          </div>

          <div className="hygiene-apple lg:col-span-6">
            <p className="text-[13px] font-medium text-[#159B55]">
              Hygienic Kitchen Standards
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1D1D1F]">
              <AnimatedWords text="Clean prep. Honest prices." />
            </h2>
            <p className="mt-3 text-[16px] leading-[1.55] text-[#6E6E73]">
              Every batch of momos, bowls, wraps, and biryani is cooked fresh ahead of break hours.
            </p>

            <ul className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {HYGIENE_HIGHLIGHTS.map((item) => (
                <li
                  key={item.label}
                  className="rounded-[16px] bg-[#F5F5F7] p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#159B55] text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-[14px] font-semibold text-[#1D1D1F]">
                      {item.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-[1.45] text-[#6E6E73]">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
