"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ type }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#56193F]">
      <div className="container max-w-[1440px] mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Left side: Hamburger Menu Icon */}
          <div className="flex-1">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white color-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/">
              <Image src="/logo.svg" alt="GlamourGlow Fashion Logo" width={165} height={73} />
            </Link>
          </div>

          {/* Right side: Icons and Auth Links */}
          <div className="flex-1 flex justify-end items-center text-white space-x-8 text-sm">
            <Link href="#" className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.5 9h17M12 2.5c-2.485 0-4.5 2.015-4.5 4.5 0 .876.273 1.685.758 2.35M12 21.5c2.485 0 4.5-2.015 4.5-4.5 0-.876-.273-1.685-.758-2.35" /></svg>
              <span>CA</span>
            </Link>
            <Link href="/search">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link href="/cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 relative">
                    <Image
                      src="/images/avatar.svg"
                      alt="User avatar"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="hidden md:block text-sm">{user?.firstName || 'User'}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link 
                      href="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">Sign in</Link>
                <span>|</span>
                <Link href="/signup">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-navigation bar */}
      {type !== 'nobottom' && <div className="bg-white text-black">
        <div className="container max-w-[1146px] mx-auto px-6 py-6 flex justify-between items-center space-x-12 text-sm font-medium uppercase tracking-wider">
            <Link href="/" className="hover:text-[#56193f]">Home</Link>
            <Link href="/women" className="hover:text-[#56193f]">Women</Link>
            <Link href="/men" className="hover:text-[#56193f]">Men</Link>
            <Link href="/kids" className="hover:text-[#56193f]">Kids</Link>
            <Link href="/tailored" className="hover:text-[#56193f]">Tailored</Link>
            <Link href="/accessories" className="hover:text-[#56193f]">Accessories</Link>
            <Link href="/enquiry" className="hover:text-[#56193f]">Enquiry</Link>
        </div>
      </div>}

      {/* Hamburger Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 bg-white text-black w-80 shadow-lg z-40 p-5">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <ul className="flex flex-col space-y-4 text-sm uppercase tracking-wider mt-8">
            <li>
              <Link href="/women" className="font-semibold text-gray-800">Women</Link>
              <ul className="pl-4 mt-2 space-y-2 font-normal normal-case tracking-normal">
                <li><Link href="/women/all" className="text-gray-600 hover:text-black">All</Link></li>
                <li><Link href="/women/tops" className="text-gray-600 hover:text-black">Tops</Link></li>
                <li><Link href="/women/bottoms" className="text-gray-600 hover:text-black">Bottoms</Link></li>
                <li><Link href="/women/dresses" className="text-gray-600 hover:text-black">Dresses</Link></li>
              </ul>
            </li>
            <li>
              <Link href="/men" className="font-semibold text-gray-800">Men</Link>
              <ul className="pl-4 mt-2 space-y-2 font-normal normal-case tracking-normal">
                <li><Link href="/men/all" className="text-gray-600 hover:text-black">All</Link></li>
                <li><Link href="/men/agbada" className="text-gray-600 hover:text-black">Agbada</Link></li>
                <li><Link href="/men/shirts" className="text-gray-600 hover:text-black">Shirts</Link></li>
                <li><Link href="/men/pants" className="text-gray-600 hover:text-black">Pants</Link></li>
              </ul>
            </li>
            <li>
              <Link href="/kids" className="font-semibold text-gray-800">Kids</Link>
              <ul className="pl-4 mt-2 space-y-2 font-normal normal-case tracking-normal">
                <li><Link href="/kids/all" className="text-gray-600 hover:text-black">All</Link></li>
                <li><Link href="/kids/girls" className="text-gray-600 hover:text-black">Girls</Link></li>
                <li><Link href="/kids/boys" className="text-gray-600 hover:text-black">Boys</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
