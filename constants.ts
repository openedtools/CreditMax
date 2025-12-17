
import { CreditCard, Frequency, Subscription, AiUsageItem } from "./types";

const TODAY = new Date();

export const MOCK_CARDS: CreditCard[] = [
  {
    id: 'c1',
    name: 'Platinum Card®',
    nickname: 'My Amex',
    last4: '1005',
    issuer: 'American Express',
    network: 'Amex',
    annualFee: 695,
    colorFrom: 'from-slate-400',
    colorTo: 'to-slate-600',
    renewalDate: '2025-11-15',
    loginUrl: 'https://www.americanexpress.com',
    points: 145000,
    pointsName: 'Membership Rewards',
    autoPay: true,
    benefits: [
      { id: 'b1', title: 'Digital Entertainment Credit', description: 'Up to $20/mo for Disney+, Hulu, ESPN+, Peacock, NYT, WSJ.', value: 240, frequency: Frequency.MONTHLY, usedAmount: 120, isCredit: true, category: 'Entertainment', resetType: 'calendar' },
      { id: 'b2', title: 'Uber Cash', description: '$15 per month plus a $20 bonus in December for Uber or Uber Eats.', value: 200, frequency: Frequency.MONTHLY, usedAmount: 85, isCredit: true, category: 'Travel', resetType: 'calendar' },
      { id: 'b3', title: 'Airline Fee Credit', description: 'Incidental fees (bags, seat selection) on one selected airline.', value: 200, frequency: Frequency.ANNUAL, usedAmount: 45, isCredit: true, category: 'Travel', resetType: 'calendar' },
      { id: 'b4', title: 'Walmart+ Membership', description: 'Full cost of monthly Walmart+ membership covered ($12.95/mo).', value: 155, frequency: Frequency.MONTHLY, usedAmount: 77, isCredit: true, category: 'Shopping', resetType: 'calendar' },
      { id: 'b5', title: 'Saks Fifth Avenue', description: '$50 credit Jan-Jun and $50 credit Jul-Dec.', value: 100, frequency: Frequency.SEMI_ANNUAL, usedAmount: 50, isCredit: true, category: 'Shopping', resetType: 'calendar' },
      { id: 'b6', title: 'CLEAR® Plus Credit', description: 'Cover the cost of CLEAR Plus membership annually.', value: 189, frequency: Frequency.ANNUAL, usedAmount: 189, isCredit: true, category: 'Travel', resetType: 'calendar' },
      { id: 'b7', title: 'Global Lounge Collection', description: 'Access to Centurion, Priority Pass, and Delta SkyClubs.', value: 0, frequency: Frequency.ONE_TIME, usedAmount: 0, isCredit: false, category: 'Travel' },
      { id: 'b8', title: 'Prepaid Hotel Credit', description: '$200 back on Fine Hotels + Resorts or The Hotel Collection bookings.', value: 200, frequency: Frequency.ANNUAL, usedAmount: 0, isCredit: true, category: 'Travel', resetType: 'calendar' },
      { id: 'b9', title: 'Equinox Credit', description: '$25 monthly credit for Equinox app or club membership.', value: 300, frequency: Frequency.MONTHLY, usedAmount: 0, isCredit: true, category: 'Health', resetType: 'calendar' },
    ]
  },
  {
    id: 'c2',
    name: 'Sapphire Reserve®',
    nickname: "Wife's CSR",
    last4: '4421',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 550,
    colorFrom: 'from-blue-800',
    colorTo: 'to-indigo-900',
    renewalDate: '2025-08-01',
    loginUrl: 'https://www.chase.com',
    points: 82050,
    pointsName: 'Ultimate Rewards',
    autoPay: true,
    benefits: [
      { id: 'b10', title: 'Annual Travel Credit', description: 'Automatically reimburses the first $300 spent on travel.', value: 300, frequency: Frequency.ANNUAL, usedAmount: 300, isCredit: true, category: 'Travel', resetType: 'anniversary' },
      { id: 'b11', title: 'DoorDash DashPass', description: 'Complimentary DashPass subscription (min $0 delivery fees).', value: 120, frequency: Frequency.ANNUAL, usedAmount: 120, isCredit: false, category: 'Food', resetType: 'anniversary' },
      { id: 'b12', title: 'DoorDash Monthly Credit', description: '$5 monthly DoorDash credit.', value: 60, frequency: Frequency.MONTHLY, usedAmount: 25, isCredit: true, category: 'Food', resetType: 'calendar' },
      { id: 'b13', title: 'Priority Pass Select', description: 'Lounge access for you and two guests.', value: 0, frequency: Frequency.ONE_TIME, usedAmount: 0, isCredit: false, category: 'Travel' },
      { id: 'b14', title: 'Global Entry/TSA PreCheck', description: 'Statement credit for application fee every 4 years.', value: 100, frequency: Frequency.ONE_TIME, usedAmount: 100, isCredit: true, category: 'Travel' },
      { id: 'b15', title: 'The Edit Hotel Credit', description: 'Special benefits at properties in The Edit collection.', value: 0, frequency: Frequency.ONE_TIME, usedAmount: 0, isCredit: false, category: 'Travel' },
      { id: 'b16', title: 'Lyft Pink All Access', description: '2 years of complimentary Lyft Pink All Access.', value: 199, frequency: Frequency.ONE_TIME, usedAmount: 199, isCredit: false, category: 'Travel' },
      { id: 'b17', title: 'Instacart+ & Credit', description: '1 year of Instacart+ and $15/mo statement credit.', value: 180, frequency: Frequency.MONTHLY, usedAmount: 45, isCredit: true, category: 'Shopping', resetType: 'calendar' },
      { id: 'b18', title: 'Peloton Credit', description: 'Earn 10x points on Peloton equipment and accessories.', value: 0, frequency: Frequency.ONE_TIME, usedAmount: 0, isCredit: false, category: 'Health' },
    ]
  },
  {
    id: 'c3',
    name: 'Bilt Mastercard®',
    nickname: "Rent Card",
    last4: '8821',
    issuer: 'Wells Fargo',
    network: 'Mastercard',
    annualFee: 0,
    colorFrom: 'from-slate-800',
    colorTo: 'to-black',
    renewalDate: '2025-01-15',
    loginUrl: 'https://www.biltrewards.com',
    points: 42000,
    pointsName: 'Bilt Points',
    autoPay: false,
    benefits: [
        { id: 'b20', title: 'No Fee Rent Payments', description: 'Earn 1x points on rent without transaction fees.', value: 0, frequency: Frequency.MONTHLY, usedAmount: 0, isCredit: false, category: 'Housing', resetType: 'calendar' },
        { id: 'b21', title: 'Rent Day Double Points', description: 'Double points on non-rent spend on the 1st of the month.', value: 0, frequency: Frequency.MONTHLY, usedAmount: 0, isCredit: false, category: 'Spending', resetType: 'calendar' },
        { id: 'b22', title: 'Lyft Credits', description: 'Earn 5x points on Lyft rides.', value: 0, frequency: Frequency.ONE_TIME, usedAmount: 0, isCredit: false, category: 'Travel' },
    ]
  }
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: 's1', name: 'Netflix Premium', cost: 22.99, frequency: Frequency.MONTHLY, renewalDay: 15, category: 'Entertainment', linkedCardId: 'c1', autoPay: true },
  { id: 's2', name: 'Spotify Duo', cost: 14.99, frequency: Frequency.MONTHLY, renewalDay: 3, category: 'Music', linkedCardId: '', autoPay: true },
  { id: 's3', name: 'ChatGPT Plus', cost: 20.00, frequency: Frequency.MONTHLY, renewalDay: 28, category: 'AI', linkedCardId: '', autoPay: false },
  { id: 's4', name: 'Walmart+', cost: 12.95, frequency: Frequency.MONTHLY, renewalDay: 1, category: 'Shopping', linkedCardId: 'c1', autoPay: true },
  { id: 's5', name: 'Uber One', cost: 9.99, frequency: Frequency.MONTHLY, renewalDay: 12, category: 'Travel', linkedCardId: 'c1', autoPay: true },
];

export const MOCK_AI_ITEMS: AiUsageItem[] = [
    { id: 'ai1', serviceName: 'ChatGPT', planName: 'Business (Teams)', loginUrl: 'https://chatgpt.com', quotaName: 'Deep Research (standard)', quotaAmount: 10, usedAmount: 2, renewalDay: 28, frequency: 'Monthly', autoPay: true },
    { id: 'ai2', serviceName: 'ChatGPT', planName: 'Business (Teams)', loginUrl: 'https://chatgpt.com', quotaName: 'Agent Runs', quotaAmount: 40, usedAmount: 0, renewalDay: 28, frequency: 'Monthly', autoPay: true },
    { id: 'ai3', serviceName: 'ChatGPT', planName: 'Business (Teams)', loginUrl: 'https://chatgpt.com', quotaName: 'Pro Prompts', quotaAmount: 15, usedAmount: 15, renewalDay: 28, frequency: 'Monthly', autoPay: true },
    { id: 'ai4', serviceName: 'Google Gemini', planName: 'Google AI Pro', loginUrl: 'https://gemini.google.com', quotaName: 'AI Credits', quotaAmount: 1000, usedAmount: 150, renewalDay: 10, frequency: 'Monthly', autoPay: true },
    { id: 'ai5', serviceName: 'Google Gemini', planName: 'Google AI Pro', loginUrl: 'https://gemini.google.com', quotaName: 'Daily Prompt Limit', quotaAmount: 100, usedAmount: 12, renewalDay: 10, frequency: 'Daily', autoPay: true },
    { id: 'ai6', serviceName: 'Midjourney', planName: 'Basic', loginUrl: 'https://midjourney.com', quotaName: 'Fast GPU Time (min)', quotaAmount: 200, usedAmount: 45, renewalDay: 25, frequency: 'Monthly', autoPay: false },
];
