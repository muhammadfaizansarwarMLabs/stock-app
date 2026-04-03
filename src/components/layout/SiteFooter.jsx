import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-12">
      <div className="mx-auto w-full max-w-[1800px] px-5 md:px-8 2xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Branding - Left Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">StockHive</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xs text-center md:text-left">
              Millions of free AI stock photos. Download instantly. Edit or generate variations.
            </p>
          </div>

          {/* Navigation - Center Column */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Explore</h4>
            <nav className="flex flex-col gap-3 items-center md:items-start">
              <Link
                to="/faq"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                FAQ
              </Link>
              <a
                href="#blog"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                Blog
              </a>
              <a
                href="#contact"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                Contact Us
              </a>
              <Link
                to="/about"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Legal - Right Column */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
            <nav className="flex flex-col gap-3 items-center md:items-end">
              <a
                href="#privacy"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                Terms of Service
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Divider and Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            &copy; {new Date().getFullYear()} StockHive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
