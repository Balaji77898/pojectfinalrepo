"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Input } from "@/app/admin/components/ui/Input";
import { Button } from "@/app/admin/components/ui/Button";

// Services
import { authService } from "@/app/admin/lib/auth.service";
import { staffAuthService } from "@/app/staff/lib/staff-auth.service";

interface FormData {
  email: string;
  password: string;
}

export default function Home() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'staff'>('admin');

  // Admin Form Data
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  // Staff Form Data
  const [staffId, setStaffId] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffRole, setStaffRole] = useState<'serving_staff' | 'billing_staff' | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (loginType === 'admin') {
        if (!formData.email || !formData.password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        await authService.login({ email: formData.email, password: formData.password });
        router.push('/admin/dashboard');
      } else {
        if (!staffId || !staffPassword || !staffRole) {
          setError('Please fill in all fields and select a role');
          setLoading(false);
          return;
        }
        await staffAuthService.login({ email: staffId, password: staffPassword }, staffRole);
        router.push('/staff/staff-dashboard');
      }
    } catch (err: unknown) {
      console.error('Login Error details:', err);
      if (err instanceof Error && err.message.toLowerCase().includes('failed to fetch')) {
        setError('Network Error: Could not connect to the backend. Please check if your Render service is Active and CORS is allowed.');
      } else {
        setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FBF6EE]">
      <AnimatePresence mode="wait">
        {!showLogin ? (
          /* STAGE 1: HERO LANDING */
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="relative h-screen w-full flex flex-col items-center justify-center text-center px-4"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/bag.jpg"
                alt="Restaurant Interior"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/65" />
            </div>

            <div className="relative z-10 max-w-4xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-[#C8A951] text-sm md:text-lg mb-4 uppercase tracking-[0.3em] font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                When Flavours meet Passion, Magic happens.
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-white text-4xl md:text-7xl font-serif mb-12 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Come Join Us For A<br />
                Magical Experience.
              </motion.h1>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLogin(true)}
                className="px-10 py-4 bg-gradient-to-r from-[#D4B76E] via-[#C8A951] to-[#D4B76E] text-[#2D0A0F] font-bold text-lg rounded-md shadow-[0_10px_30px_rgba(200,169,81,0.3)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(200,169,81,0.5)]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                GET STARTED
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* STAGE 2: PORTAL ACCESS LOGIN */
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-[#F5F1E9] flex items-center justify-center p-6 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: "url('/images/pattern.jpg')",
                backgroundSize: "420px",
                backgroundRepeat: "repeat",
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-[#C8A951]/20 relative z-10"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-[#5D1616] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Portal Access</h1>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => { setLoginType('admin'); setError(''); }}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${loginType === 'admin'
                      ? 'bg-[#5D1616] text-white shadow-md'
                      : 'bg-[#FBF6EE] text-gray-500 border border-[#C8A951]/30 hover:bg-[#C8A951]/10'
                      }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Admin Login
                  </button>
                  <button
                    onClick={() => { setLoginType('staff'); setError(''); }}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${loginType === 'staff'
                      ? 'bg-[#5D1616] text-white shadow-md'
                      : 'bg-[#FBF6EE] text-gray-500 border border-[#C8A951]/30 hover:bg-[#C8A951]/10'
                      }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Staff Login
                  </button>
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-red-500 text-sm font-medium text-center mb-6"
                >
                  {error}
                </motion.p>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {loginType === 'admin' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Email</label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-[#FBF6EE] border-[#C8A951]/30 focus:border-[#5D1616] text-gray-800"
                        value={formData.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Password</label>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        className="bg-[#FBF6EE] border-[#C8A951]/30 focus:border-[#5D1616] text-gray-800"
                        value={formData.password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      <label className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Role</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['serving_staff', 'billing_staff'].map((role) => (
                          <div
                            key={role}
                            onClick={() => setStaffRole(role as any)}
                            className={`cursor-pointer text-center py-2.5 rounded-lg border text-sm transition-all ${staffRole === role
                              ? 'bg-[#5D1616]/5 border-[#5D1616] text-[#5D1616] font-bold'
                              : 'border-[#C8A951]/30 text-gray-400 hover:border-[#5D1616]/30'
                              }`}
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Staff Login ID</label>
                      <Input
                        type="email"
                        placeholder="Enter ID"
                        className="bg-[#FBF6EE] border-[#C8A951]/30 focus:border-[#5D1616] text-gray-800"
                        value={staffId}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setStaffId(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Password</label>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        className="bg-[#FBF6EE] border-[#C8A951]/30 focus:border-[#5D1616] text-gray-800"
                        value={staffPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setStaffPassword(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#D4B76E] to-[#C8A951] text-[#2D0A0F] font-bold text-base hover:shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : `Login as ${loginType === 'admin' ? 'Admin' : 'Staff'}`}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setShowLogin(false)}
                  className="text-sm text-gray-400 hover:text-[#5D1616] transition-colors border-b border-transparent hover:border-[#5D1616]"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Cormorant+Garamond:wght@300;400;500&family=Poppins:wght@400;600;700&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
}