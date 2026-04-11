'use client';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';
import { Animated } from '../components/Animated';
import { useAuth } from '../contexts/AuthContext';
import { useNavigationState } from '../contexts/NavigationContext';
import { useOrders } from '../contexts/OrdersContext';
import { normalizeStaffOrderItems } from '../lib/staff-orders.service';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

type BillLine = {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type BillSnapshot = {
  items: BillLine[];
  subtotal: number;
  tax: number;
  taxRatePct: number;
  orderTotal: number;
  tip: number;
  grandTotal: number;
  orderNumber: string;
  table: string;
  paymentMethod: string;
  orderId: string;
};

function parseBillSnapshot(nav: Record<string, unknown>): BillSnapshot | null {
  const raw = nav?.billSnapshot;
  if (typeof raw !== 'string' || !raw.trim()) return null;
  try {
    const o = JSON.parse(raw) as BillSnapshot;
    if (!o || !Array.isArray(o.items)) return null;
    return o;
  } catch {
    return null;
  }
}

export default function Bill() {
  const { role } = useAuth();
  const router = useRouter();
  const { navState } = useNavigationState();
  const { orders } = useOrders();
  const receiptRef = useRef<HTMLDivElement>(null);

  const orderId = (navState?.orderId as string) ?? '';
  const currentOrder = orders.find((o) => o.id === orderId);
  const snapshot = useMemo(() => parseBillSnapshot(navState as Record<string, unknown>), [navState]);

  const fallbackItems: BillLine[] = useMemo(() => {
    const raw = currentOrder?.itemsDetails || [];
    return normalizeStaffOrderItems(raw).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: Math.round(parseFloat(item.price) || 0),
      lineTotal: Math.round(item.quantity * (parseFloat(item.price) || 0)),
    }));
  }, [currentOrder]);

  const table =
    snapshot?.table ?? (navState?.table as string) ?? currentOrder?.table ?? '';
  const orderNumber =
    snapshot?.orderNumber ?? currentOrder?.orderNumber ?? orderId.slice(0, 8).toUpperCase();
  const tipAmount = snapshot?.tip ?? Math.round(parseFloat((navState?.tipAmount as string) ?? '0'));
  const grandTotal =
    snapshot?.grandTotal ??
    Math.round(parseFloat((navState?.finalTotal as string) ?? currentOrder?.total?.toString() ?? '0'));
  const subtotal =
    snapshot?.subtotal ?? Math.round(currentOrder?.subtotal ?? 0);
  const tax = snapshot?.tax ?? Math.round(currentOrder?.tax ?? 0);
  const orderTotalBeforeTip =
    snapshot?.orderTotal ?? Math.round(parseFloat((navState?.orderTotal as string) ?? String(grandTotal - tipAmount)));
  const taxRatePct =
    snapshot?.taxRatePct ??
    (subtotal > 0 ? Math.round((tax / subtotal) * 1000) / 10 : 0);
  const paymentMethod =
    snapshot?.paymentMethod ?? (navState?.paymentMethod as string) ?? '';
  const items = snapshot?.items?.length ? snapshot.items : fallbackItems;

  const [billNumber] = useState(
    () => (navState?.billNumber as string) ?? `BILL-${Date.now().toString().slice(-8)}`,
  );
  const [date] = useState(() => {
    if (currentOrder?.createdAt) {
      return new Date(currentOrder.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    }
    return (
      currentOrder?.time ||
      new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    );
  });

  const taxLabel =
    taxRatePct > 0 ? `GST / Tax (${taxRatePct}%)` : 'GST / Tax';

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: { boxShadow: 'none' },
        filter: (node: HTMLElement) => !node?.hasAttribute?.('data-html2canvas-ignore'),
      });

      const tempPdf = new jsPDF();
      const imgProps = tempPdf.getImageProperties(dataUrl);
      const imgWidth = imgProps.width / 2;
      const imgHeight = imgProps.height / 2;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Bill-${billNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const fmt = (n: number) => `₹${Math.round(n)}`;

  return (
    <div className="min-h-screen bg-ivory flex flex-col font-sans">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body { background: white !important; }
              .no-print { display: none !important; }
              .bill-screen-bg { display: none !important; }
              .bill-print-area {
                box-shadow: none !important;
                border: none !important;
                max-width: 100% !important;
              }
            }
          `,
        }}
      />

      <div className="fixed inset-0 opacity-10 pointer-events-none bill-screen-bg">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg">
          <Animated type="fadeInUp" duration={0.4}>
            <div
              ref={receiptRef}
              className="bill-print-area bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

              <div className="p-8 md:p-10">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-3">
                    <div className="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                      <Icon name="checkmark" size={24} color="white" />
                    </div>
                  </div>
                  <h1 className="text-xl md:text-2xl font-serif font-black text-slate-900 text-center">
                    Payment successful
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">Tax invoice / Bill</p>
                </div>

                <div className="border border-dashed border-slate-200 rounded-2xl p-5 mb-6 bg-slate-50/80">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Bill no.</p>
                      <p className="font-mono font-bold text-slate-900">{billNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Order</p>
                      <p className="font-mono font-bold text-slate-900">#{orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Table</p>
                      <p className="font-bold text-slate-900">{table || '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Date</p>
                      <p className="font-bold text-slate-900 text-right">{date}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Payment</p>
                      <p className="font-bold text-slate-900 capitalize">
                        {paymentMethod === 'cash'
                          ? 'Cash'
                          : paymentMethod === 'upi'
                            ? 'UPI'
                            : paymentMethod || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
                    Items
                  </h3>
                  <div className="rounded-xl border border-slate-200 overflow-hidden text-sm">
                    <div className="grid grid-cols-12 gap-1 bg-slate-100 px-3 py-2 font-bold text-slate-600 text-xs uppercase">
                      <span className="col-span-5">Item</span>
                      <span className="col-span-2 text-center">Qty</span>
                      <span className="col-span-2 text-right">Rate</span>
                      <span className="col-span-3 text-right">Amount</span>
                    </div>
                    {items.length === 0 ? (
                      <div className="px-3 py-6 text-center text-slate-500">No line items on this bill.</div>
                    ) : (
                      items.map((line, idx) => (
                        <div
                          key={`${line.name}-${idx}`}
                          className="grid grid-cols-12 gap-1 px-3 py-2.5 border-t border-slate-100 items-start"
                        >
                          <span className="col-span-5 text-slate-800 font-medium leading-snug">{line.name}</span>
                          <span className="col-span-2 text-center text-slate-700">{line.quantity}</span>
                          <span className="col-span-2 text-right text-slate-700 tabular-nums">{fmt(line.unitPrice)}</span>
                          <span className="col-span-3 text-right font-semibold text-slate-900 tabular-nums">
                            {fmt(line.lineTotal)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{taxLabel}</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{fmt(tax)}</span>
                  </div>
                  <div className="flex justify-between text-slate-800 pt-1 border-t border-slate-100">
                    <span className="font-bold">Order total</span>
                    <span className="font-black text-slate-900 tabular-nums">{fmt(orderTotalBeforeTip)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tip</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{fmt(tipAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t-2 border-slate-200">
                    <span className="font-serif font-bold text-slate-900">Total paid</span>
                    <span className="font-black text-primary tabular-nums">{fmt(grandTotal)}</span>
                  </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-8">Thank you for dining with us</p>
              </div>
            </div>

            <div className="no-print flex flex-col gap-3 mt-6" data-html2canvas-ignore>
              <button
                type="button"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center transition-colors shadow-lg"
                onClick={handlePrint}
              >
                <Icon name="print-outline" size={20} color="white" className="mr-2" />
                Print bill
              </button>
              <button
                type="button"
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold flex items-center justify-center transition-colors shadow-lg"
                onClick={handleDownloadPDF}
              >
                <Icon name="share-outline" size={20} color="white" className="mr-2" />
                Download PDF
              </button>
              <button
                type="button"
                className="w-full bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 py-4 rounded-xl font-bold transition-colors"
                onClick={() =>
                  router.replace(role === 'billing_staff' ? '/staff/billing-payment' : '/staff/staff-dashboard')
                }
              >
                Back to {role === 'billing_staff' ? 'Billing' : 'Dashboard'}
              </button>
            </div>
          </Animated>
        </div>
      </div>
    </div>
  );
}
