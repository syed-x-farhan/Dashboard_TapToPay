import type { RiskScore } from "@/types/partner";
import type { AdminRole } from "../types";

export type FilingStatus = "Filed" | "Due Soon" | "Overdue" | "Pending";

export interface TaxComplianceStats {
  totalTaxCollected: number;
  totalFiledToFbr: number;
  pendingFilingAmount: number;
  nextFilingDeadline: string;
}

export interface MonthlyFiling {
  month: string;
  year: number;
  status: FilingStatus;
  totalTax: number;
  wht: number;
  gst: number;
  partnerBreakdown: { partnerName: string; tax: number }[];
}

export interface PartnerTaxRow {
  id: string;
  partnerName: string;
  merchantsCount: number;
  totalRevenue: number;
  whtCollected: number;
  gstCollected: number;
  totalTax: number;
  filingStatus: FilingStatus;
}

export interface FbrFilingRecord {
  id: string;
  date: string;
  period: string;
  amount: number;
  referenceNumber: string;
}

export interface RiskAlert {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium";
  entityType: "Merchant" | "Rider";
  entityName: string;
  partnerName: string;
}

export interface RiskFlag {
  id: string;
  entityType: "Merchant" | "Rider";
  name: string;
  partnerName: string;
  flagReason: string;
  riskLevel: RiskScore;
  flaggedDate: string;
  status: "Active" | "Under Review" | "Cleared";
}

export interface AnomalyPoint {
  hour: string;
  volume: number;
  isAnomaly?: boolean;
  anomalyDetail?: string;
}

export interface RiskRule {
  id: string;
  label: string;
  enabled: boolean;
  threshold: number;
  unit: "PKR" | "count" | "percent";
}

export interface RiskManagementData {
  alerts: RiskAlert[];
  flags: RiskFlag[];
  anomalies: AnomalyPoint[];
  rules: RiskRule[];
}

export interface TaxComplianceData {
  stats: TaxComplianceStats;
  monthlyFilings: MonthlyFiling[];
  partnerTaxRows: PartnerTaxRow[];
  fbrHistory: FbrFilingRecord[];
}

export interface SystemHealthData {
  stats: SystemHealthStats;
  services: SystemService[];
  apiResponseData: ApiResponsePoint[];
  errorLogs: ErrorLogEntry[];
  webhooks: WebhookDelivery[];
  webhookSuccessRate: number;
}

export interface AdminSettingsData {
  platform: PlatformSettings;
  feeConfig: FeeConfigRow[];
  notifications: NotificationSettings;
  integrations: IntegrationConfig[];
}

export interface SystemHealthStats {
  apiUptime: number;
  avgResponseTimeMs: number;
  failedRequestsToday: number;
  jazzCashStatus: "Connected" | "Disconnected";
}

export type ServiceStatus = "Operational" | "Degraded" | "Down";

export interface SystemService {
  id: string;
  name: string;
  status: ServiceStatus;
  latencyMs: number;
  lastChecked: string;
}

export interface ApiResponsePoint {
  hour: string;
  backend: number;
  jazzCash: number;
  fbr: number;
  redis: number;
}

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  service: string;
  errorCode: string;
  message: string;
  affectedEntity: string;
  severity: "Critical" | "Warning" | "Info";
  resolved: boolean;
}

export interface WebhookDelivery {
  id: string;
  partnerName: string;
  event: string;
  timestamp: string;
  status: "Success" | "Failed" | "Retrying";
  attempts: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastLogin: string;
  status: "Active" | "Inactive";
}

export interface ActivityLogEntry {
  id: string;
  adminName: string;
  action: string;
  entityAffected: string;
  timestamp: string;
}

export interface TeamData {
  members: TeamMember[];
  activityLog: ActivityLogEntry[];
}

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  settlementFrequency: "Daily" | "Weekly";
  discountFeeLow: number;
  discountFeeMedium: number;
  discountFeeHigh: number;
  minTransactionAmount: number;
  maxTransactionAmount: number;
}

export interface FeeConfigRow {
  partnerType: string;
  defaultFeeRate: number;
}

export type FeeConfigScope = "global" | "partner" | "merchant";
export type FeeConfigResolvedFrom = "global" | "partner";
export type PlatformFeePayer = "merchant" | "partner" | "split";

export interface FeeConfigRecord {
  id: string;
  scope: FeeConfigScope;
  platformFeePercent: number;
  platformFeePayer: PlatformFeePayer;
  partnerCommissionPercent?: number;
  taxWhtPercent: number;
  invoiceDiscountLow: number;
  invoiceDiscountMedium: number;
  invoiceDiscountHigh: number;
}

export interface GlobalFeeConfig extends FeeConfigRecord {
  scope: "global";
}

export interface PartnerFeeConfigResponse {
  override: FeeConfigRecord | null;
  resolvedFrom: FeeConfigResolvedFrom;
  effectiveConfig: FeeConfigRecord;
}

export interface UpdateGlobalFeeConfigBody {
  platformFeePercent: number;
  taxWhtPercent: number;
  invoiceDiscountLow: number;
  invoiceDiscountMedium: number;
  invoiceDiscountHigh: number;
}

export interface UpsertPartnerFeeConfigBody {
  platformFeePercent: number;
  platformFeePayer: PlatformFeePayer;
  partnerCommissionPercent: number;
  overrideReason: string;
}

export interface NotificationSettings {
  newPartnerApplication: boolean;
  discountRequestPending: boolean;
  settlementFailed: boolean;
  fbrFilingDue: boolean;
  riskAlertTriggered: boolean;
  slackWebhookUrl: string;
  criticalAlertEmails: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  status: "Connected" | "Disconnected" | "Error";
  credentialMasked: string;
}
