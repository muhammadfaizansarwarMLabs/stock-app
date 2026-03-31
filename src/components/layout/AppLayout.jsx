import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Discover" },
  { to: "/favorites", label: "Favorites" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" }
];

const navClassName = ({ isActive }) =>
  [
    "rounded-full px-4 py-2 text-sm font-semibold transition",
    isActive ? "bg-white text-slate-900" : "text-slate-100 hover:bg-white/20"
  ].join(" ");

export function AppLayout({ children }) {
  return (
    <div className="page-shell">
      <header className="mb-6 flex flex-col gap-4 rounded-3xl bg-slate-950/50 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
        <Link to="/" className="hero-title text-2xl font-bold tracking-tight text-white">
          Modern Stock Gallery
        </Link>
        <nav className="flex flex-wrap items-center gap-2" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClassName}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
