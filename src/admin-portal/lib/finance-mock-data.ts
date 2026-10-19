import { subDays } from "date-fns";
import type {
  AdminCompletedSettlement,
  AdminDiscountRequest,
  AdminPendingSettlement,
  AdminProcessingSettlement,
  AdminTransaction,
  DiscountingRulesEngine,
  SettlementSummary,
  TransactionAuditEvent,
} from "@/admin-portal/types/finance";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const partners = [
  { id: "p1", name: "Leopards Courier Services" },
  { id: "p2", name: "Foodpanda Pakistan" },
  { id: "p3", name: "Daraz.pk" },
  { id: "p4", name: "TCS Connect" },
];

const merchants = [
  { id: "m1", name: "KFC Gulberg", partnerId: "p1" },
  { id: "m2", name: "Hardees DHA", partnerId: "p1" },
  { id: "m3", name: "Gourmet Bakers", partnerId: "p2" },
  { id: "m4", name: "Al-Fatah Store", partnerId: "p3" },
  { id: "m5", name: "Pizza Hut MM Alam", partnerId: "p2" },
  { id: "m8", name: "Metro Cash & Carry", partnerId: "p3" },
  { id: "m7", name: "Bundu Khan", partnerId: "p2" },
  { id: "m10", name: "Naheed Supermarket", partnerId: "p3" },
];

const riders = ["Ahmed Raza", "Bilal Hassan", "Sara Khan", "Usman Ali", "Hamza Tariq", "Fatima Shah"];

function buildAudit(status: AdminTransaction["status"], method: string): TransactionAuditEvent[] {
  const base: TransactionAuditEvent[] = [
    { state: "Created", timestamp: "14:28:01", detail: "Order initiated by merchant POS" },
  ];
  if (method === "NFC") {
    base.push({ state: "NFC Tapped", timestamp: "14:28:18", detail: "Customer tapped NFC tag" });
  }
  base.push({ state: "Processing", timestamp: "14:28:22", detail: "Payment gateway processing" });
  if (status === "Completed") {
    base.push({ state: "Completed", timestamp: "14:28:31", detail: "Funds split and settled to merchant wallet" });
  } else if (status === "Failed") {
    base.push({ state: "Failed", timestamp: "14:28:29", detail: "Jazz Cash timeout — payment reversed" });
  } else {
    base.push({ state: "Pending", timestamp: "14:28:25", detail: "Awaiting wallet confirmation" });
  }
  return base;
}

const adminTransactions: AdminTransaction[] = Array.from({ length: 40 }, (_, i) => {
  const amount = 1500 + Math.floor(Math.random() * 12000);
  const platformFee = Math.round(amount * 0.025);
  const tax = Math.round(amount * 0.05);
  const riderCut = Math.round(amount * 0.08);
  const date = subDays(new Date(), i % 14);
  date.setHours(9 + (i % 12), (i * 7) % 60, 0, 0);
  const merchant = merchants[i % merchants.length];
  const partner = partners.find((p) => p.id === merchant.partnerId)!;
  const method = (["NFC", "Cash", "Wallet"] as const)[i % 3];
  const status = (["Completed", "Completed", "Completed", "Pending", "Failed"] as const)[i % 5];
  return {
    id: `atx-${i + 1}`,
    date: date.toISOString(),
    partnerId: partner.id,
    partnerName: partner.name,
    merchantId: merchant.id,
    merchant: merchant.name,
    rider: riders[i % riders.length],
    orderId: `ORD-${8800 - i}`,
    customerReference: `CUST-${12000 + i}`,
    amount,
    paymentMethod: method,
    platformFee,
    tax,
    netToMerchant: amount - platformFee - tax - riderCut,
    riderCut,
    status,
    nfcTagId: method === "NFC" ? `NFC-${8000 + i}` : undefined,
    auditTrail: buildAudit(status, method),
  };
});

let pendingSettlements: AdminPendingSettlement[] = [
  { id: "aps1", partnerId: "p1", partnerName: "Leopards Courier Services", merchantId: "m1", merchantName: "KFC Gulberg", ordersCount: 48, grossAmount: 192800, platformFee: 4820, tax: 9640, netPayable: 48200, dueDate: "27/06/2025" },
  { id: "aps2", partnerId: "p1", partnerName: "Leopards Courier Services", merchantId: "m2", merchantName: "Hardees DHA", ordersCount: 36, grossAmount: 153600, platformFee: 3840, tax: 7680, netPayable: 38400, dueDate: "27/06/2025" },
  { id: "aps3", partnerId: "p2", partnerName: "Foodpanda Pakistan", merchantId: "m3", merchantName: "Gourmet Bakers", ordersCount: 32, grossAmount: 128400, platformFee: 3210, tax: 6420, netPayable: 32100, dueDate: "26/06/2025" },
  { id: "aps4", partnerId: "p2", partnerName: "Foodpanda Pakistan", merchantId: "m5", merchantName: "Pizza Hut MM Alam", ordersCount: 28, grossAmount: 102400, platformFee: 2560, tax: 5120, netPayable: 25600, dueDate: "26/06/2025" },
  { id: "aps5", partnerId: "p3", partnerName: "Daraz.pk", merchantId: "m8", merchantName: "Metro Cash & Carry", ordersCount: 64, grossAmount: 233600, platformFee: 5840, tax: 11680, netPayable: 58400, dueDate: "25/06/2025" },
  { id: "aps6", partnerId: "p3", partnerName: "Daraz.pk", merchantId: "m10", merchantName: "Naheed Supermarket", ordersCount: 42, grossAmount: 152800, platformFee: 3820, tax: 7640, netPayable: 38200, dueDate: "24/06/2025" },
  { id: "aps7", partnerId: "p2", partnerName: "Foodpanda Pakistan", merchantId: "m7", merchantName: "Bundu Khan", ordersCount: 22, grossAmount: 89600, platformFee: 2240, tax: 4480, netPayable: 22400, dueDate: "23/06/2025" },
  { id: "aps8", partnerId: "p3", partnerName: "Daraz.pk", merchantId: "m4", merchantName: "Al-Fatah Store", ordersCount: 18, grossAmount: 72400, platformFee: 1810, tax: 3620, netPayable: 18100, dueDate: "22/06/2025" },
];

const processingSettlements: AdminProcessingSettlement[] = [
  { id: "proc1", partnerName: "Leopards Courier Services", merchantName: "KFC Gulberg", amount: 48200, status: "Processing", startedAt: "14:35:12", progress: 72 },
  { id: "proc2", partnerName: "Daraz.pk", merchantName: "Metro Cash & Carry", amount: 58400, status: "Queued", startedAt: "14:36:01", progress: 15 },
];

let completedSettlements: AdminCompletedSettlement[] = [
  { id: "acs1", date: "27/06/2025", partnerName: "Leopards Courier Services", merchant: "KFC Gulberg", amount: 48200, method: "Jazz Cash", referenceId: "JC-SET-8821", status: "Completed" },
  { id: "acs2", date: "27/06/2025", partnerName: "Foodpanda Pakistan", merchant: "Hardees DHA", amount: 38400, method: "Jazz Cash", referenceId: "JC-SET-8819", status: "Completed" },
  { id: "acs3", date: "26/06/2025", partnerName: "Daraz.pk", merchant: "Metro Cash & Carry", amount: 58400, method: "Bank", referenceId: "BNK-SET-4421", status: "Completed" },
  { id: "acs4", date: "26/06/2025", partnerName: "TCS Connect", merchant: "Gourmet Bakers", amount: 32100, method: "Jazz Cash", referenceId: "JC-SET-8815", status: "Processing" },
  { id: "acs5", date: "25/06/2025", partnerName: "Foodpanda Pakistan", merchant: "Cheezious F-7", amount: 16800, method: "Jazz Cash", referenceId: "JC-SET-8802", status: "Failed", errorMessage: "Jazz Cash API Error 503: Insufficient float balance in merchant wallet. Retry after float top-up." },
  { id: "acs6", date: "25/06/2025", partnerName: "Leopards Courier Services", merchant: "Pizza Hut MM Alam", amount: 25600, method: "Jazz Cash", referenceId: "JC-SET-8801", status: "Failed", errorMessage: "Jazz Cash API Error 422: Invalid beneficiary account. CNIC mismatch on registered Jazz Cash number." },
];

let discountRequests: AdminDiscountRequest[] = [
  { id: "adr1", requestDate: "27/06/2025", partnerId: "p1", partnerName: "Leopards Courier Services", merchantName: "KFC Gulberg", invoiceAmount: 48200, discountFeePercent: 2, discountFee: 964, payoutAmount: 47236, riskScore: 22, riskLevel: "Low", riskFactors: ["Verified business", "Consistent volume"], status: "Pending Approval", requestedBy: "Hassan Malik" },
  { id: "adr2", requestDate: "27/06/2025", partnerId: "p2", partnerName: "Foodpanda Pakistan", merchantName: "Pizza Hut DHA", invoiceAmount: 62400, discountFeePercent: 3.5, discountFee: 2184, payoutAmount: 60216, riskScore: 58, riskLevel: "Medium", riskFactors: ["High volume spike", "New discount request"], status: "Pending Approval", requestedBy: "Sara Ahmed" },
  { id: "adr3", requestDate: "27/06/2025", partnerId: "p2", partnerName: "Foodpanda Pakistan", merchantName: "Gourmet Bakers", invoiceAmount: 32100, discountFeePercent: 2, discountFee: 642, payoutAmount: 31458, riskScore: 28, riskLevel: "Low", riskFactors: ["Verified business", "Good repayment history"], status: "Pending Approval", requestedBy: "Fatima Khan" },
  { id: "adr4", requestDate: "26/06/2025", partnerId: "p3", partnerName: "Daraz.pk", merchantName: "Al-Fatah Store", invoiceAmount: 92000, discountFeePercent: 5, discountFee: 4600, payoutAmount: 87400, riskScore: 78, riskLevel: "High", riskFactors: ["New merchant", "Previous late payment"], status: "Pending Approval", requestedBy: "Usman Sheikh" },
  { id: "adr5", requestDate: "26/06/2025", partnerId: "p1", partnerName: "Leopards Courier Services", merchantName: "Hardees DHA", invoiceAmount: 38400, discountFeePercent: 2, discountFee: 768, payoutAmount: 37632, riskScore: 31, riskLevel: "Low", riskFactors: ["Verified business"], status: "Approved", requestedBy: "Ali Raza" },
  { id: "adr6", requestDate: "26/06/2025", partnerId: "p3", partnerName: "Daraz.pk", merchantName: "Metro Cash & Carry", invoiceAmount: 58400, discountFeePercent: 2, discountFee: 1168, payoutAmount: 57232, riskScore: 18, riskLevel: "Low", riskFactors: ["Top performer", "Verified business"], status: "Paid Out", requestedBy: "Zainab Ali" },
  { id: "adr7", requestDate: "27/06/2025", partnerId: "p6", partnerName: "Bykea", merchantName: "Bundu Khan", invoiceAmount: 22400, discountFeePercent: 3.5, discountFee: 784, payoutAmount: 21616, riskScore: 45, riskLevel: "Medium", riskFactors: ["Volume spike"], status: "Pending Approval", requestedBy: "Omar Farooq" },
  { id: "adr8", requestDate: "27/06/2025", partnerId: "p2", partnerName: "Foodpanda Pakistan", merchantName: "Cheezious F-7", invoiceAmount: 16800, discountFeePercent: 2, discountFee: 336, payoutAmount: 16464, riskScore: 15, riskLevel: "Low", riskFactors: ["Verified business", "Low risk profile"], status: "Pending Approval", requestedBy: "Hamza Tariq" },
  { id: "adr9", requestDate: "27/06/2025", partnerId: "p3", partnerName: "Daraz.pk", merchantName: "Naheed Supermarket", invoiceAmount: 38200, discountFeePercent: 2, discountFee: 764, payoutAmount: 37436, riskScore: 24, riskLevel: "Low", riskFactors: ["Consistent volume"], status: "Pending Approval", requestedBy: "Ayesha Noor" },
  { id: "adr10", requestDate: "26/06/2025", partnerId: "p4", partnerName: "TCS Connect", merchantName: "Hardees Johar Town", invoiceAmount: 18200, discountFeePercent: 5, discountFee: 910, payoutAmount: 17290, riskScore: 82, riskLevel: "High", riskFactors: ["New merchant", "High volume spike", "Pending approval merchant"], status: "Rejected", requestedBy: "Bilal Hassan" },
];

let rulesEngine: DiscountingRulesEngine = {
  merchantAgeWeight: 25,
  volumeConsistencyWeight: 30,
  repaymentHistoryWeight: 25,
  partnerReputationWeight: 20,
};

export async function fetchAdminTransactions() {
  await delay(200);
  return [...adminTransactions];
}

export async function fetchAdminSettlements() {
  await delay(200);
  const summary: SettlementSummary = {
    totalPending: pendingSettlements.reduce((s, p) => s + p.netPayable, 0),
    processedToday: 86600,
    processedThisMonth: 2840000,
    failedCount: completedSettlements.filter((s) => s.status === "Failed").length,
  };
  return {
    summary,
    pending: [...pendingSettlements],
    processing: [...processingSettlements],
    completed: [...completedSettlements],
  };
}

export async function fetchAdminDiscountRequests() {
  await delay(200);
  const pending = discountRequests.filter((r) => r.status === "Pending Approval");
  return {
    requests: [...discountRequests],
    stats: {
      pendingRequests: pending.length,
      approvedToday: discountRequests.filter((r) => r.status === "Approved" && r.requestDate === "27/06/2025").length + 2,
      rejectedToday: discountRequests.filter((r) => r.status === "Rejected" && r.requestDate === "27/06/2025").length,
      discountedThisMonth: discountRequests.filter((r) => r.status === "Paid Out").reduce((s, r) => s + r.payoutAmount, 0) + 186400,
    },
  };
}

export async function fetchDiscountingRules() {
  await delay(100);
  return { ...rulesEngine };
}

export async function settleMerchantSettlement(id: string) {
  await delay(500);
  const item = pendingSettlements.find((s) => s.id === id);
  if (!item) return;
  pendingSettlements = pendingSettlements.filter((s) => s.id !== id);
  processingSettlements.push({
    id: `proc-${Date.now()}`,
    partnerName: item.partnerName,
    merchantName: item.merchantName,
    amount: item.netPayable,
    status: "Processing",
    startedAt: new Date().toLocaleTimeString("en-GB"),
    progress: 10,
  });
}

export async function bulkSettlePartner(partnerId: string) {
  await delay(800);
  const items = pendingSettlements.filter((s) => s.partnerId === partnerId);
  pendingSettlements = pendingSettlements.filter((s) => s.partnerId !== partnerId);
  items.forEach((item) => {
    processingSettlements.push({
      id: `proc-${item.id}`,
      partnerName: item.partnerName,
      merchantName: item.merchantName,
      amount: item.netPayable,
      status: "Queued",
      startedAt: new Date().toLocaleTimeString("en-GB"),
      progress: 5,
    });
  });
  return items;
}

export async function retryFailedSettlement(id: string) {
  await delay(500);
  completedSettlements = completedSettlements.map((s) =>
    s.id === id ? { ...s, status: "Processing" as const, errorMessage: undefined } : s
  );
}

export async function approveDiscountRequest(id: string) {
  await delay(400);
  discountRequests = discountRequests.map((r) =>
    r.id === id ? { ...r, status: "Approved" as const } : r
  );
}

export async function rejectDiscountRequest(id: string) {
  await delay(400);
  discountRequests = discountRequests.map((r) =>
    r.id === id ? { ...r, status: "Rejected" as const } : r
  );
}

export async function bulkApproveDiscountRequests(ids: string[]) {
  await delay(600);
  discountRequests = discountRequests.map((r) =>
    ids.includes(r.id) && r.riskLevel === "Low" ? { ...r, status: "Approved" as const } : r
  );
}

export async function saveDiscountingRules(rules: DiscountingRulesEngine) {
  await delay(300);
  rulesEngine = { ...rules };
}
