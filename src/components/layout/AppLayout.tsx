import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { GlobalSearch } from '@/components/dashboard/GlobalSearch';
import { HelpModal } from './HelpModal';

const COLLAPSE_KEY = 'earthwatch.sidebar.collapsed';
const ONBOARDING_KEY = 'earthwatch.onboarded';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // First-visit onboarding (shown once unless dismissed).
  useEffect(() => {
    try {
      if (localStorage.getItem(ONBOARDING_KEY) !== '1') {
        setHelpOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const dismissOnboarding = () => {
    setHelpOpen(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openHelp = () => setHelpOpen(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} onOpenHelp={openHelp} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenHelp={openHelp}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 py-4 sm:py-6">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} onOpenHelp={openHelp} />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <HelpModal open={helpOpen} onClose={dismissOnboarding} />
    </div>
  );
}
