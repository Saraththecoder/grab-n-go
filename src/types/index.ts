export type MenuCategory =
  | 'All'
  | 'Momos'
  | 'Bowls'
  | 'Wraps'
  | 'Soups'
  | 'Drinks';

export interface MenuVariant {
  id: string;
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All'>;
  filterLabel: string;
  priceRange: string;
  servingNote?: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  highlight?: string;
  variants: MenuVariant[];
}

export interface ComboDeal {
  id: string;
  title: string;
  price: number;
  formattedPrice: string;
  items: string;
  note: string;
  imageUrl: string;
  imageAlt: string;
}

export interface OrderLineItem {
  key: string;
  name: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  detailLabel: string;
  detailValue: string;
}

export interface HygieneHighlight {
  label: string;
  detail: string;
}
