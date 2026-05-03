import { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { Logo } from './Logo';
import { SideMenu } from './SideMenu';

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-canvas-border bg-canvas-card/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 text-navy-700 hover:bg-navy-50"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <Logo size="md" />
          <button
            className="rounded-full border border-canvas-border bg-canvas p-1.5 text-navy-700 hover:bg-navy-50"
            aria-label="Perfil"
          >
            <User size={18} />
          </button>
        </div>
      </header>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
