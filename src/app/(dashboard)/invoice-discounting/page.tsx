"use client";

import * as React from "react";
import { DiscountConfirmModal } from "@/components/invoice/discount-confirm-modal";
import { StatusBadge } from "@/components/shared/status-badge";
import { AmountText } from "@/components/shared/amount-text";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInvoiceDiscounting } from "@/hooks/use-dashboard-data";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import { formatPKR } from "@/lib/format";
import type { EligibleInvoice } from "@/types";

export default function InvoiceDiscountingPage() {
  const { stats, eligible, history, isLoading, isError, refetch, requestDiscount } =
    useInvoiceDiscounting();
  const [selectedInvoice, setSelectedInvoice] =
    React.useState<EligibleInvoice | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card-base p-6">
          <p className="label-text text-sm text-medium-text">
            Available for Discounting
          </p>
          <p className="amount mt-2 text-3xl text-primary-green">
            {formatPKR(stats.availableForDiscounting)}
          </p>
        </div>
        <div className="card-base p-6">
          <p className="label-text text-sm text-medium-text">
            Total Discounted This Month
          </p>
          <p className="amount mt-2 text-3xl text-dark-text">
            {formatPKR(stats.totalDiscountedThisMonth)}
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-base font-semibold text-dark-text">
          Eligible Invoices
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {eligible.data?.map((invoice) => (
              <div
                key={invoice.id}
                className="card-base flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
                  <div>
                    <p className="text-xs text-medium-text">Batch Date</p>
                    <p className="label-text text-sm text-dark-text">
                      {invoice.batchDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-medium-text">Orders</p>
                    <p className="label-text text-sm text-dark-text">
                      {invoice.orderCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-medium-text">Total Amount</p>
                    <AmountText amount={invoice.totalAmount} className="text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-medium-text">Discount Fee</p>
                    <p className="label-text text-sm text-dark-text">
                      {invoice.discountFeePercent}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-medium-text">You Receive</p>
                    <AmountText
                      amount={invoice.amountAfterDiscount}
                      variant="positive"
                      className="text-sm"
                    />
                  </div>
                </div>
                <Can portal="merchant" action="request_discounting">
                  <Button
                    className="shrink-0 rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setModalOpen(true);
                    }}
                  >
                    Request Early Payout
                  </Button>
                </Can>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold text-dark-text">
          Discounting History
        </h2>
        <div className="card-base overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Request Date</TableHead>
                <TableHead>Invoice Batch</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.data?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-medium-text">
                    {row.requestDate}
                  </TableCell>
                  <TableCell>{row.invoiceBatch}</TableCell>
                  <TableCell>
                    <AmountText amount={row.amount} className="text-sm" />
                  </TableCell>
                  <TableCell className="text-rider-red">
                    {formatPKR(row.fee)}
                  </TableCell>
                  <TableCell>
                    <AmountText
                      amount={row.received}
                      variant="positive"
                      className="text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <DiscountConfirmModal
        invoice={selectedInvoice}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={() => {
          if (selectedInvoice) {
            requestDiscount.mutate(selectedInvoice.id);
          }
        }}
      />
    </div>
  );
}
