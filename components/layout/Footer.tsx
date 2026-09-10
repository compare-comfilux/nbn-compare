import Link from "next/link";
import DataAttribution from "@/components/ui/DataAttribution";

const COLUMNS = [
  {
    title: "Compare",
    links: [
      { href: "/compare", label: "Compare NBN" },
      { href: "/guides", label: "NBN Guides" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/methodology", label: "Methodology" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="flex items-center gap-2 font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-700 text-xs text-white">
                NC
              </span>
              Compare NBN
            </p>
            <p className="mt-3 text-sm text-slate-500">
              An independent comparison platform. Always verify plan details
              with the provider before signing up.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-slate-900">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-teal-800"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Compare NBN, a comfilux.com.au
            project. All rights reserved.
          </p>
          <DataAttribution className="mt-2" />
        </div>
      </div>
    </footer>
  );
}
