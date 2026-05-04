import Link from "next/link";

export const metadata = { title: "Admin — bgd" };

const actions = [
  {
    href: "/admin/add-bag",
    title: "Add a bag",
    description: "Create a new bag listing.",
  },
  {
    href: "/admin/delete-bag",
    title: "Delete a bag",
    description: "Remove an existing bag listing.",
  },
  {
    href: "/admin/inventory",
    title: "Inventory",
    description: "Track materials in stock — fabrics, hardware, webbing, misc.",
  },
];

export default function AdminHome() {
  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-sm text-stone-600 mt-1">Site management.</p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className="block p-4 border border-stone-200 hover:border-stone-400 transition-colors"
            >
              <h2 className="font-medium text-stone-900">{a.title}</h2>
              <p className="text-sm text-stone-600 mt-1">{a.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
