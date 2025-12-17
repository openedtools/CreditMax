
export enum Frequency {
  MONTHLY = 'Monthly',
  ANNUAL = 'Annual',
  ONE_TIME = 'One-time',
  QUARTERLY = 'Quarterly',
  SEMI_ANNUAL = 'Semi-Annual',
  DAILY = 'Daily'
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  value: number; // Estimated monetary value
  frequency: Frequency;
  usedAmount: number;
  isCredit: boolean; // True if it's a statement credit (e.g., Uber cash)
  category?: string; // e.g. Travel, Dining, Shopping
  resetType?: 'calendar' | 'anniversary'; // Determines if it resets Jan 1 or on card renewal
  isHidden?: boolean; // User choice to hide this benefit from views
}

export interface CreditCard {
  id: string;
  name: string;
  nickname?: string; // User defined name (e.g. "John's Amex")
  last4?: string; // Last 4 digits for identification
  issuer: string;
  network?: string; // Visa, Mastercard, Amex, Discover
  annualFee: number;
  benefits: Benefit[];
  colorFrom: string;
  colorTo: string;
  renewalDate?: string; // ISO Date string YYYY-MM-DD
  loginUrl?: string; // URL to bank login
  points?: number; // Current points balance
  pointsName?: string; // e.g. "Membership Rewards", "Ultimate Rewards"
  autoPay?: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  frequency: Frequency;
  renewalDay: number; // Day of the month it renews
  category: string;
  linkedCardId?: string; // If paid by a specific card to maximize benefits
  autoPay?: boolean;
}

export interface AiUsageItem {
  id: string;
  serviceName: string; // e.g. ChatGPT
  planName: string; // e.g. Business (Teams)
  loginUrl?: string;
  quotaName: string; // e.g. "Agent Runs"
  quotaAmount: number; // e.g. 40
  usedAmount: number; // e.g. 12
  renewalDay: number; // 1-31
  frequency: 'Monthly' | 'Daily';
  autoPay?: boolean;
}

export type ViewState = 'dashboard' | 'cards' | 'subscriptions' | 'benefits' | 'perks' | 'ai-hub' | 'points' | 'advisor' | 'settings';
