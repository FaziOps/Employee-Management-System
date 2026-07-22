import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Layout({ title, breadcrumb, children }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#0d1214] relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#8bc34a]/12 blur-[150px] pointer-events-none z-0" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#3b82c4]/12 blur-[150px] pointer-events-none z-0" />

      <div className="z-10 flex w-full relative">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen bg-[#0d1214]/40 backdrop-blur-[20px]">
          <header className="flex items-center justify-between px-8 py-4 border-b border-gray-805 bg-gradient-to-r from-[#0d1214]/60 to-[#12181b]/60 backdrop-blur-md">
            <div>
              <h1 className="text-lg font-bold text-white">{title}</h1>
              {breadcrumb && <p className="text-xs text-gray-400 mt-0.5">{breadcrumb}</p>}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 font-medium">Hello, {user?.name || "Admin"}</span>
              <div className="w-9 h-9 rounded-full bg-[#1a2226]/80 border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-[#1a2226] transition-colors">
                🔔
              </div>
            </div>
          </header>
          <main className="flex-1 p-8 z-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
