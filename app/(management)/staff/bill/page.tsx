'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';
import { Animated } from '../components/Animated';
import { useAuth } from '../contexts/AuthContext';
import { useNavigationState } from '../contexts/NavigationContext';
import { useOrders } from '../contexts/OrdersContext';
import { normalizeStaffOrderItems } from '../lib/staff-orders.service';
import { staffAuthService, StaffProfile } from '../lib/staff-auth.service';
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
  customerName?: string;
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
  const [profile, setProfile] = useState<StaffProfile | null>(null);

  useEffect(() => {
    staffAuthService.getProfile().then(setProfile).catch(err => {
      console.warn('Could not fetch restaurant name for bill:', err);
    });
  }, []);

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
            .print-only { display: none !important; }
            @media print {
              html, body { 
                height: auto !important; 
                min-height: 0 !important;
                margin: 0 !important; 
                padding: 0 !important; 
                background: white !important;
                -webkit-print-color-adjust: exact;
                overflow: visible !important;
              }
              /* Hide ALL screen-only containers */
              main, div[class*="min-h-screen"], .min-h-screen {
                height: auto !important;
                min-height: 0 !important;
                background: none !important;
                padding: 0 !important;
                margin: 0 !important;
                overflow: visible !important;
              }
              .no-print, [data-html2canvas-ignore], .bill-screen-bg, button, .no-print * { 
                display: none !important; 
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                opacity: 0 !important;
                pointer-events: none !important;
              }
              .print-only { 
                display: block !important; 
                width: 100% !important;
                max-width: 100% !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                position: relative !important;
                top: 0 !important;
                left: 0 !important;
                visibility: visible !important;
              }
              @page { 
                margin: 0 !important; 
                size: auto;
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
            {/* Screen Version (Unchanged) */}
            <div
              ref={receiptRef}
              className="bill-print-area bg-white overflow-hidden border border-slate-200 relative font-mono no-print"
            >
              <div className="px-6 pt-6 pb-4 text-center">
                <div className="text-[14px] font-bold tracking-widest text-slate-900 uppercase">
                  {profile?.restaurant_name || 'FINE DINING RESTAURANT'}
                </div>
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
                    <span className="text-slate-600">Table</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {snapshot?.table || currentOrder?.table || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-600">Customer</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {snapshot?.customerName || currentOrder?.customerName || '—'}
                    </span>
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
                  {tipAmount > 0 && (
                    <div className="flex justify-between gap-6">
                      <span className="text-slate-600">Tip</span>
                      <span className="font-bold text-slate-900 tabular-nums">{fmt(tipAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t-2 border-slate-200 flex items-baseline justify-between">
                    <span className="text-[12px] font-black uppercase tracking-wide text-slate-900">TOTAL</span>
                    <span className="text-[20px] font-black text-slate-900 tabular-nums">{fmt(grandTotal)}</span>
                  </div>
                </div>

                <p className="text-center text-[11px] text-slate-600 mt-4">Thank you for dining with us</p>
              </div>
            </div>

            {/* Printable Version (Hidden on Screen) */}
            <div className="bg-white p-10 font-sans text-slate-900 print-only w-full max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-black mb-1 tracking-tight">
                  {profile?.restaurant_name?.toUpperCase() || 'RESTAURANT'}
                </h1>
                <p className="text-lg font-medium">Payment Receipt</p>
              </div>

              <div className="border-t-[3px] border-black mb-6"></div>

              <div className="mb-6 space-y-2 text-[15px]">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Bill Number</span>
                  <span className="font-bold">{billNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Table</span>
                  <span className="font-bold">{snapshot?.table || currentOrder?.table || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Customer</span>
                  <span className="font-bold">
                    {snapshot?.customerName || currentOrder?.customerName || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Date</span>
                  <span className="font-bold">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Payment Method</span>
                  <span className="font-bold uppercase">{paymentMethod || '—'}</span>
                </div>
              </div>

              <div className="border-t border-slate-400 mb-6"></div>

              <h2 className="text-xl font-bold mb-4">Order Items</h2>

              <table className="w-full mb-6 border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="border border-slate-300 py-2 px-3 text-left font-bold text-sm">Item</th>
                    <th className="border border-slate-300 py-2 px-3 text-center font-bold text-sm">Qty</th>
                    <th className="border border-slate-300 py-2 px-3 text-right font-bold text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((line, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="border border-slate-300 py-2 px-3 text-[15px]">{line.name}</td>
                      <td className="border border-slate-300 py-2 px-3 text-center text-[15px]">{line.quantity}</td>
                      <td className="border border-slate-300 py-2 px-3 text-right text-[15px] font-medium">{fmt(line.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-slate-400 mb-6"></div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[15px]">
                  <span className="font-semibold text-slate-700">Subtotal</span>
                  <span className="font-bold">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[15px]">
                  <span className="font-semibold text-slate-700">Tax</span>
                  <span className="font-bold">{fmt(tax)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-[15px]">
                    <span className="font-semibold text-slate-700">Tip</span>
                    <span className="font-bold">{fmt(tipAmount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t-[3px] border-black mb-4"></div>

              <div className="flex justify-between items-baseline mb-12">
                <span className="text-2xl font-black">TOTAL</span>
                <span className="text-3xl font-black">{fmt(grandTotal)}</span>
              </div>

              <div className="text-center mt-12">
                <p className="text-base font-medium">Thank you for dining with us!</p>
              </div>
            </div>

            <div className="no-print" data-html2canvas-ignore>
              <div className="flex flex-col gap-3 mt-6">
                {(role !== 'billing_staff' || currentOrder?.status === 'PAID') && (
                  <>
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
                  </>
                )}
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
            </div>
          </Animated>
        </div>
      </div>
    </div>
  );
}
