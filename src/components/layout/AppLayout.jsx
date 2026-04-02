import { Link, NavLink } from "react-router-dom";
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
  return (
    <>
      <div className="page-shell">
        <header className="sticky top-4 z-50 mb-8 flex flex-col gap-5 rounded-[2rem] bg-slate-950/70 px-6 py-5 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8 md:py-6">
          <Link to="/" className="hero-title text-3xl font-bold tracking-tight text-white md:text-4xl">
            Modern Stock Gallery
          </Link>
          <nav className="flex flex-wrap items-center gap-3" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClassName}>
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
