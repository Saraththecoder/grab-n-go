import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../utils/gsap';

interface AnimatedWordsProps {
  text: string;
  className?: string;
  wordClassName?: string;
  highlightWords?: string[];
  highlightClassName?: string;
  triggerOnMount?: boolean;
  delay?: number;
  stagger?: number;
}

/**
 * Splits text into masked words with smooth Apple-style upward reveal
 * while keeping full accessible text via aria-label.
 */
export function AnimatedWords({
  text,
  className = '',
  wordClassName = '',
  highlightWords = [],
  highlightClassName = 'text-[#6E6E73]',
  triggerOnMount = false,
  delay = 0,
  stagger = 0.055,
}: AnimatedWordsProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = rootRef.current!.querySelectorAll('.anim-word-inner');
      const vars: gsap.TweenVars = {
        yPercent: 115,
        opacity: 0,
        duration: 0.72,
        stagger,
        delay,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      };

      if (!triggerOnMount) {
        vars.scrollTrigger = {
          trigger: rootRef.current,
          start: 'top 86%',
          once: true,
        };
      }

      gsap.from(targets, vars);
    }, rootRef);

    return () => ctx.revert();
  }, [delay, stagger, triggerOnMount]);

  return (
    <span ref={rootRef} aria-label={text} className={className}>
      {words.map((word, idx) => {
        const cleanWord = word.replace(/[.,!?]/g, '');
        const isHighlighted =
          highlightWords.includes(word) || highlightWords.includes(cleanWord);

        return (
          <span key={`${word}-${idx}`} aria-hidden="true">
            <span className="inline-block overflow-hidden align-bottom">
              <span
                className={`anim-word-inner inline-block will-change-transform ${wordClassName} ${
                  isHighlighted ? highlightClassName : ''
                }`}
              >
                {word}
              </span>
            </span>
            {idx < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}
