import type { RiskLevel } from "./entities";

export interface TransactionAuditEvent {
  state: string;
  timestamp: string;
  detail?: string;
}

export interface AdminTransaction {
  id: string;
  date: string;
  partnerId: string;
  partnerName: string;
  merchantId: string;
  merchant: string;
  rider: string;
  orderId: string;
  customerReference: string;
  amount: number;
  paymentMethod: "NFC" | "Cash" | "Wallet";
  platformFee: number;
  tax: number;
  netToMerchant: number;
  riderCut: number;
  status: "Completed" | "Pending" | "Failed";
  nfcTagId?: string;
  auditTrail: TransactionAuditEvent[];
}

export interface AdminPendingSettlement {
  id: string;
  partnerId: string;
  partnerName: string;
  merchantId: string;
  merchantName: string;
  ordersCount: number;
  grossAmount: number;
  platformFee: number;
  tax: number;
  netPayable: number;
  dueDate: string;
}

export interface AdminProcessingSettlement {
  id: string;
  partnerName: string;
  merchantName: string;
  amount: number;
  status: "Processing" | "Queued";
  startedAt: string;
  progress: number;
}

export interface AdminCompletedSettlement {
  id: string;
  date: string;
  partnerName: string;
  merchant: string;
  amount: number;
  method: "Jazz Cash" | "Bank";
  referenceId: string;
  status: "Completed" | "Processing" | "Failed";
  errorMessage?: string;
}

export interface SettlementSummary {
  totalPending: number;
  processedToday: number;
  processedThisMonth: number;
  failedCount: number;
}

export interface AdminDiscountRequest {
  id: string;
  requestDate: string;
  partnerId: string;
  partnerName: string;
  merchantName: string;
  invoiceAmount: number;
  discountFeePercent: number;
  discountFee: number;
  payoutAmount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
  status: "Pending Approval" | "Approved" | "Rejected" | "Paid Out";
  requestedBy: string;
}

export interface DiscountingStats {
  pendingRequests: number;
  approvedToday: number;
  rejectedToday: number;
  discountedThisMonth: number;
}

export interface AdminSettlementsData {
  summary: SettlementSummary;
  pending: AdminPendingSettlement[];
  processing: AdminProcessingSettlement[];
  completed: AdminCompletedSettlement[];
}

export interface AdminDiscountRequestsData {
  requests: AdminDiscountRequest[];
  stats: DiscountingStats;
}

export interface DiscountingRules {
  merchantAgeWeight: number;
  volumeConsistencyWeight: number;
  repaymentHistoryWeight: number;
  partnerReputationWeight: number;
  lowTierPercent: number;
  mediumTierPercent: number;
  highTierPercent: number;
}

export interface DiscountingRulesEngine {
  merchantAgeWeight: number;
  volumeConsistencyWeight: number;
  repaymentHistoryWeight: number;
  partnerReputationWeight: number;
}
