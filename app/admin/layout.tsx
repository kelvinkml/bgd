import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <Link href="/admin" className="text-sm font-medium text-stone-700 hover:text-stone-900">
          Admin
        </Link>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
