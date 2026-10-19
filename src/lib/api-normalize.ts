import type { AdminTransaction } from "@/admin-portal/types/finance";
import type {
  DashboardStats,
  DiscountHistory,
  EligibleInvoice,
  InvoiceDiscountStats,
  Merchant,
  PaymentBreakdown,
  PaymentMethod,
  TaxComplianceData,
  Transaction,
  TransactionStatus,
} from "@/types";
import type {
  DiscountRequest,
  Partner,
  PartnerDashboardData,
  PartnerDashboardStats,
  PartnerMerchant,
  PartnerRider,
  PartnerTransaction,
  RiskScore,
  TopMerchant,
  VolumeDataPoint,
} from "@/types/partner";

type Raw = Record<string, unknown>;

export function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function asString(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function pick(raw: Raw, ...keys: string[]): unknown {
  for (const key of keys) {
    if (raw[key] !== undefined && raw[key] !== null) return raw[key];
  }
  return undefined;
}

export function titleCasePaymentMethod(value: unknown): PaymentMethod {
  const s = asString(value).toLowerCase();
  if (s === "cash") return "Cash";
  if (s === "wallet") return "Wallet";
  return "NFC";
}

export function titleCaseTransactionStatus(value: unknown): TransactionStatus {
  const s = asString(value).toLowerCase();
  if (s === "pending") return "Pending";
  if (s === "failed") return "Failed";
  return "Completed";
}

export function titleCaseMerchantStatus(value: unknown): Merchant["status"] {
  const s = asString(value).toLowerCase();
  return s === "inactive" ? "Inactive" : "Active";
}

export function titleCaseRiskScore(value: unknown): RiskScore {
  const s = asString(value).toLowerCase();
  if (s === "medium") return "Medium";
  if (s === "high") return "High";
  return "Low";
}

export function titleCaseDiscountStatus(
  value: unknown
): DiscountRequest["status"] {
  const s = asString(value).toLowerCase().replace(/_/g, " ");
  if (s === "approved") return "Approved";
  if (s === "rejected") return "Rejected";
  if (s === "paid out" || s === "paid") return "Paid Out";
  return "Pending Approval";
}

export function normalizeAccountStatus(value: unknown): "active" | "pending" {
  const s = asString(value).toLowerCase();
  if (s.includes("pending")) return "pending";
  return "active";
}

const PAYMENT_COLORS: Record<string, string> = {
  NFC: "#00C896",
  Cash: "#3B82F6",
  Wallet: "#F59E0B",
};

const PAYMENT_LABELS: Record<string, string> = {
  nfc: "NFC",
  "nfc payment": "NFC",
  cash: "Cash",
  wallet: "Wallet",
};

export function normalizePaymentBreakdown(
  rows: unknown[]
): PaymentBreakdown[] {
  const mapped = rows.map((row) => {
    const raw = row as Raw;
    const nameRaw = asString(pick(raw, "name", "method", "paymentMethod"));
    const key = nameRaw.toLowerCase();
    const name = PAYMENT_LABELS[key] ?? (nameRaw || "NFC");
    return {
      name,
      value: asNumber(pick(raw, "value", "amount", "total")),
      color: asString(pick(raw, "color"), PAYMENT_COLORS[name] ?? "#00C896"),
    };
  });

  const total = mapped.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) {
    return mapped.map((item) => ({ ...item, value: 0 }));
  }

  return mapped.map((item) => ({
    ...item,
    value: Math.round((item.value / total) * 1000) / 10,
  }));
}

export function normalizeMerchantTransaction(raw: Raw): Transaction {
  return {
    id: asString(pick(raw, "id", "transaction_id")),
    date: asString(pick(raw, "date", "transaction_at", "createdAt")),
    orderId: asString(pick(raw, "orderId", "order_id")),
    merchantReference: asString(
      pick(
        raw,
        "merchantReference",
        "authorization_reference",
        "merchant_reference",
        "authRef"
      ) ?? pick(raw, "orderId", "order_id")
    ),
    customer: asString(pick(raw, "customer", "customer_name", "customerName")),
    amount: asNumber(pick(raw, "amount")),
    rider: asString(
      pick(raw, "rider", "riderName", "rider_name", "riderId", "rider_id")
    ),
    paymentMethod: titleCasePaymentMethod(
      pick(raw, "paymentMethod", "payment_method")
    ),
    platformFee: asNumber(pick(raw, "platformFee", "platform_fee")),
    tax: asNumber(pick(raw, "tax")),
    netAmount: asNumber(
      pick(raw, "netAmount", "net_amount", "netToMerchant", "net_to_merchant")
    ),
    status: titleCaseTransactionStatus(pick(raw, "status")),
    nfcTagId: pick(raw, "nfcTagId", "nfc_tag_id")
      ? asString(pick(raw, "nfcTagId", "nfc_tag_id"))
      : undefined,
    riderCut: asNumber(pick(raw, "riderCut", "rider_cut")),
  };
}

export function normalizeMerchantProfile(raw: Raw): Merchant {
  return {
    name: asString(pick(raw, "name", "businessName", "business_name")),
    jazzCashNumber: asString(
      pick(raw, "jazzCashNumber", "jazz_cash_number", "phone")
    ),
    status: titleCaseMerchantStatus(pick(raw, "status")),
    ownerName: asString(pick(raw, "ownerName", "owner_name")),
    cnic: asString(pick(raw, "cnic")),
    address: asString(pick(raw, "address", "city")),
    businessType: asString(
      pick(raw, "businessType", "business_type", "category")
    ),
    bankName: asString(pick(raw, "bankName", "bank_name")),
    bankAccount: asString(pick(raw, "bankAccount", "bank_account")),
    settlementFrequency:
      (pick(raw, "settlementFrequency", "settlement_frequency") as
        | Merchant["settlementFrequency"]
        | undefined) ?? "Daily",
  };
}

export function normalizeDashboardStats(raw: Raw): DashboardStats {
  return {
    walletBalance: asNumber(pick(raw, "walletBalance", "wallet_balance")),
    walletChangeToday: asNumber(
      pick(raw, "walletChangeToday", "wallet_change_today")
    ),
    pendingSettlement: asNumber(
      pick(raw, "pendingSettlement", "pending_settlement")
    ),
    pendingPayoutDays: asNumber(
      pick(raw, "pendingPayoutDays", "pending_payout_days")
    ),
    monthEarnings: asNumber(pick(raw, "monthEarnings", "month_earnings")),
    monthEarningsChangePercent: asNumber(
      pick(raw, "monthEarningsChangePercent", "month_earnings_change_percent")
    ),
    taxHeld: asNumber(pick(raw, "taxHeld", "tax_held")),
  };
}

export function normalizeEligibleInvoice(raw: Raw): EligibleInvoice {
  return {
    id: asString(pick(raw, "id")),
    batchDate: asString(pick(raw, "batchDate", "batch_date", "createdAt")),
    orderCount: asNumber(pick(raw, "orderCount", "order_count")),
    totalAmount: asNumber(pick(raw, "totalAmount", "total_amount")),
    discountFeePercent: asNumber(
      pick(raw, "discountFeePercent", "discount_fee_percent")
    ),
    amountAfterDiscount: asNumber(
      pick(raw, "amountAfterDiscount", "amount_after_discount")
    ),
    discountFee: asNumber(pick(raw, "discountFee", "discount_fee")),
  };
}

export function normalizeDiscountHistory(raw: Raw): DiscountHistory {
  const requestDate = asString(
    pick(raw, "requestDate", "request_date", "createdAt")
  );
  return {
    id: asString(pick(raw, "id")),
    requestDate,
    invoiceBatch: asString(
      pick(raw, "invoiceBatch", "invoice_batch", "batchDate", "batch_date"),
      requestDate
    ),
    amount: asNumber(pick(raw, "amount", "invoiceAmount", "invoice_amount")),
    fee: asNumber(pick(raw, "fee", "discountFee", "discount_fee")),
    received: asNumber(
      pick(raw, "received", "amountReceived", "amount_received", "payoutAmount")
    ),
    status: titleCaseDiscountStatus(pick(raw, "status")) as DiscountHistory["status"],
  };
}

export function normalizeInvoiceStats(raw: Raw): InvoiceDiscountStats {
  return {
    availableForDiscounting: asNumber(
      pick(raw, "availableForDiscounting", "available_for_discounting")
    ),
    totalDiscountedThisMonth: asNumber(
      pick(raw, "totalDiscountedThisMonth", "total_discounted_this_month")
    ),
  };
}

export function parseTaxRate(value: unknown): number {
  if (typeof value === "number") return value;
  const s = asString(value).replace("%", "").trim();
  return asNumber(s);
}

export function normalizeTaxComplianceData(raw: Raw): TaxComplianceData {
  const stats = (pick(raw, "stats") ?? raw) as Raw;
  const months = (pick(raw, "months") ?? []) as Raw[];
  const summary = (pick(raw, "summary") ?? {}) as Raw;
  const documents = (pick(raw, "documents") ?? []) as Raw[];

  return {
    stats: {
      totalTaxCollectedYear: asNumber(
        pick(stats, "totalTaxCollectedYear", "total_tax_collected_year")
      ),
      totalTaxFiled: asNumber(
        pick(stats, "totalTaxFiled", "total_tax_filed")
      ),
      nextFilingDate: asString(
        pick(stats, "nextFilingDate", "next_filing_date")
      ),
    },
    months: months.map((m) => ({
      month: asString(pick(m, "month")),
      totalRevenue: asNumber(pick(m, "totalRevenue", "total_revenue")),
      taxRate: parseTaxRate(pick(m, "taxRate", "tax_rate")),
      taxAmount: asNumber(pick(m, "taxAmount", "tax_amount")),
      status: (asString(pick(m, "status"), "Pending") === "Filed"
        ? "Filed"
        : "Pending") as TaxComplianceData["months"][0]["status"],
    })),
    summary: {
      month: asString(pick(summary, "month")),
      wht: asNumber(pick(summary, "wht")),
      gst: asNumber(pick(summary, "gst")),
      total: asNumber(pick(summary, "total")),
    },
    documents: documents.map((d) => ({
      id: asString(pick(d, "id")),
      month: asString(pick(d, "month")),
      dateGenerated: asString(
        pick(d, "dateGenerated", "date_generated", "createdAt")
      ),
    })),
  };
}

export function normalizePartnerTransaction(raw: Raw): PartnerTransaction {
  return {
    id: asString(pick(raw, "id")),
    date: asString(pick(raw, "date", "transaction_at")),
    orderId: asString(pick(raw, "orderId", "order_id")),
    merchant: asString(pick(raw, "merchant", "merchantName", "merchant_name")),
    merchantId: asString(pick(raw, "merchantId", "merchant_id")),
    rider: asString(pick(raw, "rider", "riderName", "rider_name")),
    customerReference: asString(
      pick(raw, "customerReference", "customer_reference", "merchantReference")
    ),
    amount: asNumber(pick(raw, "amount")),
    paymentMethod: titleCasePaymentMethod(
      pick(raw, "paymentMethod", "payment_method")
    ),
    platformFee: asNumber(pick(raw, "platformFee", "platform_fee")),
    tax: asNumber(pick(raw, "tax")),
    netToMerchant: asNumber(
      pick(raw, "netToMerchant", "net_to_merchant", "netAmount", "net_amount")
    ),
    status: titleCaseTransactionStatus(pick(raw, "status")),
    riderCut: asNumber(pick(raw, "riderCut", "rider_cut")),
    nfcTagId: pick(raw, "nfcTagId", "nfc_tag_id")
      ? asString(pick(raw, "nfcTagId", "nfc_tag_id"))
      : undefined,
  };
}

export function normalizeDiscountRequest(raw: Raw): DiscountRequest {
  const riskRaw = pick(raw, "riskScore", "risk_score", "riskLevel", "risk_level");
  return {
    id: asString(pick(raw, "id")),
    requestDate: asString(
      pick(raw, "requestDate", "request_date", "createdAt")
    ),
    merchantName: asString(
      pick(raw, "merchantName", "merchant_name", "merchant")
    ),
    invoiceAmount: asNumber(
      pick(raw, "invoiceAmount", "invoice_amount", "amount")
    ),
    discountFee: asNumber(pick(raw, "discountFee", "discount_fee", "fee")),
    amountToPayOut: asNumber(
      pick(
        raw,
        "amountToPayOut",
        "amount_to_pay_out",
        "payoutAmount",
        "payout_amount"
      )
    ),
    riskScore: titleCaseRiskScore(riskRaw),
    status: titleCaseDiscountStatus(pick(raw, "status")),
  };
}

export function normalizePartnerMerchant(raw: Raw): PartnerMerchant {
  return {
    id: asString(pick(raw, "id")),
    name: asString(pick(raw, "name")),
    city: asString(pick(raw, "city")),
    category: asString(pick(raw, "category")) as PartnerMerchant["category"],
    volumeThisMonth: asNumber(
      pick(raw, "volumeThisMonth", "volume_this_month")
    ),
    pendingSettlement: asNumber(
      pick(raw, "pendingSettlement", "pending_settlement")
    ),
    activeRiders: asNumber(pick(raw, "activeRiders", "active_riders")),
    status: asString(pick(raw, "status"), "Active") as PartnerMerchant["status"],
    ownerName: asString(pick(raw, "ownerName", "owner_name")),
    cnic: asString(pick(raw, "cnic")),
    phone: asString(pick(raw, "phone")),
    jazzCashNumber: asString(
      pick(raw, "jazzCashNumber", "jazz_cash_number")
    ),
    monthlyExpectedVolume: asNumber(
      pick(raw, "monthlyExpectedVolume", "monthly_expected_volume")
    ),
  };
}

export function normalizePartnerProfile(raw: Raw): Partner {
  return {
    name: asString(pick(raw, "name", "businessName", "business_name")),
    companyType: asString(pick(raw, "companyType", "company_type")),
    contactEmail: asString(
      pick(raw, "contactEmail", "contact_email", "email")
    ),
    contactPerson: asString(
      pick(raw, "contactPerson", "contact_person", "ownerName", "owner_name")
    ),
    phone: asString(pick(raw, "phone")),
    address: asString(pick(raw, "address", "city")),
    ntn: asString(pick(raw, "ntn")),
  };
}

export function normalizePartnerDashboardStats(raw: Raw): PartnerDashboardStats {
  return {
    totalMerchants: asNumber(pick(raw, "totalMerchants", "total_merchants")),
    merchantsAddedThisMonth: asNumber(
      pick(raw, "merchantsAddedThisMonth", "merchants_added_this_month")
    ),
    activeRidersToday: asNumber(
      pick(raw, "activeRidersToday", "active_riders_today")
    ),
    totalRiders: asNumber(pick(raw, "totalRiders", "total_riders")),
    todayVolume: asNumber(pick(raw, "todayVolume", "today_volume")),
    volumeChangePercent: asNumber(
      pick(raw, "volumeChangePercent", "volume_change_percent")
    ),
    pendingSettlements: asNumber(
      pick(raw, "pendingSettlements", "pending_settlements")
    ),
    pendingMerchantsCount: asNumber(
      pick(raw, "pendingMerchantsCount", "pending_merchants_count")
    ),
    platformFeesCollected: asNumber(
      pick(raw, "platformFeesCollected", "platform_fees_collected")
    ),
    taxAutoFiled: asNumber(pick(raw, "taxAutoFiled", "tax_auto_filed")),
  };
}

export function normalizePartnerDashboard(raw: Raw): PartnerDashboardData {
  const statsRaw = (pick(raw, "stats") ?? {}) as Raw;
  const volume = (pick(raw, "volume") ?? []) as Raw[];
  const topMerchants = (pick(raw, "topMerchants", "top_merchants") ?? []) as Raw[];
  const activity = (pick(raw, "activity") ?? []) as Raw[];

  return {
    stats: normalizePartnerDashboardStats(statsRaw),
    volume: volume.map((v) => ({
      date: asString(pick(v, "date")),
      label: asString(pick(v, "label")),
      volume: asNumber(pick(v, "volume")),
      settlements: asNumber(pick(v, "settlements")),
    })),
    topMerchants: topMerchants.map((m) => ({
      id: asString(pick(m, "id")),
      name: asString(pick(m, "name")),
      todayVolume: asNumber(pick(m, "todayVolume", "today_volume")),
      sharePercent: asNumber(pick(m, "sharePercent", "share_percent")),
    })) as TopMerchant[],
    activity: activity.map((e) => ({
      id: asString(pick(e, "id")),
      type: asString(pick(e, "type"), "transaction") as PartnerDashboardData["activity"][0]["type"],
      description: asString(pick(e, "description")),
      merchant: asString(pick(e, "merchant", "merchantName")),
      amount: pick(e, "amount") != null ? asNumber(pick(e, "amount")) : undefined,
      timeAgo: asString(pick(e, "timeAgo", "time_ago", "timestamp")),
    })),
  };
}

type LegacyPartnerRider = Partial<PartnerRider> & {
  id: string;
  name: string;
  assignedMerchants?: string[];
  assigned_merchants?: string[];
};

const emptyWeek: PartnerRider["dailyEarnings"] = [
  { day: "Mon", amount: 0, deliveries: 0 },
  { day: "Tue", amount: 0, deliveries: 0 },
  { day: "Wed", amount: 0, deliveries: 0 },
  { day: "Thu", amount: 0, deliveries: 0 },
  { day: "Fri", amount: 0, deliveries: 0 },
  { day: "Sat", amount: 0, deliveries: 0 },
  { day: "Sun", amount: 0, deliveries: 0 },
];

export function normalizePartnerRider(rider: LegacyPartnerRider): PartnerRider {
  const raw = rider as Raw;
  const pickupMerchants =
    rider.pickupMerchants ??
    rider.assignedMerchants ??
    (raw.assigned_merchants as string[] | undefined) ??
    [];
  const deliveryCount =
    asNumber(rider.nfcPaymentsCount) + asNumber(rider.cashCollections);

  return {
    id: rider.id,
    name: rider.name,
    phone: asString(rider.phone),
    cnic: asString(rider.cnic),
    city: asString(rider.city),
    pickupMerchants,
    activeZone: asString(rider.activeZone ?? rider.city, "—"),
    deliveriesToday: asNumber(rider.deliveriesToday, deliveryCount),
    completedDeliveriesToday: asNumber(
      rider.completedDeliveriesToday,
      asNumber(rider.nfcPaymentsCount)
    ),
    lastSeenAt: asString(rider.lastSeenAt, "Unknown"),
    lastSeenArea: asString(rider.lastSeenArea ?? rider.city, "—"),
    todayCollections: asNumber(rider.todayCollections),
    totalThisMonth: asNumber(rider.totalThisMonth),
    nfcPaymentsCount: asNumber(rider.nfcPaymentsCount),
    cashCollections: asNumber(rider.cashCollections),
    status: (asString(rider.status, "Inactive") as PartnerRider["status"]),
    recentDeliveries: rider.recentDeliveries ?? [],
    dailyEarnings: rider.dailyEarnings ?? emptyWeek,
  };
}

export function normalizeAdminTransaction(raw: Raw): AdminTransaction {
  return {
    id: asString(pick(raw, "id")),
    date: asString(pick(raw, "date", "transaction_at")),
    partnerId: asString(pick(raw, "partnerId", "partner_id")),
    partnerName: asString(pick(raw, "partnerName", "partner_name", "partner")),
    merchantId: asString(pick(raw, "merchantId", "merchant_id")),
    merchant: asString(pick(raw, "merchant", "merchantName", "merchant_name")),
    rider: asString(pick(raw, "rider", "riderName", "rider_name")),
    orderId: asString(pick(raw, "orderId", "order_id")),
    customerReference: asString(
      pick(raw, "customerReference", "customer_reference")
    ),
    amount: asNumber(pick(raw, "amount")),
    paymentMethod: titleCasePaymentMethod(
      pick(raw, "paymentMethod", "payment_method")
    ),
    platformFee: asNumber(pick(raw, "platformFee", "platform_fee")),
    tax: asNumber(pick(raw, "tax")),
    netToMerchant: asNumber(
      pick(raw, "netToMerchant", "net_to_merchant", "netAmount")
    ),
    riderCut: asNumber(pick(raw, "riderCut", "rider_cut")),
    status: titleCaseTransactionStatus(pick(raw, "status")),
    nfcTagId: pick(raw, "nfcTagId", "nfc_tag_id")
      ? asString(pick(raw, "nfcTagId", "nfc_tag_id"))
      : undefined,
    auditTrail: Array.isArray(pick(raw, "auditTrail", "audit_trail"))
      ? ((pick(raw, "auditTrail", "audit_trail") as Raw[]).map((e) => ({
          state: asString(pick(e, "state")),
          timestamp: asString(pick(e, "timestamp")),
          detail: pick(e, "detail") ? asString(pick(e, "detail")) : undefined,
        })) as AdminTransaction["auditTrail"])
      : [],
  };
}

export function normalizeVolumePoint(raw: Raw): VolumeDataPoint {
  return {
    date: asString(pick(raw, "date")),
    label: asString(pick(raw, "label")),
    volume: asNumber(pick(raw, "volume")),
    settlements: asNumber(pick(raw, "settlements")),
  };
}
