import { subDays, format } from "date-fns";
import type {
  ActivityEvent,
  CompletedSettlement,
  DiscountRequest,
  Partner,
  PartnerDashboardStats,
  PartnerMerchant,
  PartnerRider,
  PartnerTransaction,
  PendingSettlement,
  ScheduledReport,
  TeamMember,
  TopMerchant,
  VolumeDataPoint,
  WebhookConfig,
} from "@/types/partner";
import { normalizePartnerRider } from "@/lib/api-normalize";

export { normalizePartnerRider };

export const partner: Partner = {
  name: "Leopards Courier Services",
  companyType: "Courier & Logistics",
  contactEmail: "ops@leopardscourier.com",
  contactPerson: "Tariq Mehmood",
  phone: "042-111-456-789",
  address: "Main Boulevard, Gulberg III, Lahore",
  ntn: "1234567-8",
};

export const partnerDashboardStats: PartnerDashboardStats = {
  totalMerchants: 284,
  merchantsAddedThisMonth: 12,
  activeRidersToday: 1847,
  totalRiders: 2340,
  todayVolume: 4284000,
  volumeChangePercent: 8,
  pendingSettlements: 12840000,
  pendingMerchantsCount: 284,
  platformFeesCollected: 284000,
  taxAutoFiled: 142000,
};

export const volumeChartData: VolumeDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = subDays(new Date(), 29 - i);
  const volume = 2800000 + Math.floor(Math.random() * 2200000);
  return {
    date: format(date, "yyyy-MM-dd"),
    label: format(date, "dd MMM"),
    volume,
    settlements: Math.round(volume * 0.85),
  };
});

export const topMerchants: TopMerchant[] = [
  { id: "m1", name: "KFC Gulberg", todayVolume: 842000, sharePercent: 19.6 },
  { id: "m2", name: "Hardees DHA", todayVolume: 624000, sharePercent: 14.6 },
  { id: "m3", name: "Gourmet Bakers", todayVolume: 518000, sharePercent: 12.1 },
  { id: "m4", name: "Al-Fatah Store", todayVolume: 412000, sharePercent: 9.6 },
  { id: "m5", name: "Pizza Hut MM Alam", todayVolume: 386000, sharePercent: 9.0 },
];

export const activityFeed: ActivityEvent[] = [
  { id: "a1", type: "settlement", description: "Settlement processed", merchant: "KFC Gulberg", amount: 24000, timeAgo: "2 mins ago" },
  { id: "a2", type: "discount", description: "Invoice discount approved", merchant: "Pizza Hut DHA", amount: 48000, timeAgo: "15 mins ago" },
  { id: "a3", type: "onboard", description: "New merchant onboarded", merchant: "Hardees Johar Town", timeAgo: "1 hour ago" },
  { id: "a4", type: "transaction", description: "High-value NFC payment", merchant: "Gourmet Bakers", amount: 12400, timeAgo: "2 hours ago" },
  { id: "a5", type: "settlement", description: "Settlement processed", merchant: "Al-Fatah Store", amount: 18200, timeAgo: "3 hours ago" },
  { id: "a6", type: "onboard", description: "New merchant onboarded", merchant: "Bundu Khan", timeAgo: "5 hours ago" },
];

export const partnerMerchants: PartnerMerchant[] = [
  { id: "m1", name: "KFC Gulberg", city: "Lahore", category: "Restaurant", volumeThisMonth: 2840000, pendingSettlement: 48200, activeRiders: 8, status: "Active", ownerName: "Hassan Malik", cnic: "35202-1234567-1", phone: "0300-1112233", jazzCashNumber: "0300-1234567", monthlyExpectedVolume: 3000000 },
  { id: "m2", name: "Hardees DHA", city: "Lahore", category: "Restaurant", volumeThisMonth: 2120000, pendingSettlement: 38400, activeRiders: 6, status: "Active", ownerName: "Ali Raza", cnic: "35202-2345678-2", phone: "0301-2223344", jazzCashNumber: "0301-2345678", monthlyExpectedVolume: 2500000 },
  { id: "m3", name: "Gourmet Bakers", city: "Lahore", category: "Retail", volumeThisMonth: 1860000, pendingSettlement: 32100, activeRiders: 5, status: "Active", ownerName: "Fatima Khan", cnic: "35202-3456789-3", phone: "0302-3334455", jazzCashNumber: "0302-3456789", monthlyExpectedVolume: 2000000 },
  { id: "m4", name: "Al-Fatah Store", city: "Islamabad", category: "Retail", volumeThisMonth: 1640000, pendingSettlement: 28900, activeRiders: 4, status: "Active", ownerName: "Usman Sheikh", cnic: "61101-4567890-4", phone: "0303-4445566", jazzCashNumber: "0303-4567890", monthlyExpectedVolume: 1800000 },
  { id: "m5", name: "Pizza Hut MM Alam", city: "Lahore", category: "Restaurant", volumeThisMonth: 1420000, pendingSettlement: 25600, activeRiders: 5, status: "Active", ownerName: "Sara Ahmed", cnic: "35202-5678901-5", phone: "0304-5556677", jazzCashNumber: "0304-5678901", monthlyExpectedVolume: 1600000 },
  { id: "m6", name: "Hardees Johar Town", city: "Lahore", category: "Restaurant", volumeThisMonth: 980000, pendingSettlement: 18200, activeRiders: 3, status: "Pending Approval", ownerName: "Bilal Hassan", cnic: "35202-6789012-6", phone: "0305-6667788", jazzCashNumber: "0305-6789012", monthlyExpectedVolume: 1200000 },
  { id: "m7", name: "Bundu Khan", city: "Karachi", category: "Restaurant", volumeThisMonth: 1240000, pendingSettlement: 22400, activeRiders: 4, status: "Active", ownerName: "Omar Farooq", cnic: "42201-7890123-7", phone: "0306-7778899", jazzCashNumber: "0306-7890123", monthlyExpectedVolume: 1400000 },
  { id: "m8", name: "Metro Cash & Carry", city: "Karachi", category: "Retail", volumeThisMonth: 3200000, pendingSettlement: 58400, activeRiders: 10, status: "Active", ownerName: "Zainab Ali", cnic: "42201-8901234-8", phone: "0307-8889900", jazzCashNumber: "0307-8901234", monthlyExpectedVolume: 3500000 },
  { id: "m9", name: "Cheezious F-7", city: "Islamabad", category: "Restaurant", volumeThisMonth: 890000, pendingSettlement: 16800, activeRiders: 3, status: "Inactive", ownerName: "Hamza Tariq", cnic: "61101-9012345-9", phone: "0308-9990011", jazzCashNumber: "0308-9012345", monthlyExpectedVolume: 1000000 },
  { id: "m10", name: "Naheed Supermarket", city: "Karachi", category: "Retail", volumeThisMonth: 2100000, pendingSettlement: 38200, activeRiders: 7, status: "Active", ownerName: "Ayesha Noor", cnic: "42201-0123456-0", phone: "0309-0001122", jazzCashNumber: "0309-0123456", monthlyExpectedVolume: 2400000 },
];

export const partnerRiders: PartnerRider[] = [
  {
    id: "r1",
    name: "Ahmed Raza",
    phone: "0310-1112233",
    cnic: "35202-1111111-1",
    city: "Lahore",
    pickupMerchants: ["KFC Gulberg", "Gourmet Bakers"],
    activeZone: "Gulberg → Model Town → Johar Town",
    deliveriesToday: 50,
    completedDeliveriesToday: 48,
    lastSeenAt: "2 mins ago",
    lastSeenArea: "Block H, Johar Town",
    todayCollections: 48200,
    totalThisMonth: 684000,
    nfcPaymentsCount: 42,
    cashCollections: 8,
    status: "Active",
    recentDeliveries: [
      { id: "d1-1", orderId: "ORD-5521", pickupMerchant: "KFC Gulberg", customerName: "Ali Hassan", deliveryAddress: "House 14, Street 3, Block H", area: "Johar Town", amount: 2450, paymentMethod: "NFC", collectedAt: "14:32", status: "Delivered" },
      { id: "d1-2", orderId: "ORD-5518", pickupMerchant: "Gourmet Bakers", customerName: "Sana Malik", deliveryAddress: "Flat 4B, Pace Tower, MM Alam Road", area: "Gulberg III", amount: 1800, paymentMethod: "NFC", collectedAt: "13:55", status: "Delivered" },
      { id: "d1-3", orderId: "ORD-5514", pickupMerchant: "KFC Gulberg", customerName: "Usman Sheikh", deliveryAddress: "House 22, Canal Park, Gulberg", area: "Gulberg II", amount: 3200, paymentMethod: "Cash", collectedAt: "13:10", status: "Delivered" },
      { id: "d1-4", orderId: "ORD-5510", pickupMerchant: "Gourmet Bakers", customerName: "Fatima Noor", deliveryAddress: "House 8, Street 12, Nishat Colony", area: "Model Town", amount: 1650, paymentMethod: "NFC", collectedAt: "12:28", status: "Delivered" },
      { id: "d1-5", orderId: "ORD-5506", pickupMerchant: "KFC Gulberg", customerName: "Bilal Ahmed", deliveryAddress: "Shop 3, Main Boulevard, DHA Phase 4", area: "DHA Lahore", amount: 4100, paymentMethod: "Wallet", collectedAt: "11:45", status: "Delivered" },
      { id: "d1-6", orderId: "ORD-5502", pickupMerchant: "Gourmet Bakers", customerName: "Ayesha Khan", deliveryAddress: "House 45, Faisal Town, Satluj Block", area: "Faisal Town", amount: 2100, paymentMethod: "NFC", collectedAt: "11:02", status: "In Transit" },
    ],
    dailyEarnings: [
      { day: "Mon", amount: 8200, deliveries: 38 },
      { day: "Tue", amount: 9400, deliveries: 42 },
      { day: "Wed", amount: 8800, deliveries: 40 },
      { day: "Thu", amount: 10200, deliveries: 46 },
      { day: "Fri", amount: 12400, deliveries: 52 },
      { day: "Sat", amount: 14800, deliveries: 58 },
      { day: "Sun", amount: 11200, deliveries: 44 },
    ],
  },
  {
    id: "r2",
    name: "Bilal Hassan",
    phone: "0311-2223344",
    cnic: "35202-2222222-2",
    city: "Lahore",
    pickupMerchants: ["Hardees DHA", "Pizza Hut MM Alam"],
    activeZone: "DHA → Gulberg → Garden Town",
    deliveriesToday: 46,
    completedDeliveriesToday: 44,
    lastSeenAt: "5 mins ago",
    lastSeenArea: "Y Block, DHA Phase 3",
    todayCollections: 42100,
    totalThisMonth: 612000,
    nfcPaymentsCount: 38,
    cashCollections: 12,
    status: "Active",
    recentDeliveries: [
      { id: "d2-1", orderId: "ORD-5498", pickupMerchant: "Hardees DHA", customerName: "Hamza Ali", deliveryAddress: "House 9, Street 5, Y Block", area: "DHA Phase 3", amount: 2800, paymentMethod: "NFC", collectedAt: "14:18", status: "Delivered" },
      { id: "d2-2", orderId: "ORD-5494", pickupMerchant: "Pizza Hut MM Alam", customerName: "Maria Joseph", deliveryAddress: "House 17, Garden Block, Garden Town", area: "Garden Town", amount: 3500, paymentMethod: "Cash", collectedAt: "13:40", status: "Delivered" },
      { id: "d2-3", orderId: "ORD-5490", pickupMerchant: "Hardees DHA", customerName: "Tariq Mehmood", deliveryAddress: "Villa 3, Sector W, DHA Phase 5", area: "DHA Phase 5", amount: 4200, paymentMethod: "NFC", collectedAt: "12:55", status: "Delivered" },
      { id: "d2-4", orderId: "ORD-5486", pickupMerchant: "Pizza Hut MM Alam", customerName: "Nadia Farooq", deliveryAddress: "Apartment 12, Liberty Gate Plaza", area: "Gulberg", amount: 2900, paymentMethod: "NFC", collectedAt: "12:10", status: "Delivered" },
      { id: "d2-5", orderId: "ORD-5482", pickupMerchant: "Hardees DHA", customerName: "Rashid Khan", deliveryAddress: "House 31, Cavalry Ground", area: "Cantt", amount: 3100, paymentMethod: "Wallet", collectedAt: "11:22", status: "Pending" },
    ],
    dailyEarnings: [
      { day: "Mon", amount: 7600, deliveries: 34 },
      { day: "Tue", amount: 8900, deliveries: 40 },
      { day: "Wed", amount: 9200, deliveries: 41 },
      { day: "Thu", amount: 9800, deliveries: 43 },
      { day: "Fri", amount: 11800, deliveries: 48 },
      { day: "Sat", amount: 13200, deliveries: 50 },
      { day: "Sun", amount: 10400, deliveries: 42 },
    ],
  },
  {
    id: "r3",
    name: "Sara Khan",
    phone: "0312-3334455",
    cnic: "35202-3333333-3",
    city: "Islamabad",
    pickupMerchants: ["Al-Fatah Store"],
    activeZone: "F-7 → F-10 → G-11",
    deliveriesToday: 41,
    completedDeliveriesToday: 40,
    lastSeenAt: "8 mins ago",
    lastSeenArea: "Street 22, F-10/2",
    todayCollections: 38400,
    totalThisMonth: 548000,
    nfcPaymentsCount: 35,
    cashCollections: 6,
    status: "Active",
    recentDeliveries: [
      { id: "d3-1", orderId: "ORD-5478", pickupMerchant: "Al-Fatah Store", customerName: "Imran Qureshi", deliveryAddress: "House 6, Street 22, F-10/2", area: "F-10 Markaz", amount: 5200, paymentMethod: "NFC", collectedAt: "14:05", status: "Delivered" },
      { id: "d3-2", orderId: "ORD-5474", pickupMerchant: "Al-Fatah Store", customerName: "Zainab Hussain", deliveryAddress: "Flat 2, Kohsar Towers, F-7", area: "F-7 Markaz", amount: 3400, paymentMethod: "NFC", collectedAt: "13:22", status: "Delivered" },
      { id: "d3-3", orderId: "ORD-5470", pickupMerchant: "Al-Fatah Store", customerName: "Kamran Siddiqui", deliveryAddress: "House 18, Street 8, G-11/3", area: "G-11", amount: 4800, paymentMethod: "Cash", collectedAt: "12:38", status: "Delivered" },
      { id: "d3-4", orderId: "ORD-5466", pickupMerchant: "Al-Fatah Store", customerName: "Hina Abbas", deliveryAddress: "House 2, Street 14, E-11", area: "E-11", amount: 2900, paymentMethod: "NFC", collectedAt: "11:50", status: "Delivered" },
    ],
    dailyEarnings: [
      { day: "Mon", amount: 6800, deliveries: 30 },
      { day: "Tue", amount: 7400, deliveries: 32 },
      { day: "Wed", amount: 8200, deliveries: 36 },
      { day: "Thu", amount: 8600, deliveries: 38 },
      { day: "Fri", amount: 9600, deliveries: 40 },
      { day: "Sat", amount: 10800, deliveries: 44 },
      { day: "Sun", amount: 7800, deliveries: 34 },
    ],
  },
  {
    id: "r4",
    name: "Usman Ali",
    phone: "0313-4445566",
    cnic: "42201-4444444-4",
    city: "Karachi",
    pickupMerchants: ["Metro Cash & Carry", "Naheed Supermarket"],
    activeZone: "Gulshan → PECHS → Bahadurabad",
    deliveriesToday: 58,
    completedDeliveriesToday: 56,
    lastSeenAt: "1 min ago",
    lastSeenArea: "Block 5, PECHS",
    todayCollections: 52300,
    totalThisMonth: 724000,
    nfcPaymentsCount: 48,
    cashCollections: 10,
    status: "Active",
    recentDeliveries: [
      { id: "d4-1", orderId: "ORD-5462", pickupMerchant: "Naheed Supermarket", customerName: "Asad Raza", deliveryAddress: "House 44, Block 5, PECHS", area: "PECHS", amount: 6200, paymentMethod: "NFC", collectedAt: "14:40", status: "Delivered" },
      { id: "d4-2", orderId: "ORD-5458", pickupMerchant: "Metro Cash & Carry", customerName: "Saima Javed", deliveryAddress: "Flat 8, Al-Hamra Tower, Block 3", area: "Gulshan-e-Iqbal", amount: 8400, paymentMethod: "NFC", collectedAt: "13:58", status: "Delivered" },
      { id: "d4-3", orderId: "ORD-5454", pickupMerchant: "Naheed Supermarket", customerName: "Faisal Mahmood", deliveryAddress: "House 12, Main Rashid Minhas Road", area: "Gulshan", amount: 5100, paymentMethod: "Cash", collectedAt: "13:15", status: "Delivered" },
      { id: "d4-4", orderId: "ORD-5450", pickupMerchant: "Metro Cash & Carry", customerName: "Rubina Akhtar", deliveryAddress: "House 7, Stadium Road, Bahadurabad", area: "Bahadurabad", amount: 4700, paymentMethod: "NFC", collectedAt: "12:30", status: "Delivered" },
      { id: "d4-5", orderId: "ORD-5446", pickupMerchant: "Naheed Supermarket", customerName: "Junaid Iqbal", deliveryAddress: "Shop 15, Tariq Road Market", area: "PECHS", amount: 3800, paymentMethod: "Wallet", collectedAt: "11:42", status: "In Transit" },
    ],
    dailyEarnings: [
      { day: "Mon", amount: 9200, deliveries: 44 },
      { day: "Tue", amount: 10400, deliveries: 48 },
      { day: "Wed", amount: 9800, deliveries: 46 },
      { day: "Thu", amount: 11200, deliveries: 50 },
      { day: "Fri", amount: 12800, deliveries: 54 },
      { day: "Sat", amount: 14200, deliveries: 58 },
      { day: "Sun", amount: 11800, deliveries: 52 },
    ],
  },
  {
    id: "r5",
    name: "Hamza Tariq",
    phone: "0314-5556677",
    cnic: "42201-5555555-5",
    city: "Karachi",
    pickupMerchants: ["Bundu Khan"],
    activeZone: "Clifton → DHA → Saddar",
    deliveriesToday: 42,
    completedDeliveriesToday: 40,
    lastSeenAt: "3 mins ago",
    lastSeenArea: "Block 8, Clifton",
    todayCollections: 28900,
    totalThisMonth: 412000,
    nfcPaymentsCount: 28,
    cashCollections: 14,
    status: "Active",
    recentDeliveries: [
      { id: "d5-1", orderId: "ORD-5442", pickupMerchant: "Bundu Khan", customerName: "Shahid Latif", deliveryAddress: "House 28, 26th Street, Phase 6", area: "DHA Karachi", amount: 3800, paymentMethod: "NFC", collectedAt: "14:28", status: "Delivered" },
      { id: "d5-2", orderId: "ORD-5438", pickupMerchant: "Bundu Khan", customerName: "Mehwish Anwar", deliveryAddress: "Apartment 5C, Ocean Tower, Block 8", area: "Clifton", amount: 4200, paymentMethod: "Cash", collectedAt: "13:45", status: "Delivered" },
      { id: "d5-3", orderId: "ORD-5434", pickupMerchant: "Bundu Khan", customerName: "Arif Hussain", deliveryAddress: "House 3, Khayaban-e-Shamsheer, Phase 5", area: "DHA Phase 5", amount: 2900, paymentMethod: "NFC", collectedAt: "13:02", status: "Delivered" },
      { id: "d5-4", orderId: "ORD-5430", pickupMerchant: "Bundu Khan", customerName: "Nabeel Siddiqui", deliveryAddress: "Office 12, I.I. Chundrigar Road", area: "Saddar", amount: 5100, paymentMethod: "NFC", collectedAt: "12:18", status: "Delivered" },
      { id: "d5-5", orderId: "ORD-5426", pickupMerchant: "Bundu Khan", customerName: "Rabia Shah", deliveryAddress: "House 15, Boat Basin, Block 5", area: "Clifton", amount: 3400, paymentMethod: "Cash", collectedAt: "11:35", status: "Delivered" },
      { id: "d5-6", orderId: "ORD-5422", pickupMerchant: "Bundu Khan", customerName: "Danish Qureshi", deliveryAddress: "House 9, Khayaban-e-Ittehad, Phase 2", area: "DHA Phase 2", amount: 2700, paymentMethod: "Wallet", collectedAt: "10:50", status: "Delivered" },
      { id: "d5-7", orderId: "ORD-5418", pickupMerchant: "Bundu Khan", customerName: "Sadia Khan", deliveryAddress: "Flat 3, Sea View Apartments, Block 4", area: "Clifton", amount: 3600, paymentMethod: "NFC", collectedAt: "10:05", status: "Failed" },
    ],
    dailyEarnings: [
      { day: "Mon", amount: 5800, deliveries: 28 },
      { day: "Tue", amount: 6400, deliveries: 30 },
      { day: "Wed", amount: 7200, deliveries: 34 },
      { day: "Thu", amount: 7800, deliveries: 36 },
      { day: "Fri", amount: 9200, deliveries: 40 },
      { day: "Sat", amount: 10400, deliveries: 44 },
      { day: "Sun", amount: 8600, deliveries: 38 },
    ],
  },
  {
    id: "r6",
    name: "Fatima Shah",
    phone: "0315-6667788",
    cnic: "61101-6666666-6",
    city: "Peshawar",
    pickupMerchants: ["KFC Gulberg"],
    activeZone: "University Town → Hayatabad",
    deliveriesToday: 0,
    completedDeliveriesToday: 0,
    lastSeenAt: "2 days ago",
    lastSeenArea: "Phase 3, Hayatabad",
    todayCollections: 22400,
    totalThisMonth: 318000,
    nfcPaymentsCount: 22,
    cashCollections: 5,
    status: "Inactive",
    recentDeliveries: [
      { id: "d6-1", orderId: "ORD-5414", pickupMerchant: "KFC Gulberg", customerName: "Waqas Afridi", deliveryAddress: "House 10, Street 4, Phase 3", area: "Hayatabad", amount: 2200, paymentMethod: "NFC", collectedAt: "Yesterday", status: "Delivered" },
      { id: "d6-2", orderId: "ORD-5410", pickupMerchant: "KFC Gulberg", customerName: "Amna Gul", deliveryAddress: "House 22, University Road", area: "University Town", amount: 1800, paymentMethod: "Cash", collectedAt: "Yesterday", status: "Delivered" },
    ],
    dailyEarnings: [
      { day: "Mon", amount: 4200, deliveries: 18 },
      { day: "Tue", amount: 4800, deliveries: 20 },
      { day: "Wed", amount: 0, deliveries: 0 },
      { day: "Thu", amount: 0, deliveries: 0 },
      { day: "Fri", amount: 0, deliveries: 0 },
      { day: "Sat", amount: 0, deliveries: 0 },
      { day: "Sun", amount: 0, deliveries: 0 },
    ],
  },
  {
    id: "r7",
    name: "Omar Farooq",
    phone: "0316-7778899",
    cnic: "11101-7777777-7",
    city: "Quetta",
    pickupMerchants: ["Hardees DHA"],
    activeZone: "Jinnah Town → Satellite Town",
    deliveriesToday: 0,
    completedDeliveriesToday: 0,
    lastSeenAt: "5 days ago",
    lastSeenArea: "Jinnah Town",
    todayCollections: 18600,
    totalThisMonth: 264000,
    nfcPaymentsCount: 18,
    cashCollections: 9,
    status: "Suspended",
    recentDeliveries: [],
    dailyEarnings: [
      { day: "Mon", amount: 0, deliveries: 0 },
      { day: "Tue", amount: 0, deliveries: 0 },
      { day: "Wed", amount: 0, deliveries: 0 },
      { day: "Thu", amount: 0, deliveries: 0 },
      { day: "Fri", amount: 0, deliveries: 0 },
      { day: "Sat", amount: 0, deliveries: 0 },
      { day: "Sun", amount: 0, deliveries: 0 },
    ],
  },
];

const riders = partnerRiders.map((r) => r.name);

export const partnerTransactions: PartnerTransaction[] = Array.from({ length: 25 }, (_, i) => {
  const amount = 1200 + Math.floor(Math.random() * 8000);
  const platformFee = Math.round(amount * 0.025);
  const tax = Math.round(amount * 0.05);
  const riderCut = Math.round(amount * 0.08);
  const date = subDays(new Date(), i % 14);
  date.setHours(9 + (i % 12), (i * 5) % 60, 0, 0);
  const merchant = partnerMerchants[i % partnerMerchants.length];
  const method = (["NFC", "Cash", "Wallet"] as const)[i % 3];
  return {
    id: `ptx-${i + 1}`,
    date: date.toISOString(),
    orderId: `ORD-${5500 - i}`,
    merchant: merchant.name,
    merchantId: merchant.id,
    rider: riders[i % riders.length],
    customerReference: `CUST-${9000 + i}`,
    amount,
    paymentMethod: method,
    platformFee,
    tax,
    netToMerchant: amount - platformFee - tax - riderCut,
    status: (["Completed", "Completed", "Pending", "Failed"] as const)[i % 4],
    riderCut,
    nfcTagId: method === "NFC" ? `NFC-${7000 + i}` : undefined,
  };
});

export const pendingSettlements: PendingSettlement[] = partnerMerchants
  .filter((m) => m.status === "Active")
  .slice(0, 8)
  .map((m, i) => ({
    id: `ps-${i + 1}`,
    merchantId: m.id,
    merchantName: m.name,
    ordersCount: 24 + i * 8,
    grossAmount: m.pendingSettlement * 4,
    platformFee: Math.round(m.pendingSettlement * 0.1),
    tax: Math.round(m.pendingSettlement * 0.05),
    netPayable: m.pendingSettlement,
    dueDate: format(subDays(new Date(), -3 - i), "dd/MM/yyyy"),
  }));

export const completedSettlements: CompletedSettlement[] = [
  { id: "cs1", date: "26/06/2025", merchant: "KFC Gulberg", amount: 48200, method: "Jazz Cash", referenceId: "JC-SET-8821", status: "Completed" },
  { id: "cs2", date: "25/06/2025", merchant: "Hardees DHA", amount: 38400, method: "Jazz Cash", referenceId: "JC-SET-8819", status: "Completed" },
  { id: "cs3", date: "24/06/2025", merchant: "Metro Cash & Carry", amount: 58400, method: "Bank", referenceId: "BNK-SET-4421", status: "Completed" },
  { id: "cs4", date: "23/06/2025", merchant: "Gourmet Bakers", amount: 32100, method: "Jazz Cash", referenceId: "JC-SET-8815", status: "Processing" },
];

export const discountRequests: DiscountRequest[] = [
  { id: "dr1", requestDate: "27/06/2025", merchantName: "KFC Gulberg", invoiceAmount: 48200, discountFee: 964, amountToPayOut: 47236, riskScore: "Low", status: "Pending Approval" },
  { id: "dr2", requestDate: "26/06/2025", merchantName: "Pizza Hut DHA", invoiceAmount: 62400, discountFee: 2184, amountToPayOut: 60216, riskScore: "Medium", status: "Pending Approval" },
  { id: "dr3", requestDate: "25/06/2025", merchantName: "Hardees DHA", invoiceAmount: 38400, discountFee: 768, amountToPayOut: 37632, riskScore: "Low", status: "Approved" },
  { id: "dr4", requestDate: "24/06/2025", merchantName: "Al-Fatah Store", invoiceAmount: 92000, discountFee: 4600, amountToPayOut: 87400, riskScore: "High", status: "Rejected" },
  { id: "dr5", requestDate: "22/06/2025", merchantName: "Gourmet Bakers", invoiceAmount: 32100, discountFee: 642, amountToPayOut: 31458, riskScore: "Low", status: "Paid Out" },
];

export const webhooks: WebhookConfig[] = [
  { id: "wh1", eventType: "Payment Completed", url: "https://api.leopardscourier.com/webhooks/payment", status: "Active", lastTriggered: "2 mins ago" },
  { id: "wh2", eventType: "Settlement Processed", url: "https://api.leopardscourier.com/webhooks/settlement", status: "Active", lastTriggered: "1 hour ago" },
  { id: "wh3", eventType: "Merchant Added", url: "https://api.leopardscourier.com/webhooks/merchant", status: "Inactive", lastTriggered: "3 days ago" },
];

export const teamMembers: TeamMember[] = [
  { id: "t1", name: "Tariq Mehmood", email: "tariq@leopardscourier.com", role: "Admin", lastLogin: "27/06/2025 09:14" },
  { id: "t2", name: "Aisha Malik", email: "aisha@leopardscourier.com", role: "Manager", lastLogin: "26/06/2025 16:42" },
  { id: "t3", name: "Fahad Iqbal", email: "fahad@leopardscourier.com", role: "Viewer", lastLogin: "25/06/2025 11:08" },
];

export const scheduledReports: ScheduledReport[] = [
  { id: "sr1", name: "Daily Settlement Summary", frequency: "Daily", format: "PDF", recipient: "ops@leopardscourier.com" },
  { id: "sr2", name: "Weekly Merchant Performance", frequency: "Weekly", format: "Excel", recipient: "analytics@leopardscourier.com" },
  { id: "sr3", name: "Monthly Tax Filing Report", frequency: "Monthly", format: "CSV", recipient: "finance@leopardscourier.com" },
];

export const apiKeys = {
  live: "rp_live_4k8mN2pQ9xR7vL3wY6zA1bC5dE0fG",
  test: "rp_test_7hJ2kM5nP8qS1tU4vW9xY3zA6bC0dE",
};

export const discountRules = { low: 2, medium: 3.5, high: 5 };

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchPartnerDashboard() {
  await delay(200);
  return { stats: partnerDashboardStats, volume: volumeChartData, topMerchants, activity: activityFeed };
}

export async function fetchPartnerMerchants() {
  await delay(200);
  return partnerMerchants;
}

export async function fetchPartnerMerchant(id: string) {
  await delay(200);
  return partnerMerchants.find((m) => m.id === id) ?? null;
}

export async function fetchPartnerRiders() {
  await delay(200);
  return partnerRiders.map(normalizePartnerRider);
}

export async function fetchPartnerTransactions() {
  await delay(200);
  return partnerTransactions;
}

export async function fetchSettlements() {
  await delay(200);
  return { pending: pendingSettlements, completed: completedSettlements };
}

export async function fetchDiscountRequests() {
  await delay(200);
  return discountRequests;
}

export async function fetchPartnerSettings() {
  await delay(200);
  return { partner, webhooks, teamMembers, scheduledReports, apiKeys, discountRules };
}
