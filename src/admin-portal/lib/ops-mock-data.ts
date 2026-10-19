import type {
  ActivityLogEntry,
  AnomalyPoint,
  ApiResponsePoint,
  ErrorLogEntry,
  FbrFilingRecord,
  FeeConfigRow,
  IntegrationConfig,
  MonthlyFiling,
  NotificationSettings,
  PartnerTaxRow,
  PlatformSettings,
  RiskAlert,
  RiskFlag,
  RiskRule,
  SystemHealthStats,
  SystemService,
  TaxComplianceStats,
  TeamMember,
  WebhookDelivery,
} from "@/admin-portal/types/ops";
import type { AdminRole } from "@/admin-portal/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const taxStats: TaxComplianceStats = {
  totalTaxCollected: 42800000,
  totalFiledToFbr: 38600000,
  pendingFilingAmount: 4200000,
  nextFilingDeadline: "15/07/2025",
};

const monthlyFilings: MonthlyFiling[] = [
  { month: "Jan", year: 2025, status: "Filed", totalTax: 6200000, wht: 2480000, gst: 3720000, partnerBreakdown: [{ partnerName: "Leopards Courier Services", tax: 1860000 }, { partnerName: "Foodpanda Pakistan", tax: 1550000 }, { partnerName: "Daraz.pk", tax: 2790000 }] },
  { month: "Feb", year: 2025, status: "Filed", totalTax: 5840000, wht: 2336000, gst: 3504000, partnerBreakdown: [{ partnerName: "Leopards Courier Services", tax: 1752000 }, { partnerName: "Foodpanda Pakistan", tax: 1460000 }, { partnerName: "Daraz.pk", tax: 2628000 }] },
  { month: "Mar", year: 2025, status: "Filed", totalTax: 7120000, wht: 2848000, gst: 4272000, partnerBreakdown: [{ partnerName: "Leopards Courier Services", tax: 2136000 }, { partnerName: "Foodpanda Pakistan", tax: 1780000 }, { partnerName: "Daraz.pk", tax: 3204000 }] },
  { month: "Apr", year: 2025, status: "Filed", totalTax: 6480000, wht: 2592000, gst: 3888000, partnerBreakdown: [{ partnerName: "Leopards Courier Services", tax: 1944000 }, { partnerName: "Foodpanda Pakistan", tax: 1620000 }, { partnerName: "Daraz.pk", tax: 2916000 }] },
  { month: "May", year: 2025, status: "Filed", totalTax: 6960000, wht: 2784000, gst: 4176000, partnerBreakdown: [{ partnerName: "Leopards Courier Services", tax: 2088000 }, { partnerName: "Foodpanda Pakistan", tax: 1740000 }, { partnerName: "Daraz.pk", tax: 3132000 }] },
  { month: "Jun", year: 2025, status: "Due Soon", totalTax: 4200000, wht: 1680000, gst: 2520000, partnerBreakdown: [{ partnerName: "Leopards Courier Services", tax: 1260000 }, { partnerName: "Foodpanda Pakistan", tax: 1050000 }, { partnerName: "Daraz.pk", tax: 1890000 }] },
  { month: "Jul", year: 2025, status: "Pending", totalTax: 0, wht: 0, gst: 0, partnerBreakdown: [] },
  { month: "Aug", year: 2025, status: "Pending", totalTax: 0, wht: 0, gst: 0, partnerBreakdown: [] },
  { month: "Sep", year: 2025, status: "Pending", totalTax: 0, wht: 0, gst: 0, partnerBreakdown: [] },
  { month: "Oct", year: 2025, status: "Pending", totalTax: 0, wht: 0, gst: 0, partnerBreakdown: [] },
  { month: "Nov", year: 2025, status: "Pending", totalTax: 0, wht: 0, gst: 0, partnerBreakdown: [] },
  { month: "Dec", year: 2025, status: "Pending", totalTax: 0, wht: 0, gst: 0, partnerBreakdown: [] },
];

let partnerTaxRows: PartnerTaxRow[] = [
  { id: "pt1", partnerName: "Leopards Courier Services", merchantsCount: 142, totalRevenue: 48200000, whtCollected: 1928000, gstCollected: 2892000, totalTax: 4820000, filingStatus: "Due Soon" },
  { id: "pt2", partnerName: "Foodpanda Pakistan", merchantsCount: 386, totalRevenue: 62400000, whtCollected: 2496000, gstCollected: 3744000, totalTax: 6240000, filingStatus: "Due Soon" },
  { id: "pt3", partnerName: "Daraz.pk", merchantsCount: 512, totalRevenue: 84200000, whtCollected: 3368000, gstCollected: 5052000, totalTax: 8420000, filingStatus: "Due Soon" },
  { id: "pt4", partnerName: "TCS Connect", merchantsCount: 244, totalRevenue: 31800000, whtCollected: 1272000, gstCollected: 1908000, totalTax: 3180000, filingStatus: "Filed" },
];

const fbrHistory: FbrFilingRecord[] = [
  { id: "fbr1", date: "05/06/2025", period: "May 2025", amount: 6960000, referenceNumber: "FBR-WHT-2025-05-8821" },
  { id: "fbr2", date: "04/05/2025", period: "Apr 2025", amount: 6480000, referenceNumber: "FBR-WHT-2025-04-7742" },
  { id: "fbr3", date: "06/04/2025", period: "Mar 2025", amount: 7120000, referenceNumber: "FBR-WHT-2025-03-6618" },
  { id: "fbr4", date: "05/03/2025", period: "Feb 2025", amount: 5840000, referenceNumber: "FBR-WHT-2025-02-5521" },
  { id: "fbr5", date: "04/02/2025", period: "Jan 2025", amount: 6200000, referenceNumber: "FBR-WHT-2025-01-4410" },
];

let riskAlerts: RiskAlert[] = [
  { id: "ra1", title: "Unusual volume spike", description: "400% above 7-day average transaction volume", severity: "high", entityType: "Merchant", entityName: "KFC Gulberg", partnerName: "Leopards Courier Services" },
  { id: "ra2", title: "Multiple failed NFC attempts", description: "12 consecutive failed NFC taps in 30 minutes", severity: "high", entityType: "Rider", entityName: "Ahmed Raza", partnerName: "Leopards Courier Services" },
  { id: "ra3", title: "Large single transaction", description: "Transaction of Rs. 68,400 exceeds Rs. 50,000 threshold", severity: "medium", entityType: "Merchant", entityName: "Metro Cash & Carry", partnerName: "Daraz.pk" },
];

let riskFlags: RiskFlag[] = [
  { id: "rf1", entityType: "Merchant", name: "KFC Gulberg", partnerName: "Leopards Courier Services", flagReason: "Volume spike — 400% above average", riskLevel: "High", flaggedDate: "27/06/2025", status: "Active" },
  { id: "rf2", entityType: "Rider", name: "Ahmed Raza", partnerName: "Leopards Courier Services", flagReason: "Multiple failed NFC attempts", riskLevel: "High", flaggedDate: "27/06/2025", status: "Under Review" },
  { id: "rf3", entityType: "Merchant", name: "Al-Fatah Store", partnerName: "Daraz.pk", flagReason: "New merchant — high discount request", riskLevel: "Medium", flaggedDate: "26/06/2025", status: "Active" },
  { id: "rf4", entityType: "Rider", name: "Bilal Hassan", partnerName: "Foodpanda Pakistan", flagReason: "50+ transactions in one hour", riskLevel: "Medium", flaggedDate: "25/06/2025", status: "Active" },
  { id: "rf5", entityType: "Merchant", name: "Cheezious F-7", partnerName: "Foodpanda Pakistan", flagReason: "Previous late settlement", riskLevel: "Low", flaggedDate: "24/06/2025", status: "Cleared" },
];

const anomalyData: AnomalyPoint[] = Array.from({ length: 24 }, (_, i) => {
  const base = 2800000 + Math.sin(i / 3) * 400000;
  const isAnomaly = i === 14 || i === 19;
  return {
    hour: `${String(i).padStart(2, "0")}:00`,
    volume: isAnomaly ? base * 3.2 : base + Math.random() * 200000,
    isAnomaly,
    anomalyDetail: isAnomaly
      ? i === 14
        ? "KFC Gulberg — 412% volume spike at 14:00"
        : "Ahmed Raza — 58 transactions in 1 hour at 19:00"
      : undefined,
  };
});

let riskRules: RiskRule[] = [
  { id: "rr1", label: "Flag if single transaction exceeds", enabled: true, threshold: 50000, unit: "PKR" },
  { id: "rr2", label: "Flag if rider processes more than transactions in one hour", enabled: true, threshold: 50, unit: "count" },
  { id: "rr3", label: "Flag if merchant volume spikes more than vs 7-day average", enabled: true, threshold: 300, unit: "percent" },
  { id: "rr4", label: "Flag if failed NFC attempts exceed in 30 minutes", enabled: true, threshold: 10, unit: "count" },
  { id: "rr5", label: "Flag if settlement overdue by more than days", enabled: false, threshold: 7, unit: "count" },
];

const healthStats: SystemHealthStats = {
  apiUptime: 99.94,
  avgResponseTimeMs: 142,
  failedRequestsToday: 23,
  jazzCashStatus: "Connected",
};

const systemServices: SystemService[] = [
  { id: "s1", name: "FastAPI Backend", status: "Operational", latencyMs: 98, lastChecked: "2 mins ago" },
  { id: "s2", name: "PostgreSQL Database", status: "Operational", latencyMs: 12, lastChecked: "2 mins ago" },
  { id: "s3", name: "Redis Cache", status: "Operational", latencyMs: 3, lastChecked: "2 mins ago" },
  { id: "s4", name: "Jazz Cash API", status: "Operational", latencyMs: 340, lastChecked: "1 min ago" },
  { id: "s5", name: "FBR API", status: "Degraded", latencyMs: 820, lastChecked: "3 mins ago" },
  { id: "s6", name: "Raast/1Link API", status: "Operational", latencyMs: 210, lastChecked: "2 mins ago" },
  { id: "s7", name: "NFC Processing Service", status: "Operational", latencyMs: 45, lastChecked: "1 min ago" },
  { id: "s8", name: "Webhook Delivery Service", status: "Operational", latencyMs: 156, lastChecked: "2 mins ago" },
];

const apiResponseData: ApiResponsePoint[] = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  backend: 80 + Math.random() * 40 + (i === 14 ? 120 : 0),
  jazzCash: 280 + Math.random() * 80 + (i === 18 ? 200 : 0),
  fbr: 600 + Math.random() * 200 + (i === 10 ? 400 : 0),
  redis: 2 + Math.random() * 4,
}));

const errorLogs: ErrorLogEntry[] = [
  { id: "el1", timestamp: "27/06/2025 14:32:18", service: "Jazz Cash API", errorCode: "JC-503", message: "Insufficient float balance in merchant wallet", affectedEntity: "Cheezious F-7 settlement", severity: "Critical", resolved: false },
  { id: "el2", timestamp: "27/06/2025 13:15:42", service: "FBR API", errorCode: "FBR-TIMEOUT", message: "FBR portal connection timeout after 30s", affectedEntity: "May 2025 filing batch", severity: "Warning", resolved: false },
  { id: "el3", timestamp: "27/06/2025 11:08:03", service: "Webhook Delivery", errorCode: "WH-429", message: "Partner webhook endpoint returned 429 Too Many Requests", affectedEntity: "Daraz.pk — settlement.completed", severity: "Warning", resolved: true },
  { id: "el4", timestamp: "27/06/2025 09:44:21", service: "NFC Processing", errorCode: "NFC-422", message: "Invalid NFC tag signature — possible tampering", affectedEntity: "Rider Ahmed Raza — ORD-5518", severity: "Critical", resolved: false },
  { id: "el5", timestamp: "26/06/2025 22:18:55", service: "FastAPI Backend", errorCode: "DB-CONN", message: "PostgreSQL connection pool exhausted", affectedEntity: "Platform-wide", severity: "Critical", resolved: true },
  { id: "el6", timestamp: "26/06/2025 16:02:11", service: "Raast/1Link API", errorCode: "RAST-401", message: "Authentication token expired", affectedEntity: "Settlement batch #8821", severity: "Warning", resolved: true },
];

const webhookDeliveries: WebhookDelivery[] = [
  { id: "wh1", partnerName: "Leopards Courier Services", event: "settlement.completed", timestamp: "27/06/2025 14:35", status: "Success", attempts: 1 },
  { id: "wh2", partnerName: "Foodpanda Pakistan", event: "transaction.created", timestamp: "27/06/2025 14:28", status: "Success", attempts: 1 },
  { id: "wh3", partnerName: "Daraz.pk", event: "settlement.completed", timestamp: "27/06/2025 13:42", status: "Failed", attempts: 3 },
  { id: "wh4", partnerName: "Daraz.pk", event: "merchant.approved", timestamp: "27/06/2025 12:15", status: "Retrying", attempts: 2 },
  { id: "wh5", partnerName: "TCS Connect", event: "discount.approved", timestamp: "27/06/2025 11:03", status: "Success", attempts: 1 },
  { id: "wh6", partnerName: "Foodpanda Pakistan", event: "settlement.failed", timestamp: "26/06/2025 18:22", status: "Success", attempts: 2 },
];

let teamMembers: TeamMember[] = [
  { id: "tm1", name: "Fahad Khan", email: "fahad@riderpay.com", role: "super_admin", lastLogin: "27/06/2025 09:12", status: "Active" },
  { id: "tm2", name: "Admin User", email: "admin@riderpay.com", role: "admin", lastLogin: "27/06/2025 08:45", status: "Active" },
  { id: "tm3", name: "Ops User", email: "ops@riderpay.com", role: "ops", lastLogin: "26/06/2025 17:30", status: "Active" },
  { id: "tm4", name: "Sara Ahmed", email: "sara@riderpay.com", role: "admin", lastLogin: "26/06/2025 14:20", status: "Active" },
  { id: "tm5", name: "Ali Raza", email: "ali@riderpay.com", role: "ops", lastLogin: "25/06/2025 11:05", status: "Inactive" },
];

const activityLog: ActivityLogEntry[] = [
  { id: "al1", adminName: "Fahad Khan", action: "Approved partner", entityAffected: "TCS Connect", timestamp: "27/06/2025 10:15" },
  { id: "al2", adminName: "Admin User", action: "Approved discount request", entityAffected: "Hardees DHA — Rs. 38,400", timestamp: "27/06/2025 09:48" },
  { id: "al3", adminName: "Ops User", action: "Approved discount request", entityAffected: "Gourmet Bakers — Rs. 32,100", timestamp: "27/06/2025 09:22" },
  { id: "al4", adminName: "Fahad Khan", action: "Bulk settled partner", entityAffected: "Leopards Courier Services — 2 merchants", timestamp: "26/06/2025 16:40" },
  { id: "al5", adminName: "Sara Ahmed", action: "Suspended merchant", entityAffected: "Cheezious F-7", timestamp: "26/06/2025 14:12" },
  { id: "al6", adminName: "Admin User", action: "Filed tax to FBR", entityAffected: "May 2025 — Rs. 6,960,000", timestamp: "05/06/2025 11:30" },
  { id: "al7", adminName: "Fahad Khan", action: "Updated fee rate", entityAffected: "Food Delivery — 2.5%", timestamp: "03/06/2025 09:00" },
  { id: "al8", adminName: "Ops User", action: "Flagged rider", entityAffected: "Bilal Hassan", timestamp: "25/06/2025 18:55" },
];

let platformSettings: PlatformSettings = {
  platformName: "RiderPay",
  supportEmail: "support@riderpay.com",
  settlementFrequency: "Daily",
  discountFeeLow: 2,
  discountFeeMedium: 3.5,
  discountFeeHigh: 5,
  minTransactionAmount: 100,
  maxTransactionAmount: 100000,
};

let feeConfig: FeeConfigRow[] = [
  { partnerType: "Food Delivery", defaultFeeRate: 2.5 },
  { partnerType: "Courier", defaultFeeRate: 2.0 },
  { partnerType: "Retail", defaultFeeRate: 2.8 },
  { partnerType: "Direct Restaurant", defaultFeeRate: 3.0 },
];

let notificationSettings: NotificationSettings = {
  newPartnerApplication: true,
  discountRequestPending: true,
  settlementFailed: true,
  fbrFilingDue: true,
  riskAlertTriggered: true,
  slackWebhookUrl: "https://hooks.slack.com/services/T000/B000/XXXX",
  criticalAlertEmails: "fahad@riderpay.com, admin@riderpay.com",
};

let integrations: IntegrationConfig[] = [
  { id: "int1", name: "Jazz Cash API", status: "Connected", credentialMasked: "jc_live_••••••••••••4821" },
  { id: "int2", name: "Raast API", status: "Connected", credentialMasked: "raast_••••••••••••9912" },
  { id: "int3", name: "FBR Portal", status: "Connected", credentialMasked: "fbr_ntn_••••••••5521" },
  { id: "int4", name: "1Link API", status: "Connected", credentialMasked: "1link_••••••••••••7742" },
];

export async function fetchTaxCompliance() {
  await delay(200);
  return {
    stats: { ...taxStats },
    monthlyFilings: monthlyFilings.map((m) => ({ ...m, partnerBreakdown: [...m.partnerBreakdown] })),
    partnerTaxRows: [...partnerTaxRows],
    fbrHistory: [...fbrHistory],
  };
}

export async function fileTaxToFbr(monthKey: string) {
  await delay(600);
  const idx = monthlyFilings.findIndex((m) => `${m.month}-${m.year}` === monthKey);
  if (idx >= 0 && monthlyFilings[idx].status !== "Filed") {
    monthlyFilings[idx] = { ...monthlyFilings[idx], status: "Filed" };
    partnerTaxRows = partnerTaxRows.map((r) =>
      r.filingStatus === "Due Soon" ? { ...r, filingStatus: "Filed" as const } : r
    );
  }
}

export async function fetchRiskManagement() {
  await delay(200);
  return {
    alerts: [...riskAlerts],
    flags: [...riskFlags],
    anomalies: [...anomalyData],
    rules: riskRules.map((r) => ({ ...r })),
  };
}

export async function dismissRiskAlert(id: string) {
  await delay(300);
  riskAlerts = riskAlerts.filter((a) => a.id !== id);
}

export async function clearRiskFlag(id: string) {
  await delay(300);
  riskFlags = riskFlags.map((f) =>
    f.id === id ? { ...f, status: "Cleared" as const } : f
  );
}

export async function saveRiskRules(rules: RiskRule[]) {
  await delay(400);
  riskRules = rules.map((r) => ({ ...r }));
}

export async function fetchSystemHealth() {
  await delay(200);
  const webhookSuccess = webhookDeliveries.filter((w) => w.status === "Success").length;
  const webhookRate = Math.round((webhookSuccess / webhookDeliveries.length) * 100);
  return {
    stats: { ...healthStats },
    services: [...systemServices],
    apiResponseData: [...apiResponseData],
    errorLogs: [...errorLogs],
    webhooks: [...webhookDeliveries],
    webhookSuccessRate: webhookRate,
  };
}

export async function fetchTeamData() {
  await delay(200);
  return {
    members: [...teamMembers],
    activityLog: [...activityLog],
  };
}

export async function inviteTeamMember(params: { name: string; email: string; role: AdminRole }) {
  await delay(500);
  teamMembers.push({
    id: `tm-${Date.now()}`,
    name: params.name,
    email: params.email,
    role: params.role,
    lastLogin: "Never",
    status: "Active",
  });
  activityLog.unshift({
    id: `al-${Date.now()}`,
    adminName: "Fahad Khan",
    action: "Invited team member",
    entityAffected: `${params.name} (${params.role})`,
    timestamp: new Date().toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).replace(",", ""),
  });
}

export async function updateTeamMemberRole(id: string, role: AdminRole) {
  await delay(400);
  teamMembers = teamMembers.map((m) => (m.id === id ? { ...m, role } : m));
}

export async function deactivateTeamMember(id: string) {
  await delay(400);
  teamMembers = teamMembers.map((m) =>
    m.id === id ? { ...m, status: "Inactive" as const } : m
  );
}

export async function fetchAdminSettings() {
  await delay(200);
  return {
    platform: { ...platformSettings },
    feeConfig: feeConfig.map((f) => ({ ...f })),
    notifications: { ...notificationSettings },
    integrations: integrations.map((i) => ({ ...i })),
  };
}

export async function savePlatformSettings(settings: PlatformSettings) {
  await delay(400);
  platformSettings = { ...settings };
}

export async function saveFeeConfig(rows: FeeConfigRow[]) {
  await delay(400);
  feeConfig = rows.map((r) => ({ ...r }));
}

export async function saveNotificationSettings(settings: NotificationSettings) {
  await delay(400);
  notificationSettings = { ...settings };
}

export async function testIntegration(id: string) {
  await delay(800);
  integrations = integrations.map((i) =>
    i.id === id ? { ...i, status: "Connected" as const } : i
  );
  return { success: true, message: "Connection successful" };
}
