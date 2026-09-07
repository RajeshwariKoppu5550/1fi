export type MarketplaceCategory = string;

export type EmiPlan = {
  id: string;
  months: number;
  monthlyAmount: number;
  interestRate: number;
  cashback: number;
};

export type ProductColor = { id: string; name: string; value: string };

export type MarketplaceProduct = {
  id: string;
  badge?: string;
  name: string;
  category: MarketplaceCategory;
  price: number;
  originalPrice: number;
  description: string;
  storageOptions: string[];
  colors: ProductColor[];
  plans: EmiPlan[];
  imageKind: "phone" | "laptop" | "audio";
  imageAccent: string;
  highlights: string[];
  details: { label: string; value: string }[];
};

export type MarketplaceCatalog = {
  categories: MarketplaceCategory[];
  products: MarketplaceProduct[];
};

export type CheckoutRequest = {
  productId: string;
  planId: string;
  color: string;
  storage: string;
};

export type CheckoutIntent = {
  checkoutId: string;
  status: "pending_eligibility";
};
