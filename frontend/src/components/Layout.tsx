import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import StarBackground from './StarBackground';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen relative flex flex-col">
      <StarBackground />
      <Header />
      <main className="flex-1 relative z-10 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
