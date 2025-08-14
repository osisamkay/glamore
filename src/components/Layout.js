"use client";

import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, type }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar type={type} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
