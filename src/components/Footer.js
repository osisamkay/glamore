"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#56193F] text-white/90 font-light">
      <div className="container max-w-[1324px] mx-auto px-4 pt-16 pb-8">
        {/* Top section with links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          {/* Column 1 - Brand */}
          <div>
            <h3 className="font-serif text-base tracking-[0.2em] uppercase mb-4">Glamour Glow Fashion</h3>
          </div>

          {/* Column 2 - Showroom */}
          <div>
            <h3 className="uppercase tracking-wider mb-4 text-white">Showroom By Appointment Only</h3>
            <div className="space-y-1">
              <p>1234 Cookie Rd, Toronto, ON, L9T 2S4</p>
              <p>+1 (120) 790 8888</p>
            </div>
          </div>

          {/* Column 3 - Quick Links */}
          <div>
            <h3 className="uppercase tracking-wider mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
            </ul>
          </div>

          {/* Column 4 - More */}
          <div>
            <h3 className="uppercase tracking-wider mb-4 text-white">More</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:underline">Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:underline">Shipping Policy</Link></li>
              <li><Link href="/do-not-sell" className="hover:underline">Do not sell or share my personal information</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom section with copyright and social */}
      <div className="border-t border-white/20 mt-8">
        <div className="container max-w-[1324px] mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-xs">
          
          {/* Left side: Social Icons and Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto text-center md:text-left">
            <div className="flex items-center gap-4 order-1 md:order-2 mb-4 md:mb-0">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-white">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-white">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
              </a>
            </div>
             <p className="tracking-wider order-2 md:order-1">&copy; 2025 - GLAMOURGLOWFASHION INC.</p>
          </div>

          {/* Right side: Language Switcher */}
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <button className="hover:underline">English</button>
            <span>|</span>
            <button className="hover:underline">Français</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
