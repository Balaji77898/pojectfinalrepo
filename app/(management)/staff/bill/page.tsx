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

  const tipAmount = snapshot?.tip ?? Math.round(parseFloat((navState?.tipAmount as string) ?? '0'));
  const grandTotal =
    snapshot?.grandTotal ??
    Math.round(parseFloat((navState?.finalTotal as string) ?? currentOrder?.total?.toString() ?? '0'));
  const subtotal =
    snapshot?.subtotal ?? Math.round(currentOrder?.subtotal ?? 0);
  const tax = snapshot?.tax ?? Math.round(currentOrder?.tax ?? 0);
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
        <div className="w-full max-w-[420px]">
          <Animated type="fadeInUp" duration={0.4}>
            <div
              ref={receiptRef}
              className="bill-print-area bg-white overflow-hidden border border-slate-200 relative font-mono"
            >
              <div className="px-6 pt-6 pb-4 text-center">
                <div className="text-[14px] font-bold tracking-widest text-slate-900">RESTAURANT</div>
                <div className="text-[12px] font-semibold text-slate-800 mt-1">Payment Receipt</div>
                <div className="mt-3 border-t border-slate-300" />
              </div>

              <div className="px-6 pb-4 text-[12px]">
                <div className="space-y-2">
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-600">Bill Number</span>
                    <span className="font-bold text-slate-900 tabular-nums">{billNumber}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-600">Date</span>
                    <span className="font-bold text-slate-900 tabular-nums">{date}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-600">Payment Method</span>
                    <span className="font-bold text-slate-900 capitalize tabular-nums">
                      {paymentMethod === 'cash'
                        ? 'Cash'
                        : paymentMethod === 'upi'
                          ? 'UPI'
                          : paymentMethod || '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-[12px] font-bold uppercase tracking-wide text-slate-900">
                    Order Items
                  </div>
                  <div className="flex-1 border-t border-slate-200" />
                </div>

                <div className="border border-slate-200">
                  <div className="grid grid-cols-[1fr_56px_96px] bg-slate-50 px-3 py-2 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                    <span className="text-left">Item</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Amount</span>
                  </div>

                  {items.length === 0 ? (
                    <div className="px-3 py-4 text-center text-slate-500 text-[11px]">
                      No line items on this bill.
                    </div>
                  ) : (
                    items.map((line, idx) => (
                      <div
                        key={`${line.name}-${idx}`}
                        className={`grid grid-cols-[1fr_56px_96px] px-3 py-2 text-[12px] ${
                          idx === items.length - 1 ? '' : 'border-b border-slate-100'
                        }`}
                      >
                        <span className="text-slate-800 font-medium leading-snug pr-2">{line.name}</span>
                        <span className="text-center text-slate-800 tabular-nums">{line.quantity}</span>
                        <span className="text-right text-slate-900 font-semibold tabular-nums">
                          {fmt(line.lineTotal)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="border-t border-slate-200 pt-4 space-y-2 text-[12px]">
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-bold text-slate-900 tabular-nums">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-bold text-slate-900 tabular-nums">{fmt(tax)}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-600">Tip</span>
                    <span className="font-bold text-slate-900 tabular-nums">{fmt(tipAmount)}</span>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-200 flex items-baseline justify-between">
                    <span className="text-[12px] font-black uppercase tracking-wide text-slate-900">TOTAL</span>
                    <span className="text-[20px] font-black text-slate-900 tabular-nums">{fmt(grandTotal)}</span>
                  </div>
                </div>

                <p className="text-center text-[11px] text-slate-600 mt-4">Thank you for dining with us</p>
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
