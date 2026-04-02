'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';
import { Animated } from '../components/Animated';
import { useAuth } from '../contexts/AuthContext';
import { useNavigationState } from '../contexts/NavigationContext';
import { useOrders } from '../contexts/OrdersContext';

type BillingStatus = 'billed' | 'paid';

interface TableBilling {
  id: string;
  table: string;
  items: number;
  subtotal: number;
  total: number;
  status: BillingStatus;
  time: string;
  orderItems?: { name: string; qty: number; price: number }[];
}

function mapOrderStatusToBillingStatus(orderStatus: string): BillingStatus | null {
  const status = orderStatus.toUpperCase();
  if (status === 'PAID') return 'paid';
  // Include all orders that are active and not yet paid entirely under 'billed' tab
  if (status !== 'CANCELLED') return 'billed';
  return null;
}

export default function BillingPayment() {
  const { role } = useAuth();
  const router = useRouter();
  const { setNavState } = useNavigationState();
  const { orders } = useOrders();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showRevenueView, setShowRevenueView] = useState(false);

  useEffect(() => {
    if (role === 'serving_staff') {
      router.push('/staff/staff-dashboard');
    }
  }, [role, router]);

  const allTablesBilling: TableBilling[] = useMemo(() => {
    return orders
      .filter(order => {
        const status = mapOrderStatusToBillingStatus(order.status);
        return status !== null;
      })
      .map(order => ({
        id: order.id,
        table: order.table,
        items: order.items,
        subtotal: Math.round(order.subtotal || 0),
        total: Math.round(order.total),
        status: mapOrderStatusToBillingStatus(order.status) as BillingStatus,
        time: order.time,
      }));
  }, [orders]);

  const billingFilters = [
    { id: 'all', label: 'All', count: allTablesBilling.length },
    { id: 'billed', label: 'Billed', count: allTablesBilling.filter(t => t.status === 'billed').length, color: '#f59e0b' },
    { id: 'paid', label: 'Paid', count: allTablesBilling.filter(t => t.status === 'paid').length, color: '#C8A951' },
  ];

  const filteredBilling = activeFilter === 'all' ? allTablesBilling : allTablesBilling.filter(item => item.status === activeFilter);
  const totalBilled = allTablesBilling.filter(t => t.status === 'billed').reduce((sum, t) => sum + t.total, 0);
  const totalPaid = allTablesBilling.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.total, 0);
  const grandTotal = totalBilled + totalPaid;

  const tableRevenueMap = allTablesBilling.reduce((acc, bill) => {
    const tableName = bill.table;
    if (!acc[tableName]) {
      acc[tableName] = { total: 0, orders: 0 };
    }
    acc[tableName].total += Math.round(bill.total);
    acc[tableName].orders += 1;
    return acc;
  }, {} as Record<string, { total: number; orders: number }>);

  const tableRevenueList = Object.entries(tableRevenueMap)
    .map(([table, data]) => ({ table, ...data }))
    .sort((a, b) => {
      const getTableNumber = (tableName: string) => {
        const match = tableName.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      return getTableNumber(a.table) - getTableNumber(b.table);
    });

  const getStatusConfig = (status: BillingStatus) => {
    switch (status) {
      case 'billed':
        return {
          label: 'BILLED',
          bg: '#FEF3C7',
          color: '#D97706',
          icon: 'time' as const,
        };
      case 'paid':
        return {
          label: 'PAID',
          bg: '#D1FAE5',
          color: '#059669',
          icon: 'checkmark-circle' as const,
        };
    }
  };


  const BillCard = ({ item, index }: { item: TableBilling; index: number }) => {
    const config = getStatusConfig(item.status);

    return (
      <Animated type="fadeInUp" delay={index * 0.08} duration={0.4}>
        <div className="bg-white rounded-3xl mb-4 overflow-hidden shadow-card">
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ backgroundColor: config.bg }}
          >
            <div className="flex items-center">
              <div className="mr-2">
                <Icon name={config.icon} size={20} color={config.color} />
              </div>
              <span
                className="font-black text-sm tracking-wide"
                style={{ color: config.color }}
              >
                {config.label}
              </span>
            </div>
            <span className="text-xs font-medium" style={{ color: config.color }}>
              {item.time}
            </span>
          </div>

          <div className="w-full p-5 text-left cursor-default">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mr-4">
                  <Icon name="restaurant" size={28} color="#8B1D1D" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-xl">{item.table}</p>
                  <p className="text-slate-500 text-sm mt-1">{item.items} items</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 font-black text-2xl">₹{Math.round(item.total)}</p>
              </div>
            </div>

            {item.status === 'billed' ? (
              <button
                className="w-full mt-4 rounded-2xl overflow-hidden hover:scale-[0.98] transition-transform"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  // Navigate to order details for both bill generation and payment processing
                  setNavState({ table: item.table, orderId: item.id });
                  router.push('/staff/order-details');
                }}
              >
                <div className="bg-indigo-50 border border-indigo-100 py-3 flex items-center justify-center">
                  <Icon name="receipt-outline" size={18} color="#4338ca" />
                  <span className="text-indigo-700 font-bold text-sm ml-2">View Order</span>
                </div>
              </button>
            ) : null}
          </div>
        </div>
      </Animated>
    );
  };

  return (

    <div className="min-h-screen bg-ivory flex flex-col font-sans">
      {/* Header Section */}
      <div className="relative bg-primary py-12 md:py-16 shadow-2xl overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2 tracking-tight drop-shadow-md">
              Billing & Payments
            </h1>
            <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase opacity-90">
              Transaction Management
            </p>
          </div>
          <div className="flex gap-4">

            <button
              className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10"
              onClick={() => setShowRevenueView(!showRevenueView)}
            >
              <Icon name={showRevenueView ? "wallet" : "stats-chart"} size={24} color="#FFFFFF" />
            </button>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-20">

        {/* Stats Grid - mimicking Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Revenue */}
          <div className="bg-white rounded-[32px] p-6 shadow-card flex items-center border border-[#E2E8F0]">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mr-6">
              <Icon name="wallet" size={32} color="#d97706" />
            </div>
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</h3>
              <p className="text-3xl font-serif font-black text-slate-900">₹{Math.round(grandTotal).toLocaleString()}</p>
            </div>
          </div>

          {/* Collected */}
          <div className="bg-white rounded-[32px] p-6 shadow-card flex items-center border border-[#E2E8F0]">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mr-6">
              <Icon name="cash" size={32} color="#059669" />
            </div>
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Collected</h3>
              <p className="text-3xl font-serif font-black text-slate-900">₹{Math.round(totalPaid).toLocaleString()}</p>
            </div>
          </div>

          {/* Billed */}
          <div className="bg-white rounded-[32px] p-6 shadow-card flex items-center border border-[#E2E8F0]">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mr-6">
              <Icon name="time" size={32} color="#f59e0b" />
            </div>
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Billed</h3>
              <p className="text-3xl font-serif font-black text-slate-900">₹{Math.round(totalBilled).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Transactions Section - Mimicking Active Orders Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-[24px] md:rounded-[40px] p-6 md:p-12 shadow-card border border-white/50">
          {!showRevenueView ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-serif text-slate-900 mb-2">Transactions</h2>
                  <p className="text-slate-500">Manage bills and process payments.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {billingFilters.map((item) => (
                    <button
                      key={item.id}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center ${activeFilter === item.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      onClick={() => setActiveFilter(item.id)}
                    >
                      {item.label}
                      <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {item.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {filteredBilling.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBilling.map((item, index) => (
                    <BillCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              ) : (
                <Animated type="fadeIn" duration={0.4} className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Icon name="receipt-outline" size={32} color="#94a3b8" />
                  </div>
                  <p className="text-slate-900 text-lg font-bold">No {activeFilter} bills found</p>
                </Animated>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-serif text-slate-900 mb-2">Revenue by Table</h2>
                  <p className="text-slate-500">Breakdown of earnings per table.</p>
                </div>
                <button
                  onClick={() => setShowRevenueView(false)}
                  className="mt-4 md:mt-0 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold transition-colors hover:bg-slate-50"
                >
                  Back to Transactions
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tableRevenueList.map((tableData, index) => (
                  <Animated key={tableData.table} type="fadeInUp" delay={index * 0.05} duration={0.4}>
                    <div
                      className="bg-white rounded-2xl p-6 flex items-center justify-between hover:shadow-lg transition-all border border-[#E2E8F0] h-full"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                          <Icon name="restaurant" size={24} color="#8B1D1D" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-bold text-lg">{tableData.table}</p>
                          <p className="text-slate-500 text-sm">{tableData.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-black text-2xl">₹{Math.round(tableData.total)}</p>
                      </div>
                    </div>
                  </Animated>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
