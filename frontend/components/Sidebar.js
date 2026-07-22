import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/batches", label: "Batches", icon: "☰" },
  { href: "/batches/create", label: "Create Batch", icon: "＋" },
  { href: "/internees", label: "Internees", icon: "☺" },
  { href: "/internees/create", label: "Create Internee", icon: "＋" },
  { href: "/assets", label: "Assets", icon: "▣" },
];

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 bg-sidebarBg border-r border-gray-800 min-h-screen flex flex-col px-4 py-6">
      <div className="mb-8 flex justify-center w-full">
        <Logo variant="vertical" size="md" />
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-panelLight text-brandGreen border-l-2 border-brandGreen"
                  : "text-gray-300 hover:bg-panelLight"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-panelLight transition-colors mt-4"
      >
        <span>⏻</span> Logout
      </button>
    </aside>
  );
}
