'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';
import { Gradient } from '../components/Gradient';
import { Animated } from '../components/Animated';

// Contexts (relative to tables folder)
import { useAuth } from '../contexts/AuthContext';
import { useNavigationState } from '../contexts/NavigationContext';
import { staffTablesService } from '../lib/staff-tables.service';

type TableStatus = 'available' | 'occupied' | 'reserved' | 'needs-bill';

type Table = {
  id: string;
  name: string;
  status: TableStatus;
  seats: number;
  server?: string;
  amount?: string;
};

export default function Tables() {
  const { role } = useAuth();
  const router = useRouter();
  const { setNavState } = useNavigationState();
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (role === 'billing_staff') {
      router.push('/staff/billing-payment');
    }
  }, [role, router]);

  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      // Only fetch if we have a role/user (authenticated)
      if (!role) return;

      try {
        setIsLoading(true);
        const data = await staffTablesService.getTables();
        
        // ... mapping logic ...
        let tablesArray: unknown[] = data;
        const dataObj = data as { data?: unknown[] };
        if (!Array.isArray(data) && data && Array.isArray(dataObj.data)) {
           tablesArray = dataObj.data;
        } else if (!Array.isArray(tablesArray)) {
           tablesArray = [];
        }

        const mappedTables: Table[] = tablesArray.map((t: unknown) => {
          const tableData = t as { id: string, table_number: string | number, table_status: string };
          const tableName = typeof tableData.table_number === 'string' && tableData.table_number.startsWith('Table')
            ? tableData.table_number
            : `Table ${tableData.table_number}`;

          return {
            id: tableData.id,
            name: tableName,
            status: tableData.table_status === 'EMPTY' ? 'available' : 'occupied',
            seats: 0, 
            server: undefined
          };
        });
        setTables(mappedTables);
        setErrorMsg(null);
      } catch (error: Error | unknown) {
        console.error('Failed to fetch tables:', error);
        if (error instanceof Error) {
           setErrorMsg(error.message);
        } else {
           setErrorMsg(String(error));
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (role) {
      fetchTables();
      const interval = setInterval(fetchTables, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [role]);

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (role !== 'serving_staff') return;

    // Ideally call API here to update status, but for now we keep local toggle
    // as per current implementation logic if desired, or just disable if we want strict API flow.
    // Given the task is to remove dummy data, keeping local toggle might be okay for UI testing 
    // but the initial load MUST be real data.
  };

  const filters = [
    { id: 'all', label: 'All', count: tables.length },
    { id: 'available', label: 'Available', count: tables.filter(t => t.status === 'available').length },
    { id: 'occupied', label: 'Occupied', count: tables.filter(t => t.status === 'occupied').length },
    ...(role !== 'serving_staff' 
      ? [{ id: 'needs-bill', label: 'Needs Bill', count: tables.filter(t => t.status === 'needs-bill').length }]
      : [])
  ];

  const filteredTables = activeFilter === 'all'
    ? tables
    : tables.filter(t => t.status === activeFilter);

  const getStatusConfig = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-success-light',
          text: 'text-success-dark',
          label: 'Available',
          icon: 'checkmark-circle' as const,
          iconColor: '#C8A951',
          gradient: ['#C8A951', '#B8993D'] as [string, string]
        };
      case 'occupied':
        return {
          bg: 'bg-info-light',
          text: 'text-info-dark',
          label: 'Occupied',
          icon: 'people' as const,
          iconColor: '#3b82f6',
          gradient: ['#3b82f6', '#2563eb'] as [string, string]
        };
      case 'reserved':
        return {
          bg: 'bg-primary/10',
          text: 'text-primary',
          label: 'Reserved',
          icon: 'calendar' as const,
          iconColor: '#7B1F1F',
          gradient: ['#7B1F1F', '#9B2B2B'] as [string, string]
        };
      case 'needs-bill':
        return {
          bg: 'bg-warning-light',
          text: 'text-warning-dark',
          label: 'Needs Bill',
          icon: 'receipt' as const,
          iconColor: '#f59e0b',
          gradient: ['#f59e0b', '#d97706'] as [string, string]
        };
    }
  };

  const handleTableClick = (item: Table) => {
    setNavState({ table: item.name });
    router.push('/staff/order-details');
  };

  const TableCard = ({ item, index }: { item: Table; index: number }) => {
    const config = getStatusConfig(item.status);

    return (
      <Animated type="fadeInUp" delay={index * 0.08} duration={0.4}>
        <div
          className="w-full admin-card mb-3 overflow-hidden text-left group hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 cursor-pointer"
          onClick={() => handleTableClick(item)}
        >
          <div className="flex">
            <Gradient
              colors={config.gradient}
              className="w-1.5"
            >
              <div className="w-full h-full" />
            </Gradient>

            <div className="flex-1 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="admin-card-icon mr-3">
                    <Icon name={config.icon} size={22} color="currentColor" className={config.text} />
                  </div>
                  <div className="flex-1">
                    <p className="admin-card-title text-lg">{item.name}</p>
                    <div className="flex items-center mt-1">
                      {item.seats > 0 && (
                        <>
                          <Icon name="people-outline" size={14} color="#94a3b8" />
                          <span className="admin-card-subtitle ml-1">{item.seats} seats</span>
                        </>
                      )}
                      {item.server && (
                        <>
                          {item.seats > 0 && <span className="text-text/30 mx-2">•</span>}
                          <span className="admin-card-subtitle">{item.server}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <button
                    className={`px-3 py-1.5 rounded-full ${config.bg} ${role === 'serving_staff' ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'}`}
                    onClick={(e) => handleStatusClick(e)}
                    disabled={role !== 'serving_staff'}
                  >
                    <span className={`text-xs font-semibold ${config.text}`}>{config.label}</span>
                  </button>
                  {item.amount && (
                    <p className="text-primary font-bold text-base mt-2">{item.amount}</p>
                  )}
                </div>
              </div>

              {(item.status === 'occupied' || item.status === 'needs-bill') && role !== 'serving_staff' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-ivory-200">
                  {role !== 'billing_staff' && (
                    <button
                      className="flex-1 bg-primary/10 hover:bg-primary hover:text-white rounded-xl py-2.5 flex items-center justify-center transition-colors group/btn"
                      onClick={(e) => { e.stopPropagation(); setNavState({ table: item.name }); router.push('/staff/order-details'); }}
                    >
                      <Icon name="add-circle-outline" size={16} color="currentColor" className="text-primary group-hover/btn:text-white" />
                      <span className="text-primary font-semibold text-sm ml-1 group-hover/btn:text-white">Add Items</span>
                    </button>
                  )}
                  <button
                    className="flex-1 bg-success/10 hover:bg-gold rounded-xl py-2.5 flex items-center justify-center transition-colors group/bill"
                    onClick={(e) => { e.stopPropagation(); router.push('/staff/billing-payment'); }}
                  >
                    <Icon name="receipt-outline" size={16} color="currentColor" className="text-[#C8A951] group-hover/bill:text-white" />
                    <span className="text-[#C8A951] font-semibold text-sm ml-1 group-hover/bill:text-white">Bill</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Animated>
    );
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col font-sans">
      {/* Header Section */}
      <div className="relative bg-primary py-10 md:py-16 shadow-2xl overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-2 tracking-tight drop-shadow-md">
              Floor Plan
            </h1>
            <p className="text-gold text-xs md:text-sm font-medium tracking-[0.2em] uppercase opacity-90">
              Real-time Table Status
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex gap-4">
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-ivory-200 sticky top-8">
              <h3 className="text-text/60 text-xs font-bold uppercase tracking-wider mb-4">View Options</h3>
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                {filters.map((item) => (
                  <button
                    key={item.id}
                    className={`shrink-0 w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all ${activeFilter === item.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'hover:bg-ivory text-text/70'
                      }`}
                    onClick={() => setActiveFilter(item.id)}
                  >
                    <span className={`font-bold ${activeFilter === item.id ? 'text-white' : 'text-text'}`}>{item.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeFilter === item.id
                        ? 'bg-white/20 text-white'
                        : 'bg-ivory text-text/60'
                      }`}>
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tables Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredTables.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTables.map((item, index) => (
                  <TableCard key={item.id} item={item} index={index} />
                ))}
              </div>
            ) : (
              <Animated type="fadeIn" duration={0.4} className="flex flex-col items-center justify-center py-20 bg-white/60 rounded-3xl border-2 border-dashed border-ivory-200">
                <div className="w-24 h-24 bg-ivory rounded-full flex items-center justify-center mb-4">
                  <Icon name="grid-outline" size={48} color="#94a3b8" />
                </div>
                <p className="text-text text-xl font-bold">No tables found</p>
                {errorMsg && <p className="text-red-500 font-bold mt-4">Error: {errorMsg}</p>}
              </Animated>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
