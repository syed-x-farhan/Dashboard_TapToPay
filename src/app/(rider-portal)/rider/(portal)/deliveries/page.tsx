"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { AmountText } from "@/components/shared/amount-text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const deliveries = [
  { id: "d1", orderId: "ORD-5521", merchant: "KFC Gulberg", customer: "Ali Hassan", area: "Johar Town", amount: 2450, method: "NFC", status: "Delivered", time: "14:32" },
  { id: "d2", orderId: "ORD-5518", merchant: "Gourmet Bakers", customer: "Sana Malik", area: "Gulberg", amount: 1850, method: "Cash", status: "Delivered", time: "14:18" },
  { id: "d3", orderId: "ORD-5512", merchant: "KFC Gulberg", customer: "Omar Farooq", area: "Model Town", amount: 3200, method: "NFC", status: "In Transit", time: "13:55" },
];

export default function RiderDeliveriesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-dark-text">Today&apos;s Deliveries</h1>
      <div className="card-base overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Time</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.time}</TableCell>
                  <TableCell className="font-mono text-xs">{d.orderId}</TableCell>
                  <TableCell>{d.merchant}</TableCell>
                  <TableCell>{d.customer}</TableCell>
                  <TableCell>{d.area}</TableCell>
                  <TableCell><AmountText amount={d.amount} className="text-sm" /></TableCell>
                  <TableCell>{d.method}</TableCell>
                  <TableCell><StatusBadge status={d.status === "In Transit" ? "Processing" : "Completed"} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
