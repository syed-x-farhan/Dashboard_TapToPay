import { format, subDays } from "date-fns";
import type {
  AdminDashboardData,
  LiveTransaction,
  PlatformVolumePoint,
} from "../types";

export const platformDashboardStats = {
  totalPartners: 12,
  partnersPendingApproval: 3,
  totalMerchants: 1284,
  merchantsAddedThisWeek: 48,
  totalRiders: 8420,
  activeRidersToday: 6200,
  todayVolume: 84200000,
  volumeChangePercent: 14,
  pendingSettlements: 124000000,
  discountingRequests: 24,
  discountingPendingApproval: 18,
  totalTaxHeld: 4200000,
  platformRevenueToday: 842000,
};

export const platformVolumeData: PlatformVolumePoint[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const base = 72000000 + i * 400000 + (i % 5) * 1200000;
    const volume = base + Math.floor(Math.random() * 8000000);
    const settlements = Math.round(volume * 0.82);
    const fees = Math.round(volume * 0.01);
    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "dd MMM"),
      volume,
      settlements,
      fees,
    };
  }
);

export const partnerTypeVolume = [
  { name: "Food Delivery", value: 38, color: "#00C896" },
  { name: "Courier", value: 28, color: "#3B82F6" },
  { name: "Retail", value: 22, color: "#F59E0B" },
  { name: "Direct Restaurant", value: 12, color: "#8B5CF6" },
];

export const pendingActions = [
  {
    id: "pa1",
    severity: "amber" as const,
    description: "18 invoice discount requests pending approval",
    href: "/admin/invoice-discounting",
    actionLabel: "Review",
  },
  {
    id: "pa2",
    severity: "amber" as const,
    description: "3 new partner applications awaiting approval",
    href: "/admin/partners",
    actionLabel: "Approve",
  },
  {
    id: "pa3",
    severity: "red" as const,
    description: "FBR filing due in 2 days — Rs. 4.2M pending",
    href: "/admin/tax-compliance",
    actionLabel: "File Now",
  },
  {
    id: "pa4",
    severity: "red" as const,
    description: "Merchant KFC Gulberg settlement overdue by 3 days",
    href: "/admin/settlements",
    actionLabel: "Settle",
  },
  {
    id: "pa5",
    severity: "amber" as const,
    description: "2 failed Jazz Cash settlements need retry",
    href: "/admin/settlements",
    actionLabel: "Retry",
  },
];

const liveFeedSeed: Omit<LiveTransaction, "id">[] = [
  { partner: "Leopards Courier", merchant: "KFC Gulberg", amount: 4200, paymentMethod: "NFC", timestamp: "14:42:18" },
  { partner: "Foodpanda Pakistan", merchant: "Hardees DHA", amount: 3800, paymentMethod: "Wallet", timestamp: "14:41:55" },
  { partner: "Daraz.pk", merchant: "Metro Cash & Carry", amount: 12400, paymentMethod: "NFC", timestamp: "14:41:32" },
  { partner: "TCS Connect", merchant: "Gourmet Bakers", amount: 2100, paymentMethod: "Cash", timestamp: "14:41:08" },
  { partner: "Leopards Courier", merchant: "Pizza Hut MM Alam", amount: 5600, paymentMethod: "NFC", timestamp: "14:40:44" },
  { partner: "Foodpanda Pakistan", merchant: "Bundu Khan", amount: 3400, paymentMethod: "NFC", timestamp: "14:40:21" },
  { partner: "Daraz.pk", merchant: "Naheed Supermarket", amount: 8900, paymentMethod: "Wallet", timestamp: "14:39:57" },
  { partner: "TCS Connect", merchant: "Al-Fatah Store", amount: 6200, paymentMethod: "NFC", timestamp: "14:39:33" },
  { partner: "Leopards Courier", merchant: "Cheezious F-7", amount: 4800, paymentMethod: "Cash", timestamp: "14:39:10" },
  { partner: "Foodpanda Pakistan", merchant: "KFC Gulberg", amount: 3900, paymentMethod: "NFC", timestamp: "14:38:46" },
];

let liveFeedCounter = 0;

function generateLiveFeed(): LiveTransaction[] {
  const now = new Date();
  return liveFeedSeed.map((item, i) => ({
    ...item,
    id: `live-${liveFeedCounter}-${i}`,
    timestamp: format(
      new Date(now.getTime() - i * 22000 - Math.floor(Math.random() * 5000)),
      "HH:mm:ss"
    ),
    amount: item.amount + Math.floor(Math.random() * 500),
  }));
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  await delay(200);
  return {
    stats: platformDashboardStats,
    volume: platformVolumeData,
    partnerTypes: partnerTypeVolume,
    pendingActions,
    liveFeed: generateLiveFeed(),
  };
}

export async function fetchLiveTransactionFeed(): Promise<LiveTransaction[]> {
  await delay(150);
  liveFeedCounter += 1;
  return generateLiveFeed();
}
