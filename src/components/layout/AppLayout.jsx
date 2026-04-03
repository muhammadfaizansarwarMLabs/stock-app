import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { DownloadButton } from "../bulk-download/DownloadButton";
import { ThemeToggle } from "../theme/ThemeToggle";
import { SiteFooter } from "./SiteFooter";
import { ErrorBanner } from "./ErrorBanner";

const navItems = [
  { to: "/", label: "Discover" },
  { to: "/favorites", label: "Favorites" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" }
];

const navClassName = ({ isActive }) =>
  [
    "rounded-full px-5 py-3 text-base font-semibold transition",
    isActive ? "bg-white text-slate-900" : "text-slate-100 hover:bg-white/20"
  ].join(" ");

export function AppLayout({ children }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((current) => !current);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="page-shell">
        <header className="sticky top-4 z-50 mb-8 rounded-[2rem] bg-slate-950/70 px-6 py-5 backdrop-blur md:px-8 md:py-6">
          <div className="flex items-center justify-between gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="hero-title inline-flex items-center gap-3 text-3xl font-bold tracking-tight text-white md:text-4xl"
            >
              <img
                src="/images/logo.png"
                alt="StockHive logo"
                className="h-10 w-10 rounded-xl object-cover md:h-12 md:w-12"
              />
              <span>StockHive</span>
            </Link>

            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="primary-navigation"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-3 py-2 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 md:hidden"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5Zm0 5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Zm0 5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 15Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          <nav
            id="primary-navigation"
            className={`${isMobileMenuOpen ? "mt-4 flex" : "hidden"} flex-col gap-3 md:mt-0 md:flex md:flex-row md:flex-wrap md:items-center`}
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClassName} onClick={closeMobileMenu}>
                {item.label}
              </NavLink>
            ))}
            <DownloadButton />
            <ThemeToggle />
          </nav>
        </header>
        <ErrorBanner />
        <main>{children}</main>
      </div>
      <SiteFooter />
    </>
  );
}
