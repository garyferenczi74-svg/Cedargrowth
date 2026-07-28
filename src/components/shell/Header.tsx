'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, Search, User, ShoppingBag } from 'lucide-react';
import { PRIMARY_NAV, UTILITY_LEFT, type NavItem } from '@/lib/nav';
import { Wordmark } from './Wordmark';
import { MegaPanel } from './MegaPanel';
import { MobileMenu } from './MobileMenu';

const panelId = (label: string) =>
  `mega-${label.replace(/\s+/g, '-').toLowerCase()}`;

export function Header() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchNotice, setSearchNotice] = useState('');

  const navWrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const triggersRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const focusPanelOnOpen = useRef(false);

  const activeItem: NavItem | undefined = PRIMARY_NAV.find(
    (i) => i.label === active && i.columns?.length,
  );

  const close = useCallback(() => setActive(null), []);

  // Keyboard open moves focus into the panel. Hover open does not.
  useEffect(() => {
    if (activeItem && focusPanelOnOpen.current) {
      const first = panelRef.current?.querySelector<HTMLElement>('a[href]');
      first?.focus();
      focusPanelOnOpen.current = false;
    }
  }, [activeItem]);

  // Close the panel on outside pointer down.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!navWrapRef.current?.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  const onNavKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && active) {
      e.preventDefault();
      const trigger = triggersRef.current[active];
      setActive(null);
      trigger?.focus();
    }
  };

  // Close when focus leaves the nav region entirely (keyboard tab out).
  const onNavBlur = (e: React.FocusEvent) => {
    if (!navWrapRef.current?.contains(e.relatedTarget as Node)) setActive(null);
  };

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    menuBtnRef.current?.focus();
  }, []);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No search backend yet. Never fabricate results, state it plainly.
    setSearchNotice('Search is not yet available.');
  };

  const toggleSearch = () => {
    setSearchOpen((v) => {
      if (v) setSearchNotice('');
      return !v;
    });
  };

  return (
    <header className="bg-parchment">
      {/* Desktop masthead */}
      <div className="hidden md:block">
        <div className="border-b border-hairline">
          <div className="mx-auto grid max-w-content grid-cols-3 items-center px-page-margin py-4">
            <ul className="flex items-center gap-6">
              {UTILITY_LEFT.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="cedar-underline text-caption uppercase tracking-eyebrow text-tertiary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex justify-center">
              <Wordmark />
            </div>
            <ul className="flex items-center justify-end gap-6">
              <li>
                <button
                  type="button"
                  onClick={toggleSearch}
                  aria-expanded={searchOpen}
                  aria-controls="site-search"
                  className="flex items-center gap-2 text-caption uppercase tracking-eyebrow text-tertiary"
                >
                  <Search size={16} strokeWidth={1.5} aria-hidden="true" />
                  Search
                </button>
              </li>
              <li>
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-caption uppercase tracking-eyebrow text-tertiary cedar-underline"
                >
                  <User size={16} strokeWidth={1.5} aria-hidden="true" />
                  Account
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-caption uppercase tracking-eyebrow text-tertiary cedar-underline"
                >
                  <ShoppingBag size={16} strokeWidth={1.5} aria-hidden="true" />
                  Cart
                  <span className="font-mono text-data lowercase tracking-normal">
                    (0)
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          ref={navWrapRef}
          className="relative"
          onMouseLeave={close}
          onKeyDown={onNavKeyDown}
          onBlur={onNavBlur}
        >
          <nav aria-label="Primary" className="border-b border-hairline">
            <ul className="mx-auto flex max-w-content items-center justify-center gap-8 px-page-margin py-4">
              {PRIMARY_NAV.map((item) => {
                const hasColumns = Boolean(item.columns?.length);
                const isOpen = active === item.label;
                if (!hasColumns) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onMouseEnter={close}
                        onFocus={close}
                        className="cedar-underline text-body-m tracking-nav text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      ref={(el) => {
                        triggersRef.current[item.label] = el;
                      }}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-controls={panelId(item.label)}
                      onMouseEnter={() => {
                        focusPanelOnOpen.current = false;
                        setActive(item.label);
                      }}
                      onClick={() => {
                        if (isOpen) {
                          setActive(null);
                        } else {
                          focusPanelOnOpen.current = true;
                          setActive(item.label);
                        }
                      }}
                      className="cedar-underline text-body-m tracking-nav text-primary"
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {activeItem ? (
              <div ref={panelRef}>
                <MegaPanel
                  item={activeItem}
                  id={panelId(activeItem.label)}
                  onNavigate={close}
                />
              </div>
            ) : null}
          </nav>
        </div>
      </div>

      {/* Mobile bar */}
      <div className="md:hidden border-b border-hairline">
        <div className="flex items-center justify-between px-page-margin-mobile py-4">
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            className="p-1 text-primary"
          >
            <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <Wordmark />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleSearch}
              aria-expanded={searchOpen}
              aria-controls="site-search"
              aria-label="Search"
              className="p-1 text-primary"
            >
              <Search size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <Link href="/cart" aria-label="Cart, 0 items" className="p-1 text-primary">
              <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Search bar, shared. Honest empty state, no fabricated results. */}
      {searchOpen ? (
        <div
          id="site-search"
          className="border-b border-hairline bg-bone animate-fade motion-reduce:animate-none"
        >
          <form
            role="search"
            onSubmit={onSearchSubmit}
            className="mx-auto flex max-w-content items-center gap-3 px-page-margin-mobile md:px-page-margin py-4"
          >
            <label htmlFor="site-search-input" className="sr-only">
              Search CedarGrowth
            </label>
            <input
              id="site-search-input"
              type="search"
              name="q"
              autoComplete="off"
              placeholder="Search"
              className="flex-1 border-b border-hairline bg-transparent py-2 text-body-m-m md:text-body-m text-primary placeholder:text-tertiary focus-visible:outline-none focus-visible:border-cedar"
            />
            <button
              type="submit"
              className="text-caption uppercase tracking-eyebrow text-tertiary cedar-underline"
            >
              Search
            </button>
          </form>
          <p
            aria-live="polite"
            className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin pb-4 text-caption-m md:text-caption text-tertiary"
          >
            {searchNotice}
          </p>
        </div>
      ) : null}

      <MobileMenu open={mobileOpen} onClose={closeMobile} />
    </header>
  );
}
