export type RiskScore = "Low" | "Medium" | "High";
export type MerchantCategory = "Restaurant" | "Retail" | "Other";
export type MerchantStatus = "Active" | "Inactive" | "Pending Approval";
export type RiderStatus = "Active" | "Inactive" | "Suspended";
export type DeliveryStatus = "Delivered" | "In Transit" | "Failed" | "Pending";

export interface RiderDeliveryStop {
  id: string;
  orderId: string;
  pickupMerchant: string;
  customerName: string;
  deliveryAddress: string;
  area: string;
  amount: number;
  paymentMethod: "NFC" | "Cash" | "Wallet";
  collectedAt: string;
  status: DeliveryStatus;
}

export interface RiderDailyEarning {
  day: string;
  amount: number;
  deliveries: number;
}

export interface Partner {
  name: string;
  companyType: string;
  contactEmail: string;
  contactPerson: string;
  phone: string;
  address: string;
  ntn: string;
}

export interface PartnerDashboardStats {
  totalMerchants: number;
  merchantsAddedThisMonth: number;
  activeRidersToday: number;
  totalRiders: number;
  todayVolume: number;
  volumeChangePercent: number;
  pendingSettlements: number;
  pendingMerchantsCount: number;
  platformFeesCollected: number;
  taxAutoFiled: number;
}

export interface VolumeDataPoint {
  date: string;
  label: string;
  volume: number;
  settlements: number;
}

export interface TopMerchant {
  id: string;
  name: string;
  todayVolume: number;
  sharePercent: number;
}

export interface ActivityEvent {
  id: string;
  type: "settlement" | "discount" | "onboard" | "transaction";
  description: string;
  merchant: string;
  amount?: number;
  timeAgo: string;
}

export interface PartnerMerchant {
  id: string;
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
}

export interface PartnerRider {
  id: string;
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
}

export interface PartnerTransaction {
  id: string;
  date: string;
  orderId: string;
  merchant: string;
  merchantId: string;
  rider: string;
  customerReference: string;
  amount: number;
  paymentMethod: "NFC" | "Cash" | "Wallet";
  platformFee: number;
  tax: number;
  netToMerchant: number;
  status: "Completed" | "Pending" | "Failed";
  riderCut: number;
  nfcTagId?: string;
}

export interface PendingSettlement {
  id: string;
  merchantId: string;
  merchantName: string;
  ordersCount: number;
  grossAmount: number;
  platformFee: number;
  tax: number;
  netPayable: number;
  dueDate: string;
}

export interface CompletedSettlement {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  method: "Jazz Cash" | "Bank";
  referenceId: string;
  status: "Completed" | "Processing";
}

export interface DiscountRequest {
  id: string;
  requestDate: string;
  merchantName: string;
  invoiceAmount: number;
  discountFee: number;
  amountToPayOut: number;
  riskScore: RiskScore;
  status: "Pending Approval" | "Approved" | "Rejected" | "Paid Out";
}

export interface WebhookConfig {
  id: string;
  eventType: string;
  url: string;
  status: "Active" | "Inactive";
  lastTriggered: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Viewer";
  lastLogin: string;
}

export interface ScheduledReport {
  id: string;
  name: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  format: "PDF" | "Excel" | "CSV";
  recipient: string;
}

export interface PartnerApiKeys {
  live: string;
  test: string;
}

export interface PartnerDiscountRules {
  low: number;
  medium: number;
  high: number;
}

export interface PartnerDashboardData {
  stats: PartnerDashboardStats;
  volume: VolumeDataPoint[];
  topMerchants: TopMerchant[];
  activity: ActivityEvent[];
}

export interface PartnerSettingsData {
  partner: Partner;
  webhooks: WebhookConfig[];
  teamMembers: TeamMember[];
  scheduledReports: ScheduledReport[];
  apiKeys: PartnerApiKeys;
  discountRules: PartnerDiscountRules;
}
