"use client";

import Link from "next/link";
import { ShieldCheck, Users, Utensils, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const portals = [
    {
      title: "Admin Portal",
      description: "Manage menu, staff, tables, and view restaurant analytics.",
      href: "/admin",
      icon: <ShieldCheck className="w-12 h-12 text-[#C8A951]" />,
      color: "from-[#2D0A0F] to-[#5D1616]",
      delay: 0.1,
    },
    {
      title: "Staff Portal",
      description: "Track live orders, manage tables, and handle service requests.",
      href: "/staff",
      icon: <Users className="w-12 h-12 text-[#C8A951]" />,
      color: "from-[#1A0505] to-[#2D0A0F]",
      delay: 0.2,
    },
    {
      title: "Customer View",
      description: "Preview the digital menu and ordering experience.",
      href: "/customer/scan-qr",
      icon: <Utensils className="w-12 h-12 text-[#C8A951]" />,
      color: "from-[#5D1616] to-[#7B1F1F]",
      delay: 0.3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF6EE] relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url('/images/pattern.jpg')",
          backgroundSize: "420px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="max-w-6xl w-full z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-[#2D0A0F] border-2 border-[#C8A951] shadow-xl">
              <svg className="w-12 h-12 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#2D0A0F] mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Management Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Welcome to the Restaurant POS & Table Management System. Select your entry point below to access specialized management tools.
          </p>
        </motion.div>

        {/* Portal Cards Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal) => (
            <motion.div
              key={portal.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: portal.delay, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <Link href={portal.href}>
                <div className={`h-full p-8 rounded-3xl bg-gradient-to-br ${portal.color} border border-[#C8A951]/20 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-all duration-500 flex flex-col justify-between relative overflow-hidden`}>
                  {/* Subtle Grain Overlay */}
                  <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                  
                  {/* Icon and Content */}
                  <div>
                    <div className="mb-6 p-3 w-fit rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                      {portal.icon}
                    </div>
                    <h2 className="text-2xl font-serif text-[#FFF8E1] mb-3">{portal.title}</h2>
                    <p className="text-[#E8DCC8]/80 text-sm leading-relaxed mb-8">
                      {portal.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-[#C8A951] font-semibold text-sm group-hover:gap-4 transition-all duration-300">
                    ENTER PORTAL <ArrowRight size={18} />
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A951]/5 rounded-bl-full translate-x-12 -translate-y-12" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center text-gray-400 text-sm uppercase tracking-[0.2em]"
        >
          © 2026 Premium POS System • Unified Management Dashboard
        </motion.div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Cormorant+Garamond:wght@300;500&family=Poppins:wght@400;600&display=swap');
      `}</style>
    </div>
  );
}