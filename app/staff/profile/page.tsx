'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import { staffAuthService, StaffProfile } from '../lib/staff-auth.service';

export default function Profile() {
  const { role, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!role) {
      router.push('/admin/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await staffAuthService.getProfile();
        setProfile(data);
      } catch (err: unknown) {
        console.error('Failed to load profile:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [role, router]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6">
        <div className="text-red-600 mb-4 text-center">
          <Icon name="information-circle" size={48} color="#dc2626" />
          <p className="mt-2 text-lg font-medium">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col font-sans">
      {/* Header Section */}
      <div className="relative bg-primary py-12 md:py-16 shadow-2xl overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex justify-between items-center">
             <div className="flex items-center">
                <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center overflow-hidden mr-6 shadow-xl">
                   <div className="w-full h-full bg-red-800 flex items-center justify-center">
                      <Icon name="person" size={40} color="white" />
                   </div>
                </div>
                <div>
                    <h1 className="text-4xl font-serif text-white mb-1 tracking-tight drop-shadow-md">
                      {profile?.name || 'Staff Member'}
                    </h1>
                    <div className="flex items-center gap-3">
                        <p className="text-gold text-sm font-medium tracking-wider uppercase opacity-90">
                          {profile?.role?.replace(/_/g, ' ') || role?.replace(/_/g, ' ') || 'Staff'}
                        </p>
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/30">{profile?.is_active ? 'ACTIVE NOW' : 'INACTIVE'}</span>
                    </div>
                </div>
             </div>
             

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 -mt-10 relative z-20">
         <div className="bg-white rounded-[40px] shadow-card border border-white/50 p-8 md:p-12">
             <div className="max-w-2xl mx-auto mb-12">
                 {/* Profile Details */}
                 <div className="space-y-6">
                    <h3 className="text-xl font-serif text-slate-900 mb-6 border-b pb-2">Personal Details</h3>
                    
                    <div className="flex items-start">
                        <div className="w-8 mt-1"><Icon name="information-circle" size={20} color="#64748b" /></div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                            <p className="text-slate-900 font-medium">{profile?.email || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="w-8 mt-1"><Icon name="phone-portrait-outline" size={20} color="#64748b" /></div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                            <p className="text-slate-900 font-medium">{profile?.phone || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="w-8 mt-1"><Icon name="restaurant-outline" size={20} color="#64748b" /></div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Restaurant</p>
                            <p className="text-slate-900 font-medium">{profile?.restaurant_name || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="w-8 mt-1"><Icon name="calendar-outline" size={20} color="#64748b" /></div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Joined On</p>
                            <p className="text-slate-900 font-medium">
                                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                 </div>
             </div>

             <div className="border-t border-slate-100 pt-8 flex justify-between items-center">
                 <div className="text-left">
                      <p className="text-slate-900 font-bold text-sm">Restaurant Staff App</p>
                 </div>
                 <button
                    className="bg-red-50 text-red-600 border border-red-100 px-8 py-4 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center"
                    onClick={handleLogout}
                  >
                    <Icon name="log-out-outline" size={20} color="#dc2626" className="mr-2" />
                    Sign Out
                  </button>
             </div>
         </div>
      </div>
    </div>
  );
}
