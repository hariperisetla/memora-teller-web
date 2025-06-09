"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
      className="w-full bg-white bg-opacity-80 backdrop-blur-md border-t border-gray-100 py-8 mt-auto"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <Link
            href="/"
            className="flex items-center justify-center md:justify-start space-x-2 mb-2"
          >
            <Camera className="w-7 h-7 text-purple-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              MemoraTeller
            </span>
          </Link>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} MemoraTeller. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
          <Link
            href="/privacy"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            Contact Us
          </Link>
        </div>

        <div className="flex space-x-4">
          <a
            href="#"
            aria-label="Facebook"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="text-gray-600 hover:text-pink-600 transition-colors"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="text-gray-600 hover:text-blue-400 transition-colors"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="text-gray-600 hover:text-blue-700 transition-colors"
          >
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
