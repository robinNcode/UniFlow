import { Outlet } from 'react-router-dom';
import Header from './Header';
import MobileNav from './MobileNav';
import Footer from './Footer';

export default function AppShell() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F1F5F9]">
      <Header />
      <main className="flex-1 w-full animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-14">
          <Outlet />
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
