export type AdminRole = "super_admin" | "admin" | "ops";

export interface AdminSession {
  email: string;
  name: string;
  role: AdminRole;
}

export interface PlatformDashboardStats {
  totalPartners: number;
  partnersPendingApproval: number;
  totalMerchants: number;
  merchantsAddedThisWeek: number;
  totalRiders: number;
  activeRidersToday: number;
  todayVolume: number;
  volumeChangePercent: number;
  pendingSettlements: number;
  discountingRequests: number;
  discountingPendingApproval: number;
  totalTaxHeld: number;
  platformRevenueToday: number;
}

export interface PlatformVolumePoint {
  date: string;
  label: string;
  volume: number;
  settlements: number;
  fees: number;
}

export interface PartnerTypeVolume {
  name: string;
  value: number;
  color: string;
}

export interface PendingAction {
  id: string;
  severity: "red" | "amber";
  description: string;
  href: string;
  actionLabel: string;
}

export interface LiveTransaction {
  id: string;
  partner: string;
  merchant: string;
  amount: number;
  paymentMethod: "NFC" | "Cash" | "Wallet";
  timestamp: string;
}

export interface AdminDashboardData {
  stats: PlatformDashboardStats;
  volume: PlatformVolumePoint[];
  partnerTypes: PartnerTypeVolume[];
  pendingActions: PendingAction[];
  liveFeed: LiveTransaction[];
}
