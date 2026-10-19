import type { MerchantCategory, MerchantStatus, RiderStatus } from "@/types/partner";
import type { RiderDeliveryStop, RiderDailyEarning } from "@/types/partner";

export type PartnerType = "Food Delivery" | "Courier" | "Retail" | "Direct Restaurant";
export type PartnerStatus = "Active" | "Pending Approval" | "Suspended";
export type RiskLevel = "Low" | "Medium" | "High";

export interface DiscountTiers {
  low: number;
  medium: number;
  high: number;
}

export interface FeeHistoryEntry {
  id: string;
  date: string;
  amount: number;
  merchantCount: number;
}

export interface AdminPartner {
  id: string;
  name: string;
  type: PartnerType;
  city: string;
  totalMerchants: number;
  totalRiders: number;
  monthlyVolume: number;
  feeRate: number;
  status: PartnerStatus;
  joinedDate: string;
  contactPerson: string;
  email: string;
  phone: string;
  ntn: string;
  accountManager: string;
  discountTiers: DiscountTiers;
  suspendReason?: string;
}

export interface AdminPartnerDetail extends AdminPartner {
  volumeChart: { label: string; volume: number }[];
  feeHistory: FeeHistoryEntry[];
  merchantIds: string[];
  riderIds: string[];
}

export interface AdminMerchant {
  id: string;
  partnerId: string;
  partnerName: string;
  name: string;
  city: string;
  category: MerchantCategory;
  volumeThisMonth: number;
  pendingSettlement: number;
  activeRiders: number;
  status: MerchantStatus;
  ownerName: string;
  cnic: string;
  phone: string;
  jazzCashNumber: string;
  monthlyExpectedVolume: number;
  internalRiskScore: number;
  riskLevel: RiskLevel;
  accountFlags: string[];
  opsNotes: string;
}

export interface AdminRider {
  id: string;
  partnerId: string;
  partnerName: string;
  name: string;
  phone: string;
  cnic: string;
  city: string;
  pickupMerchants: string[];
  activeZone: string;
  deliveriesToday: number;
  completedDeliveriesToday: number;
  lastSeenAt: string;
  lastSeenArea: string;
  todayCollections: number;
  totalThisMonth: number;
  nfcPaymentsCount: number;
  cashCollections: number;
  status: RiderStatus;
  recentDeliveries: RiderDeliveryStop[];
  dailyEarnings: RiderDailyEarning[];
  flagged: boolean;
  flagReason?: string;
}

export const ACCOUNT_MANAGERS = [
  "Fahad Khan",
  "Tariq Mehmood",
  "Aisha Malik",
  "Fahad Iqbal",
] as const;
