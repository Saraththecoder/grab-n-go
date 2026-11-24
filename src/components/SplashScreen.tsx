import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../utils/gsap';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [exiting, setExiting] = useState(false);

  const dismiss = () => {
    if (exiting || !rootRef.current) return;
    setExiting(true);

    if (prefersReducedMotion()) {
      onComplete();
      return;
    }

    gsap.to(rootRef.current, {
      opacity: 0,
      y: -16,
      duration: 0.42,
      ease: 'power2.inOut',
      onComplete,
    });
  };

  useEffect(() => {
    if (prefersReducedMotion()) {
      const timer = window.setTimeout(() => {
        onComplete();
      }, 950);
      return () => window.clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          dismiss();
        },
      });

      tl.from('.splash-logo', {
        scale: 0.86,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out',
      })
        .from(
          '.splash-word',
          {
            yPercent: 115,
            opacity: 0,
            duration: 0.52,
            stagger: 0.045,
            ease: 'power3.out',
          },
          '-=0.15',
        )
        .fromTo(
          barRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          '-=0.25',
        );
    }, rootRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hookWords = ['Skip', 'the', 'queue,', 'not', 'the', 'meal.'];

  return (
    <div
      ref={rootRef}
      data-splash="true"
      role="status"
      aria-label="Grab N Go — Skip the queue, not the meal."
      onClick={dismiss}
      className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-[#1D1D1F] px-6 text-center text-white"
    >
      <div className="splash-logo flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[15px] font-bold text-[#1D1D1F]">
          G
        </span>
        <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-white/90">
          Grab N Go
        </span>
      </div>

      <p className="mt-6 max-w-[680px] font-display text-[clamp(1.65rem,4.4vw,3rem)] font-semibold leading-[1.12] tracking-[-0.035em] text-white">
        {hookWords.map((word, idx) => (
          <span key={`${word}-${idx}`}>
            <span className="inline-block overflow-hidden align-bottom">
              <span
                className={`splash-word inline-block ${
                  idx >= 3 ? 'text-[#F26A05]' : 'text-white'
                }`}
              >
                {word}
              </span>
            </span>
            {idx < hookWords.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>

      <div className="mt-8 h-[2px] w-36 overflow-hidden rounded-full bg-white/15">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-[#F26A05]"
        />
      </div>
    </div>
  );
}
