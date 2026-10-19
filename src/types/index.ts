export type PaymentMethod = "NFC" | "Cash" | "Wallet";
export type TransactionStatus = "Completed" | "Pending" | "Failed";
export type DiscountStatus =
  | "Pending Approval"
  | "Approved"
  | "Paid Out"
  | "Rejected";
export type TaxFilingStatus = "Filed" | "Pending";
export type SettlementFrequency = "Daily" | "Weekly";

export interface Merchant {
  name: string;
  jazzCashNumber: string;
  status: "Active" | "Inactive";
  ownerName: string;
  cnic: string;
  address: string;
  businessType: string;
  bankName: string;
  bankAccount: string;
  settlementFrequency: SettlementFrequency;
}

export interface DashboardStats {
  walletBalance: number;
  walletChangeToday: number;
  pendingSettlement: number;
  pendingPayoutDays: number;
  monthEarnings: number;
  monthEarningsChangePercent: number;
  taxHeld: number;
}

export interface EarningsDataPoint {
  date: string;
  label: string;
  earnings: number;
}

export interface PaymentBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  orderId: string;
  merchantReference: string;
  customer: string;
  amount: number;
  rider: string;
  paymentMethod: PaymentMethod;
  platformFee: number;
  tax: number;
  netAmount: number;
  status: TransactionStatus;
  nfcTagId?: string;
  riderCut: number;
}

export interface EligibleInvoice {
  id: string;
  batchDate: string;
  orderCount: number;
  totalAmount: number;
  discountFeePercent: number;
  amountAfterDiscount: number;
  discountFee: number;
}

export interface DiscountHistory {
  id: string;
  requestDate: string;
  invoiceBatch: string;
  amount: number;
  fee: number;
  received: number;
  status: DiscountStatus;
}

export interface InvoiceDiscountStats {
  availableForDiscounting: number;
  totalDiscountedThisMonth: number;
}

export interface TaxMonthRow {
  month: string;
  totalRevenue: number;
  taxRate: number;
  taxAmount: number;
  status: TaxFilingStatus;
}

export interface TaxDocument {
  id: string;
  month: string;
  dateGenerated: string;
}

export interface TaxStats {
  totalTaxCollectedYear: number;
  totalTaxFiled: number;
  nextFilingDate: string;
}

export interface TaxSummary {
  month: string;
  wht: number;
  gst: number;
  total: number;
}

export interface TaxComplianceData {
  stats: TaxStats;
  months: TaxMonthRow[];
  summary: TaxSummary;
  documents: TaxDocument[];
}

export interface NotificationSettings {
  paymentReceived: boolean;
  settlementProcessed: boolean;
  invoiceDiscountApproved: boolean;
  taxFiled: boolean;
  lowBalanceAlert: boolean;
}
