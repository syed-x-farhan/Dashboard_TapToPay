import { subDays, format } from "date-fns";
import type {
  DashboardStats,
  DiscountHistory,
  EarningsDataPoint,
  EligibleInvoice,
  Merchant,
  NotificationSettings,
  PaymentBreakdown,
  TaxDocument,
  TaxMonthRow,
  TaxStats,
  TaxSummary,
  Transaction,
} from "@/types";

export const merchant: Merchant = {
  name: "KFC Gulberg Branch",
  jazzCashNumber: "0300-1234567",
  status: "Active",
  ownerName: "Hassan Malik",
  cnic: "35202-1234567-1",
  address: "Shop 12, MM Alam Road, Gulberg III, Lahore",
  businessType: "Quick Service Restaurant",
  bankName: "Meezan Bank",
  bankAccount: "0123-4567890-1",
  settlementFrequency: "Daily",
};

export const dashboardStats: DashboardStats = {
  walletBalance: 124500,
  walletChangeToday: 3200,
  pendingSettlement: 48200,
  pendingPayoutDays: 3,
  monthEarnings: 284000,
  monthEarningsChangePercent: 12,
  taxHeld: 8400,
};

const riders = ["Ahmed", "Bilal", "Sara"];
const customers = [
  "Ali Raza",
  "Fatima Khan",
  "Usman Sheikh",
  "Ayesha Noor",
  "Hamza Tariq",
  "Zainab Ali",
  "Omar Farooq",
  "Hina Shah",
];
const methods: Array<"NFC" | "Cash" | "Wallet"> = ["NFC", "Cash", "Wallet"];
const statuses: Array<"Completed" | "Pending" | "Failed"> = [
  "Completed",
  "Completed",
  "Completed",
  "Completed",
  "Pending",
  "Failed",
];

function generateTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  for (let i = 0; i < 20; i++) {
    const amount = 800 + Math.floor(Math.random() * 4200);
    const platformFee = Math.round(amount * 0.025);
    const tax = Math.round(amount * 0.05);
    const riderCut = Math.round(amount * 0.08);
    const netAmount = amount - platformFee - tax - riderCut;
    const date = subDays(new Date(), i % 14);
    date.setHours(10 + (i % 10), (i * 7) % 60, 0, 0);

    transactions.push({
      id: `txn-${4521 - i}`,
      date: date.toISOString(),
      orderId: `ORD-${4521 - i}`,
      merchantReference: `REF-KFC-${1000 + i}`,
      customer: customers[i % customers.length],
      amount,
      rider: riders[i % riders.length],
      paymentMethod: methods[i % methods.length],
      platformFee,
      tax,
      netAmount,
      status: statuses[i % statuses.length],
      nfcTagId: methods[i % methods.length] === "NFC" ? `NFC-TAG-${8000 + i}` : undefined,
      riderCut,
    });
  }
  return transactions;
}

export const transactions = generateTransactions();

export const dailyEarnings: EarningsDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = subDays(new Date(), 29 - i);
  return {
    date: format(date, "yyyy-MM-dd"),
    label: format(date, "dd MMM"),
    earnings: 6000 + Math.floor(Math.random() * 14000),
  };
});

export const weeklyEarnings: EarningsDataPoint[] = Array.from({ length: 12 }, (_, i) => ({
  date: `week-${i + 1}`,
  label: `W${i + 1}`,
  earnings: 45000 + Math.floor(Math.random() * 35000),
}));

export const monthlyEarnings: EarningsDataPoint[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
].map((month, i) => ({
  date: `month-${i + 1}`,
  label: month,
  earnings: 180000 + Math.floor(Math.random() * 120000),
}));

export const paymentBreakdown: PaymentBreakdown[] = [
  { name: "NFC Payments", value: 62, color: "#00C896" },
  { name: "Cash", value: 28, color: "#3B82F6" },
  { name: "Wallet", value: 10, color: "#F59E0B" },
];

export const eligibleInvoices: EligibleInvoice[] = [
  {
    id: "inv-1",
    batchDate: "24/06/2025",
    orderCount: 48,
    totalAmount: 18200,
    discountFeePercent: 2.5,
    discountFee: 455,
    amountAfterDiscount: 17745,
  },
  {
    id: "inv-2",
    batchDate: "22/06/2025",
    orderCount: 36,
    totalAmount: 14500,
    discountFeePercent: 2.5,
    discountFee: 363,
    amountAfterDiscount: 14137,
  },
  {
    id: "inv-3",
    batchDate: "20/06/2025",
    orderCount: 52,
    totalAmount: 9800,
    discountFeePercent: 2.5,
    discountFee: 245,
    amountAfterDiscount: 9555,
  },
  {
    id: "inv-4",
    batchDate: "18/06/2025",
    orderCount: 29,
    totalAmount: 5700,
    discountFeePercent: 2.5,
    discountFee: 143,
    amountAfterDiscount: 5557,
  },
];

export const discountHistory: DiscountHistory[] = [
  {
    id: "disc-1",
    requestDate: "15/06/2025",
    invoiceBatch: "Batch 15-Jun-2025",
    amount: 22400,
    fee: 560,
    received: 21840,
    status: "Paid Out",
  },
  {
    id: "disc-2",
    requestDate: "08/06/2025",
    invoiceBatch: "Batch 08-Jun-2025",
    amount: 18600,
    fee: 465,
    received: 18135,
    status: "Approved",
  },
  {
    id: "disc-3",
    requestDate: "01/06/2025",
    invoiceBatch: "Batch 01-Jun-2025",
    amount: 31200,
    fee: 780,
    received: 30420,
    status: "Paid Out",
  },
  {
    id: "disc-4",
    requestDate: "25/05/2025",
    invoiceBatch: "Batch 25-May-2025",
    amount: 9800,
    fee: 245,
    received: 9555,
    status: "Rejected",
  },
  {
    id: "disc-5",
    requestDate: "18/05/2025",
    invoiceBatch: "Batch 18-May-2025",
    amount: 42000,
    fee: 1050,
    received: 40950,
    status: "Pending Approval",
  },
];

export const taxStats: TaxStats = {
  totalTaxCollectedYear: 98400,
  totalTaxFiled: 91200,
  nextFilingDate: "15/07/2025",
};

export const taxMonthRows: TaxMonthRow[] = [
  { month: "January 2025", totalRevenue: 245000, taxRate: 5, taxAmount: 12250, status: "Filed" },
  { month: "February 2025", totalRevenue: 268000, taxRate: 5, taxAmount: 13400, status: "Filed" },
  { month: "March 2025", totalRevenue: 291000, taxRate: 5, taxAmount: 14550, status: "Filed" },
  { month: "April 2025", totalRevenue: 276000, taxRate: 5, taxAmount: 13800, status: "Filed" },
  { month: "May 2025", totalRevenue: 302000, taxRate: 5, taxAmount: 15100, status: "Filed" },
  { month: "June 2025", totalRevenue: 284000, taxRate: 5, taxAmount: 14200, status: "Pending" },
  { month: "July 2024", totalRevenue: 198000, taxRate: 5, taxAmount: 9900, status: "Filed" },
  { month: "August 2024", totalRevenue: 212000, taxRate: 5, taxAmount: 10600, status: "Filed" },
  { month: "September 2024", totalRevenue: 225000, taxRate: 5, taxAmount: 11250, status: "Filed" },
  { month: "October 2024", totalRevenue: 238000, taxRate: 5, taxAmount: 11900, status: "Filed" },
  { month: "November 2024", totalRevenue: 251000, taxRate: 5, taxAmount: 12550, status: "Filed" },
  { month: "December 2024", totalRevenue: 264000, taxRate: 5, taxAmount: 13200, status: "Filed" },
];

export const taxSummary: TaxSummary = {
  month: "June 2025",
  wht: 5680,
  gst: 2720,
  total: 8400,
};

export const taxDocuments: TaxDocument[] = taxMonthRows
  .filter((row) => row.status === "Filed")
  .map((row, i) => ({
    id: `doc-${i + 1}`,
    month: row.month,
    dateGenerated: row.month.replace(" 2025", "/2025").replace(" 2024", "/2024").replace(" ", " 01/"),
  }));

export const defaultNotifications: NotificationSettings = {
  paymentReceived: true,
  settlementProcessed: true,
  invoiceDiscountApproved: true,
  taxFiled: false,
  lowBalanceAlert: true,
};

export const invoiceDiscountStats = {
  availableForDiscounting: 48200,
  totalDiscountedThisMonth: 124000,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDashboardStats() {
  await delay(200);
  return dashboardStats;
}

export async function fetchTransactions() {
  await delay(200);
  return transactions;
}

export async function fetchEarnings(period: "daily" | "weekly" | "monthly") {
  await delay(200);
  if (period === "weekly") return weeklyEarnings;
  if (period === "monthly") return monthlyEarnings;
  return dailyEarnings;
}

export async function fetchPaymentBreakdown() {
  await delay(200);
  return paymentBreakdown;
}

export async function fetchEligibleInvoices() {
  await delay(200);
  return eligibleInvoices;
}

export async function fetchDiscountHistory() {
  await delay(200);
  return discountHistory;
}

export async function fetchTaxData() {
  await delay(200);
  return {
    stats: taxStats,
    months: taxMonthRows,
    summary: taxSummary,
    documents: taxDocuments,
  };
}

export async function fetchMerchant() {
  await delay(200);
  return merchant;
}
