"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LayoutClientProviderProps {
  children: React.ReactNode;
}

export function LayoutClientProvider({ children }: LayoutClientProviderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = ""; // Clean up on unmount
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <Header
        onMobileMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <main className="flex-grow">{children}</main>
      <Footer />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center space-y-8"
          >
            <Link
              href="/create"
              className="text-2xl font-semibold text-gray-800 hover:text-purple-600 transition-colors pt-20"
              onClick={toggleMobileMenu}
            >
              Create Memory
            </Link>
            <Link
              href="/gallery"
              className="text-2xl font-semibold text-gray-800 hover:text-pink-600 transition-colors"
              onClick={toggleMobileMenu}
            >
              View Gallery
            </Link>
            <Button
              size="lg"
              className="w-48 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={toggleMobileMenu}
            >
              Sign In
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
