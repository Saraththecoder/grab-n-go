import type { ComboDeal, MenuCategory, MenuItem } from '../types';

export const MENU_CATEGORIES: MenuCategory[] = [
  'All',
  'Momos',
  'Bowls',
  'Wraps',
  'Soups',
  'Drinks',
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'steamed-momos',
    name: 'Steamed Momos',
    category: 'Momos',
    filterLabel: 'Momos · Signature',
    priceRange: '₹40–80',
    servingNote: '6 pcs',
    description:
      'Hand-pleated dumplings steamed fresh in covered batches, served hot with house red chili-garlic chutney.',
    imageUrl: '/images/steamed-momos.jpg',
    imageAlt: 'Six steamed momos arranged on a ceramic plate with spicy red dipping chutney',
    highlight: 'Best Seller',
    variants: [
      { id: 'veg-steamed', label: 'Veg', price: 50 },
      { id: 'paneer-steamed', label: 'Paneer', price: 70 },
      { id: 'chicken-steamed', label: 'Chicken', price: 80 },
    ],
  },
  {
    id: 'fried-momos',
    name: 'Crispy Fried Momos',
    category: 'Momos',
    filterLabel: 'Momos · Crunch',
    priceRange: '₹40–80',
    servingNote: '6 pcs',
    description:
      'Golden-crisp outside, juicy seasoned filling inside—served piping hot with bold chili-garlic dip.',
    imageUrl: '/images/fried-momos.jpg',
    imageAlt: 'Golden crispy fried momos plated with spiced dipping sauce',
    variants: [
      { id: 'veg-fried', label: 'Veg', price: 60 },
      { id: 'chicken-fried', label: 'Chicken', price: 80 },
    ],
  },
  {
    id: 'soup-momos',
    name: 'Soup Momos',
    category: 'Momos',
    filterLabel: 'Momos · Hot Broth',
    priceRange: '₹70–80',
    servingNote: 'Hot bowl',
    description:
      'Steamed momos steeped in an aromatic spiced clear vegetable broth finished with herbs and chili oil.',
    imageUrl: '/images/soup-momos.jpg',
    imageAlt: 'Steaming bowl of soup momos in spiced golden broth',
    highlight: 'Campus Favorite',
    variants: [
      { id: 'veg-soup-momo', label: 'Veg', price: 70 },
      { id: 'chicken-soup-momo', label: 'Chicken', price: 80 },
    ],
  },
  {
    id: 'healthy-bowls',
    name: 'Healthy Bowls',
    category: 'Bowls',
    filterLabel: 'Bowls · Balanced',
    priceRange: '₹80–110',
    servingNote: 'Full meal',
    description:
      'Wholesome grain and protein bowls layered with crisp greens, sweet corn, roasted veggies, and herb dressing.',
    imageUrl: '/images/healthy-bowl.jpg',
    imageAlt: 'Vibrant healthy grain and vegetable protein bowl with greens',
    variants: [
      { id: 'veg-bowl', label: 'Veg Bowl', price: 80 },
      { id: 'chicken-bowl', label: 'Chicken Bowl', price: 110 },
    ],
  },
  {
    id: 'biryani-prebook',
    name: 'Biryani (Pre-book)',
    category: 'Bowls',
    filterLabel: 'Pre-book Special',
    priceRange: '₹90–120',
    servingNote: 'Pre-book slot',
    description:
      'Fragrant saffron-kissed basmati biryani layered with spices, caramelized onions, mint, and cool raita.',
    imageUrl: '/images/biryani-prebook.jpg',
    imageAlt: 'Bowl of aromatic saffron chicken biryani with caramelized onions and raita',
    highlight: 'Pre-book on WhatsApp',
    variants: [
      { id: 'veg-biryani', label: 'Veg', price: 90 },
      { id: 'chicken-biryani', label: 'Chicken', price: 120 },
    ],
  },
  {
    id: 'healthy-wraps',
    name: 'Healthy Wraps',
    category: 'Wraps',
    filterLabel: 'Wraps · Grab & Walk',
    priceRange: '₹60–90',
    servingNote: 'Fresh roll',
    description:
      'Warm toasted wraps packed with crunchy slaw, spiced paneer or grilled chicken, and cooling mint dressing.',
    imageUrl: '/images/fresh-wraps.jpg',
    imageAlt: 'Freshly toasted tortilla wrap sliced to show greens and protein filling',
    variants: [
      { id: 'veg-wrap', label: 'Veg / Paneer', price: 70 },
      { id: 'chicken-wrap', label: 'Chicken', price: 90 },
    ],
  },
  {
    id: 'healthy-soups',
    name: 'Healthy Soups',
    category: 'Soups',
    filterLabel: 'Soups · Light',
    priceRange: '₹40–50',
    servingNote: 'Hot cup',
    description:
      'Light, comforting clear vegetable and sweet-corn herb soup prepared fresh for quick mid-day nourishment.',
    imageUrl: '/images/healthy-soup.jpg',
    imageAlt: 'Steaming clear vegetable herb soup in a stoneware bowl',
    variants: [
      { id: 'veg-clear-soup', label: 'Veg Herb', price: 40 },
      { id: 'sweet-corn-soup', label: 'Sweet Corn', price: 50 },
    ],
  },
  {
    id: 'drinks',
    name: 'Drinks',
    category: 'Drinks',
    filterLabel: 'Drinks · Chilled',
    priceRange: '₹20–50',
    servingNote: 'Chilled cup',
    description:
      'Ice-cold mint-lime coolers and chilled campus café beverages poured fresh for quick break pickup.',
    imageUrl: '/images/cold-drinks.jpg',
    imageAlt: 'Chilled mint-lemon cooler beverage with ice and fresh mint leaves',
    variants: [
      { id: 'mint-lime', label: 'Mint Lime', price: 30 },
      { id: 'cold-coffee', label: 'Cold Coffee', price: 50 },
    ],
  },
];

export const COMBO_DEALS: ComboDeal[] = [
  {
    id: 'combo-momos-drink',
    title: 'Momos + Drink',
    price: 70,
    formattedPrice: '₹70',
    items: '6 pcs Momos + Chilled Drink',
    note: 'Most popular quick-break pairing',
    imageUrl: '/images/combo-momos.jpg',
    imageAlt: 'Hot steamed momos served fresh in a takeaway bowl',
  },
  {
    id: 'combo-biryani-drink',
    title: 'Biryani + Drink',
    price: 110,
    formattedPrice: '₹110',
    items: 'Pre-booked Biryani + Chilled Drink',
    note: 'Complete lunch-break meal ready at your slot',
    imageUrl: '/images/biryani-prebook.jpg',
    imageAlt: 'Pre-booked chicken biryani bowl combo',
  },
];
