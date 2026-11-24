import type { HygieneHighlight, WorkflowStep } from '../types';

export const BRAND = {
  name: 'Grab N Go',
  tagline: 'Skip the queue, not the meal.',
  positioning: 'Fast. Affordable. Hygienic.',
  whatsappNumber: '918431339638',
  displayPhone: '+91 84313 39638',
  email: 'likithashree2311@gmail.com',
} as const;

export const PICKUP_SLOTS = [
  '10:30 AM Break',
  '12:30 PM Lunch',
  '1:15 PM Lunch',
  '3:30 PM Break',
  '4:30 PM Evening',
] as const;

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: '01',
    title: 'Pick your meal',
    description: 'Choose momos, bowls, wraps, biryani, or combos right on the menu.',
    detailLabel: 'Menu',
    detailValue: 'Fresh campus batches',
  },
  {
    step: '02',
    title: 'Send on WhatsApp',
    description: 'Tap Order on WhatsApp to send your pre-filled order to our kitchen.',
    detailLabel: 'WhatsApp',
    detailValue: '+91 84313 39638',
  },
  {
    step: '03',
    title: 'Pay via UPI',
    description: 'Confirm your pickup slot by paying through UPI—zero cash counter wait.',
    detailLabel: 'Slot Token',
    detailValue: 'Confirmed on chat',
  },
  {
    step: '04',
    title: 'Grab & go',
    description: 'Walk straight to the pickup counter at your break time and collect fresh.',
    detailLabel: 'Pickup',
    detailValue: 'Zero queue',
  },
];

export const HYGIENE_HIGHLIGHTS: HygieneHighlight[] = [
  {
    label: 'Food-grade gloves',
    detail: 'Gloved handling across every steaming, wrapping, and packing station.',
  },
  {
    label: 'Hygienic chef caps',
    detail: 'Clean kitchen attire and full hair coverage maintained throughout prep.',
  },
  {
    label: 'Covered food prep',
    detail: 'Sealed stainless-steel holding trays keep batches hot and protected.',
  },
  {
    label: 'Fresh per break',
    detail: 'Steamed and assembled ahead of break hours so your food is never sitting stale.',
  },
];

export function buildWhatsAppOrderUrl(message: string): string {
  return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
