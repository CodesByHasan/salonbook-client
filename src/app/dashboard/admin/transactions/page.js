import { CreditCard } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import LoadError from "@/components/shared/LoadError";
import PageHeader from "@/components/shared/PageHeader";
import Pager from "@/components/shared/Pager";
import { PaymentBadge } from "@/components/shared/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { loadData } from "@/lib/api/fetcher";
import { getTransactions } from "@/lib/api/payments";
import { toPage } from "@/lib/params";
import { formatDateTime, formatMoney, shortId } from "@/lib/utils";

export const metadata = { title: "Transactions" };

// Read-only: there are no edit or delete actions here.
export default async function TransactionsPage({ searchParams }) {
  const page = toPage((await searchParams).page);
  const { data, error } = await loadData(() => getTransactions({ page, limit: 10 }));

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" description="Payments received through Stripe." />

      {error ? (
        <LoadError message={error} />
      ) : data.transactions.length === 0 ? (
        <EmptyState icon={CreditCard} title="No transactions yet" text="Paid appointments will appear here." />
      ) : (
        <>
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead className="pr-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.transactions.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell className="pl-4">
                      <p className="font-medium">{t.customerName}</p>
                      <p className="text-xs text-muted-foreground">{t.customerEmail}</p>
                    </TableCell>
                    <TableCell>{t.serviceName}</TableCell>
                    <TableCell>{formatDateTime(t.createdAt)}</TableCell>
                    <TableCell className="font-medium">{formatMoney(t.amount, t.currency)}</TableCell>
                    <TableCell className="uppercase">{t.currency}</TableCell>
                    <TableCell className="font-mono text-xs">{shortId(t.stripeSessionId)}</TableCell>
                    <TableCell className="pr-4"><PaymentBadge status={t.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pager basePath="/dashboard/admin/transactions" meta={data.meta} />
        </>
      )}
    </div>
  );
}