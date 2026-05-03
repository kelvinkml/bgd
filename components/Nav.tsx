import Link from "next/link";

const links = [
  { href: "/bags", label: "Bags" },
  { href: "/archive", label: "Archive" },
  { href: "/design", label: "Design Yours" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          bgd
        </Link>
        <nav className="flex gap-6 text-sm text-stone-700">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-stone-900 hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
