import { Outlet } from 'react-router-dom';
import Header from './Header';
import MobileNav from './MobileNav';
import Footer from './Footer';

/**
 * AppShell — the main layout wrapper for authenticated pages.
 * Provides the header, mobile nav, footer, and a main content area.
 */
export default function AppShell() {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-12 animate-fade-in">
        <Outlet />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
