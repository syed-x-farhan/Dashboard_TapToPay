import { format, subMonths } from "date-fns";
import type {
  AdminMerchant,
  AdminPartner,
  AdminPartnerDetail,
  AdminRider,
} from "@/admin-portal/types/entities";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let adminPartners: AdminPartner[] = [
  { id: "p1", name: "Leopards Courier Services", type: "Courier", city: "Karachi", totalMerchants: 142, totalRiders: 890, monthlyVolume: 84200000, feeRate: 2.5, status: "Active", joinedDate: "12/03/2024", contactPerson: "Tariq Mehmood", email: "ops@leopardscourier.com", phone: "021-111-456-789", ntn: "1234567-8", accountManager: "Fahad Khan", discountTiers: { low: 2, medium: 3.5, high: 5 } },
  { id: "p2", name: "Foodpanda Pakistan", type: "Food Delivery", city: "Lahore", totalMerchants: 384, totalRiders: 2100, monthlyVolume: 124000000, feeRate: 3.0, status: "Active", joinedDate: "08/01/2024", contactPerson: "Sara Ahmed", email: "partners@foodpanda.pk", phone: "042-357-89012", ntn: "2345678-9", accountManager: "Aisha Malik", discountTiers: { low: 2, medium: 3, high: 4.5 } },
  { id: "p3", name: "Daraz.pk", type: "Retail", city: "Karachi", totalMerchants: 512, totalRiders: 3200, monthlyVolume: 186000000, feeRate: 2.0, status: "Active", joinedDate: "15/06/2023", contactPerson: "Usman Sheikh", email: "payments@daraz.pk", phone: "021-345-67890", ntn: "3456789-0", accountManager: "Tariq Mehmood", discountTiers: { low: 1.5, medium: 2.5, high: 4 } },
  { id: "p4", name: "TCS Connect", type: "Courier", city: "Islamabad", totalMerchants: 98, totalRiders: 620, monthlyVolume: 42000000, feeRate: 2.5, status: "Active", joinedDate: "22/09/2024", contactPerson: "Fatima Khan", email: "connect@tcs.com.pk", phone: "051-111-234-567", ntn: "4567890-1", accountManager: "Fahad Iqbal", discountTiers: { low: 2, medium: 3.5, high: 5 } },
  { id: "p5", name: "Cheezious", type: "Direct Restaurant", city: "Lahore", totalMerchants: 24, totalRiders: 180, monthlyVolume: 18400000, feeRate: 2.8, status: "Active", joinedDate: "05/11/2024", contactPerson: "Bilal Hassan", email: "finance@cheezious.com", phone: "0300-9876543", ntn: "5678901-2", accountManager: "Aisha Malik", discountTiers: { low: 2, medium: 3, high: 4 } },
  { id: "p6", name: "Bykea", type: "Food Delivery", city: "Karachi", totalMerchants: 156, totalRiders: 980, monthlyVolume: 68000000, feeRate: 3.0, status: "Active", joinedDate: "18/04/2024", contactPerson: "Hamza Tariq", email: "ops@bykea.com", phone: "021-222-333-444", ntn: "6789012-3", accountManager: "Fahad Khan", discountTiers: { low: 2, medium: 3.5, high: 5 } },
  { id: "p7", name: "Metro Online", type: "Retail", city: "Lahore", totalMerchants: 42, totalRiders: 210, monthlyVolume: 32000000, feeRate: 2.2, status: "Active", joinedDate: "30/07/2024", contactPerson: "Zainab Ali", email: "payments@metro.pk", phone: "042-111-222-333", ntn: "7890123-4", accountManager: "Tariq Mehmood", discountTiers: { low: 1.5, medium: 2.5, high: 4 } },
  { id: "p8", name: "KFC Pakistan", type: "Direct Restaurant", city: "Karachi", totalMerchants: 18, totalRiders: 120, monthlyVolume: 24000000, feeRate: 2.5, status: "Active", joinedDate: "14/02/2024", contactPerson: "Omar Farooq", email: "finance@kfc.pk", phone: "021-444-555-666", ntn: "8901234-5", accountManager: "Fahad Iqbal", discountTiers: { low: 2, medium: 3, high: 4 } },
  { id: "p9", name: "QuickCart Logistics", type: "Courier", city: "Peshawar", totalMerchants: 0, totalRiders: 0, monthlyVolume: 0, feeRate: 2.5, status: "Pending Approval", joinedDate: "24/06/2025", contactPerson: "Waqas Afridi", email: "hello@quickcart.pk", phone: "091-1234567", ntn: "9012345-6", accountManager: "Fahad Khan", discountTiers: { low: 2, medium: 3.5, high: 5 } },
  { id: "p10", name: "Sasta Bazaar", type: "Retail", city: "Quetta", totalMerchants: 0, totalRiders: 0, monthlyVolume: 0, feeRate: 2.0, status: "Pending Approval", joinedDate: "25/06/2025", contactPerson: "Amna Gul", email: "ops@sastabazaar.com", phone: "081-7654321", ntn: "0123456-7", accountManager: "Aisha Malik", discountTiers: { low: 2, medium: 3, high: 4 } },
  { id: "p11", name: "Bite Express", type: "Food Delivery", city: "Islamabad", totalMerchants: 0, totalRiders: 0, monthlyVolume: 0, feeRate: 3.0, status: "Pending Approval", joinedDate: "26/06/2025", contactPerson: "Danish Qureshi", email: "partners@biteexpress.pk", phone: "051-9876543", ntn: "1122334-4", accountManager: "Tariq Mehmood", discountTiers: { low: 2, medium: 3.5, high: 5 } },
  { id: "p12", name: "Gourmet Express", type: "Direct Restaurant", city: "Lahore", totalMerchants: 8, totalRiders: 45, monthlyVolume: 4200000, feeRate: 2.8, status: "Suspended", joinedDate: "10/05/2024", contactPerson: "Nabeel Siddiqui", email: "finance@gourmetexpress.pk", phone: "0301-5556677", ntn: "2233445-5", accountManager: "Fahad Khan", discountTiers: { low: 2, medium: 3, high: 4 }, suspendReason: "Repeated settlement failures" },
];

let adminMerchants: AdminMerchant[] = [
  { id: "m1", partnerId: "p1", partnerName: "Leopards Courier Services", name: "KFC Gulberg", city: "Lahore", category: "Restaurant", volumeThisMonth: 2840000, pendingSettlement: 48200, activeRiders: 8, status: "Active", ownerName: "Hassan Malik", cnic: "35202-1234567-1", phone: "0300-1112233", jazzCashNumber: "0300-1234567", monthlyExpectedVolume: 3000000, internalRiskScore: 22, riskLevel: "Low", accountFlags: [], opsNotes: "Reliable high-volume merchant." },
  { id: "m2", partnerId: "p1", partnerName: "Leopards Courier Services", name: "Hardees DHA", city: "Lahore", category: "Restaurant", volumeThisMonth: 2120000, pendingSettlement: 38400, activeRiders: 6, status: "Active", ownerName: "Ali Raza", cnic: "35202-2345678-2", phone: "0301-2223344", jazzCashNumber: "0301-2345678", monthlyExpectedVolume: 2500000, internalRiskScore: 35, riskLevel: "Low", accountFlags: [], opsNotes: "" },
  { id: "m3", partnerId: "p2", partnerName: "Foodpanda Pakistan", name: "Gourmet Bakers", city: "Lahore", category: "Retail", volumeThisMonth: 1860000, pendingSettlement: 32100, activeRiders: 5, status: "Active", ownerName: "Fatima Khan", cnic: "35202-3456789-3", phone: "0302-3334455", jazzCashNumber: "0302-3456789", monthlyExpectedVolume: 2000000, internalRiskScore: 48, riskLevel: "Medium", accountFlags: ["Volume spike"], opsNotes: "Monitor weekly volume trend." },
  { id: "m4", partnerId: "p3", partnerName: "Daraz.pk", name: "Al-Fatah Store", city: "Islamabad", category: "Retail", volumeThisMonth: 1640000, pendingSettlement: 28900, activeRiders: 4, status: "Active", ownerName: "Usman Sheikh", cnic: "61101-4567890-4", phone: "0303-4445566", jazzCashNumber: "0303-4567890", monthlyExpectedVolume: 1800000, internalRiskScore: 28, riskLevel: "Low", accountFlags: [], opsNotes: "" },
  { id: "m5", partnerId: "p2", partnerName: "Foodpanda Pakistan", name: "Pizza Hut MM Alam", city: "Lahore", category: "Restaurant", volumeThisMonth: 1420000, pendingSettlement: 25600, activeRiders: 5, status: "Active", ownerName: "Sara Ahmed", cnic: "35202-5678901-5", phone: "0304-5556677", jazzCashNumber: "0304-5678901", monthlyExpectedVolume: 1600000, internalRiskScore: 31, riskLevel: "Low", accountFlags: [], opsNotes: "" },
  { id: "m6", partnerId: "p4", partnerName: "TCS Connect", name: "Hardees Johar Town", city: "Lahore", category: "Restaurant", volumeThisMonth: 980000, pendingSettlement: 18200, activeRiders: 3, status: "Pending Approval", ownerName: "Bilal Hassan", cnic: "35202-6789012-6", phone: "0305-6667788", jazzCashNumber: "0305-6789012", monthlyExpectedVolume: 1200000, internalRiskScore: 55, riskLevel: "Medium", accountFlags: ["New merchant"], opsNotes: "Awaiting document verification." },
  { id: "m7", partnerId: "p2", partnerName: "Foodpanda Pakistan", name: "Bundu Khan", city: "Karachi", category: "Restaurant", volumeThisMonth: 1240000, pendingSettlement: 22400, activeRiders: 4, status: "Active", ownerName: "Omar Farooq", cnic: "42201-7890123-7", phone: "0306-7778899", jazzCashNumber: "0306-7890123", monthlyExpectedVolume: 1400000, internalRiskScore: 42, riskLevel: "Medium", accountFlags: [], opsNotes: "" },
  { id: "m8", partnerId: "p3", partnerName: "Daraz.pk", name: "Metro Cash & Carry", city: "Karachi", category: "Retail", volumeThisMonth: 3200000, pendingSettlement: 58400, activeRiders: 10, status: "Active", ownerName: "Zainab Ali", cnic: "42201-8901234-8", phone: "0307-8889900", jazzCashNumber: "0307-8901234", monthlyExpectedVolume: 3500000, internalRiskScore: 18, riskLevel: "Low", accountFlags: [], opsNotes: "Top performer — priority support." },
  { id: "m9", partnerId: "p6", partnerName: "Bykea", name: "Cheezious F-7", city: "Islamabad", category: "Restaurant", volumeThisMonth: 890000, pendingSettlement: 16800, activeRiders: 3, status: "Inactive", ownerName: "Hamza Tariq", cnic: "61101-9012345-9", phone: "0308-9990011", jazzCashNumber: "0308-9012345", monthlyExpectedVolume: 1000000, internalRiskScore: 72, riskLevel: "High", accountFlags: ["Late payment history"], opsNotes: "Settlement overdue — follow up required." },
  { id: "m10", partnerId: "p3", partnerName: "Daraz.pk", name: "Naheed Supermarket", city: "Karachi", category: "Retail", volumeThisMonth: 2100000, pendingSettlement: 38200, activeRiders: 7, status: "Active", ownerName: "Ayesha Noor", cnic: "42201-0123456-0", phone: "0309-0001122", jazzCashNumber: "0309-0123456", monthlyExpectedVolume: 2400000, internalRiskScore: 25, riskLevel: "Low", accountFlags: [], opsNotes: "" },
];

let adminRiders: AdminRider[] = [
  { id: "r1", partnerId: "p1", partnerName: "Leopards Courier Services", name: "Ahmed Raza", phone: "0310-1112233", cnic: "35202-1111111-1", city: "Lahore", pickupMerchants: ["KFC Gulberg", "Gourmet Bakers"], activeZone: "Gulberg → Model Town → Johar Town", deliveriesToday: 50, completedDeliveriesToday: 48, lastSeenAt: "2 mins ago", lastSeenArea: "Block H, Johar Town", todayCollections: 48200, totalThisMonth: 684000, nfcPaymentsCount: 42, cashCollections: 8, status: "Active", flagged: false, recentDeliveries: [{ id: "d1-1", orderId: "ORD-5521", pickupMerchant: "KFC Gulberg", customerName: "Ali Hassan", deliveryAddress: "House 14, Street 3, Block H", area: "Johar Town", amount: 2450, paymentMethod: "NFC", collectedAt: "14:32", status: "Delivered" }], dailyEarnings: [{ day: "Mon", amount: 8200, deliveries: 38 }, { day: "Tue", amount: 9400, deliveries: 42 }, { day: "Wed", amount: 8800, deliveries: 40 }, { day: "Thu", amount: 10200, deliveries: 46 }, { day: "Fri", amount: 12400, deliveries: 52 }, { day: "Sat", amount: 14800, deliveries: 58 }, { day: "Sun", amount: 11200, deliveries: 44 }] },
  { id: "r2", partnerId: "p1", partnerName: "Leopards Courier Services", name: "Bilal Hassan", phone: "0311-2223344", cnic: "35202-2222222-2", city: "Lahore", pickupMerchants: ["Hardees DHA", "Pizza Hut MM Alam"], activeZone: "DHA → Gulberg → Garden Town", deliveriesToday: 46, completedDeliveriesToday: 44, lastSeenAt: "5 mins ago", lastSeenArea: "Y Block, DHA Phase 3", todayCollections: 42100, totalThisMonth: 612000, nfcPaymentsCount: 38, cashCollections: 12, status: "Active", flagged: false, recentDeliveries: [{ id: "d2-1", orderId: "ORD-5498", pickupMerchant: "Hardees DHA", customerName: "Hamza Ali", deliveryAddress: "House 9, Street 5, Y Block", area: "DHA Phase 3", amount: 2800, paymentMethod: "NFC", collectedAt: "14:18", status: "Delivered" }], dailyEarnings: [{ day: "Mon", amount: 7600, deliveries: 34 }, { day: "Tue", amount: 8900, deliveries: 40 }, { day: "Wed", amount: 9200, deliveries: 41 }, { day: "Thu", amount: 9800, deliveries: 43 }, { day: "Fri", amount: 11800, deliveries: 48 }, { day: "Sat", amount: 13200, deliveries: 50 }, { day: "Sun", amount: 10400, deliveries: 42 }] },
  { id: "r3", partnerId: "p4", partnerName: "TCS Connect", name: "Sara Khan", phone: "0312-3334455", cnic: "35202-3333333-3", city: "Islamabad", pickupMerchants: ["Al-Fatah Store"], activeZone: "F-7 → F-10 → G-11", deliveriesToday: 41, completedDeliveriesToday: 40, lastSeenAt: "8 mins ago", lastSeenArea: "Street 22, F-10/2", todayCollections: 38400, totalThisMonth: 548000, nfcPaymentsCount: 35, cashCollections: 6, status: "Active", flagged: false, recentDeliveries: [{ id: "d3-1", orderId: "ORD-5478", pickupMerchant: "Al-Fatah Store", customerName: "Imran Qureshi", deliveryAddress: "House 6, Street 22, F-10/2", area: "F-10 Markaz", amount: 5200, paymentMethod: "NFC", collectedAt: "14:05", status: "Delivered" }], dailyEarnings: [{ day: "Mon", amount: 6800, deliveries: 30 }, { day: "Tue", amount: 7400, deliveries: 32 }, { day: "Wed", amount: 8200, deliveries: 36 }, { day: "Thu", amount: 8600, deliveries: 38 }, { day: "Fri", amount: 9600, deliveries: 40 }, { day: "Sat", amount: 10800, deliveries: 44 }, { day: "Sun", amount: 7800, deliveries: 34 }] },
  { id: "r4", partnerId: "p3", partnerName: "Daraz.pk", name: "Usman Ali", phone: "0313-4445566", cnic: "42201-4444444-4", city: "Karachi", pickupMerchants: ["Metro Cash & Carry", "Naheed Supermarket"], activeZone: "Gulshan → PECHS → Bahadurabad", deliveriesToday: 58, completedDeliveriesToday: 56, lastSeenAt: "1 min ago", lastSeenArea: "Block 5, PECHS", todayCollections: 52300, totalThisMonth: 724000, nfcPaymentsCount: 48, cashCollections: 10, status: "Active", flagged: false, recentDeliveries: [{ id: "d4-1", orderId: "ORD-5462", pickupMerchant: "Naheed Supermarket", customerName: "Asad Raza", deliveryAddress: "House 44, Block 5, PECHS", area: "PECHS", amount: 6200, paymentMethod: "NFC", collectedAt: "14:40", status: "Delivered" }], dailyEarnings: [{ day: "Mon", amount: 9200, deliveries: 44 }, { day: "Tue", amount: 10400, deliveries: 48 }, { day: "Wed", amount: 9800, deliveries: 46 }, { day: "Thu", amount: 11200, deliveries: 50 }, { day: "Fri", amount: 12800, deliveries: 54 }, { day: "Sat", amount: 14200, deliveries: 58 }, { day: "Sun", amount: 11800, deliveries: 52 }] },
  { id: "r5", partnerId: "p2", partnerName: "Foodpanda Pakistan", name: "Hamza Tariq", phone: "0314-5556677", cnic: "42201-5555555-5", city: "Karachi", pickupMerchants: ["Bundu Khan"], activeZone: "Clifton → DHA → Saddar", deliveriesToday: 42, completedDeliveriesToday: 40, lastSeenAt: "3 mins ago", lastSeenArea: "Block 8, Clifton", todayCollections: 28900, totalThisMonth: 412000, nfcPaymentsCount: 28, cashCollections: 14, status: "Active", flagged: true, flagReason: "Multiple failed NFC attempts today", recentDeliveries: [{ id: "d5-1", orderId: "ORD-5442", pickupMerchant: "Bundu Khan", customerName: "Shahid Latif", deliveryAddress: "House 28, 26th Street, Phase 6", area: "DHA Karachi", amount: 3800, paymentMethod: "NFC", collectedAt: "14:28", status: "Delivered" }], dailyEarnings: [{ day: "Mon", amount: 5800, deliveries: 28 }, { day: "Tue", amount: 6400, deliveries: 30 }, { day: "Wed", amount: 7200, deliveries: 34 }, { day: "Thu", amount: 7800, deliveries: 36 }, { day: "Fri", amount: 9200, deliveries: 40 }, { day: "Sat", amount: 10400, deliveries: 44 }, { day: "Sun", amount: 8600, deliveries: 38 }] },
  { id: "r6", partnerId: "p6", partnerName: "Bykea", name: "Fatima Shah", phone: "0315-6667788", cnic: "61101-6666666-6", city: "Peshawar", pickupMerchants: ["KFC Gulberg"], activeZone: "University Town → Hayatabad", deliveriesToday: 0, completedDeliveriesToday: 0, lastSeenAt: "2 days ago", lastSeenArea: "Phase 3, Hayatabad", todayCollections: 22400, totalThisMonth: 318000, nfcPaymentsCount: 22, cashCollections: 5, status: "Inactive", flagged: false, recentDeliveries: [], dailyEarnings: [{ day: "Mon", amount: 4200, deliveries: 18 }, { day: "Tue", amount: 4800, deliveries: 20 }, { day: "Wed", amount: 0, deliveries: 0 }, { day: "Thu", amount: 0, deliveries: 0 }, { day: "Fri", amount: 0, deliveries: 0 }, { day: "Sat", amount: 0, deliveries: 0 }, { day: "Sun", amount: 0, deliveries: 0 }] },
  { id: "r7", partnerId: "p1", partnerName: "Leopards Courier Services", name: "Omar Farooq", phone: "0316-7778899", cnic: "11101-7777777-7", city: "Quetta", pickupMerchants: ["Hardees DHA"], activeZone: "Jinnah Town → Satellite Town", deliveriesToday: 0, completedDeliveriesToday: 0, lastSeenAt: "5 days ago", lastSeenArea: "Jinnah Town", todayCollections: 18600, totalThisMonth: 264000, nfcPaymentsCount: 18, cashCollections: 9, status: "Suspended", flagged: true, flagReason: "Suspicious transaction pattern", recentDeliveries: [], dailyEarnings: [{ day: "Mon", amount: 0, deliveries: 0 }, { day: "Tue", amount: 0, deliveries: 0 }, { day: "Wed", amount: 0, deliveries: 0 }, { day: "Thu", amount: 0, deliveries: 0 }, { day: "Fri", amount: 0, deliveries: 0 }, { day: "Sat", amount: 0, deliveries: 0 }, { day: "Sun", amount: 0, deliveries: 0 }] },
];

function buildPartnerDetail(partner: AdminPartner): AdminPartnerDetail {
  const merchantIds = adminMerchants.filter((m) => m.partnerId === partner.id).map((m) => m.id);
  const riderIds = adminRiders.filter((r) => r.partnerId === partner.id).map((r) => r.id);
  return {
    ...partner,
    merchantIds,
    riderIds,
    volumeChart: Array.from({ length: 6 }, (_, i) => ({
      label: format(subMonths(new Date(), 5 - i), "MMM"),
      volume: Math.round(partner.monthlyVolume * (0.7 + i * 0.06)),
    })),
    feeHistory: [
      { id: "fh1", date: "26/06/2025", amount: Math.round(partner.monthlyVolume * 0.01), merchantCount: partner.totalMerchants },
      { id: "fh2", date: "25/06/2025", amount: Math.round(partner.monthlyVolume * 0.009), merchantCount: partner.totalMerchants },
      { id: "fh3", date: "24/06/2025", amount: Math.round(partner.monthlyVolume * 0.011), merchantCount: partner.totalMerchants },
    ],
  };
}

export async function fetchAdminPartners() {
  await delay(200);
  return [...adminPartners];
}

export async function fetchAdminPartner(id: string) {
  await delay(200);
  const partner = adminPartners.find((p) => p.id === id);
  return partner ? buildPartnerDetail(partner) : null;
}

export async function fetchAdminMerchants() {
  await delay(200);
  return [...adminMerchants];
}

export async function fetchAdminMerchant(id: string) {
  await delay(200);
  return adminMerchants.find((m) => m.id === id) ?? null;
}

export async function fetchAdminRiders() {
  await delay(200);
  return [...adminRiders];
}

export async function approvePartner(id: string, feeRate: number, tiers: { low: number; medium: number; high: number }) {
  await delay(400);
  adminPartners = adminPartners.map((p) =>
    p.id === id ? { ...p, status: "Active" as const, feeRate, discountTiers: tiers, totalMerchants: p.totalMerchants || 1, totalRiders: p.totalRiders || 1, monthlyVolume: p.monthlyVolume || 1000000 } : p
  );
}

export async function suspendPartner(id: string, reason: string) {
  await delay(400);
  adminPartners = adminPartners.map((p) =>
    p.id === id ? { ...p, status: "Suspended" as const, suspendReason: reason } : p
  );
}

export async function addPartner(data: Omit<AdminPartner, "id" | "totalMerchants" | "totalRiders" | "monthlyVolume" | "status">) {
  await delay(400);
  const newPartner: AdminPartner = {
    ...data,
    id: `p${adminPartners.length + 1}`,
    totalMerchants: 0,
    totalRiders: 0,
    monthlyVolume: 0,
    status: "Pending Approval",
  };
  adminPartners = [newPartner, ...adminPartners];
  return newPartner;
}

export async function suspendMerchant(id: string) {
  await delay(300);
  adminMerchants = adminMerchants.map((m) =>
    m.id === id ? { ...m, status: "Inactive" as const } : m
  );
}

export async function reassignMerchant(id: string, partnerId: string, partnerName: string) {
  await delay(300);
  adminMerchants = adminMerchants.map((m) =>
    m.id === id ? { ...m, partnerId, partnerName } : m
  );
}

export async function updateMerchantNotes(id: string, opsNotes: string) {
  await delay(200);
  adminMerchants = adminMerchants.map((m) =>
    m.id === id ? { ...m, opsNotes } : m
  );
}

export async function suspendRider(id: string) {
  await delay(300);
  adminRiders = adminRiders.map((r) =>
    r.id === id ? { ...r, status: "Suspended" as const } : r
  );
}

export async function flagRider(id: string, reason: string) {
  await delay(300);
  adminRiders = adminRiders.map((r) =>
    r.id === id ? { ...r, flagged: true, flagReason: reason } : r
  );
}

export async function reassignRider(id: string, partnerId: string, partnerName: string) {
  await delay(300);
  adminRiders = adminRiders.map((r) =>
    r.id === id ? { ...r, partnerId, partnerName } : r
  );
}

export function getPartnerOptions() {
  return adminPartners.map((p) => ({ id: p.id, name: p.name }));
}
