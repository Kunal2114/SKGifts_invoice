import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);
  const invoices = await prisma.invoice.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="page-head">
        <h1>Invoices</h1>
        <Link className="btn primary" href="/dashboard/invoices/new">+ New invoice</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Invoice No.</th><th>Date</th><th>Buyer</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td>{inv.invoiceNumber}</td>
              <td>{new Date(inv.invoiceDate).toLocaleDateString('en-IN')}</td>
              <td>{inv.billName}</td>
              <td>{inv.currency}{inv.totalAmount.toFixed(2)}</td>
              <td><Link href={`/dashboard/invoices/${inv.id}`}>View / Print</Link></td>
            </tr>
          ))}
          {invoices.length === 0 && (
            <tr><td colSpan={5} className="empty-row">No invoices yet — create your first one.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
