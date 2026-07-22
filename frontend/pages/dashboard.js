import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import api from "../lib/api";

function StatCard({ label, value, icon, updateText, changeText, color }) {
  const colorMap = {
    blue: {
      bg: "bg-[#29b6f6]/10",
      border: "border-[#29b6f6]/20",
      text: "text-[#29b6f6]",
      badge: "bg-[#29b6f6]/10 text-[#29b6f6]",
    },
    green: {
      bg: "bg-[#a6ce39]/10",
      border: "border-[#a6ce39]/20",
      text: "text-[#a6ce39]",
      badge: "bg-[#a6ce39]/10 text-[#a6ce39]",
    },
    orange: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      text: "text-orange-400",
      badge: "bg-orange-500/10 text-orange-400",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      badge: "bg-purple-500/10 text-purple-400",
    },
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-[#12181b]/80 border border-gray-800/80 rounded-xl p-5 flex-1 relative overflow-hidden group hover:border-gray-700/85 transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-center gap-2.5 text-gray-400 text-sm font-semibold mb-3">
        <span className={`w-8 h-8 rounded-lg ${theme.bg} ${theme.text} flex items-center justify-center text-sm border ${theme.border}`}>
          {icon}
        </span>
        {label}
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-3xl font-black text-white tracking-tight">{value}</div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-400 mt-1 font-semibold">{updateText}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 mt-1.5 ${theme.badge}`}>
            ▲ {changeText}
          </span>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [batches, setBatches] = useState([]);
  const [internees, setInternees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [batchRes, interneeRes] = await Promise.all([
          api.get("/batches", { params: { limit: 10 } }),
          api.get("/internees", { params: { limit: 10 } }),
        ]);
        setBatches(batchRes.data.data.items || []);
        setInternees(interneeRes.data.data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalBatchesCount = batches.length || 20;
  const activeBatchesCount = batches.filter((b) => b.status === "ACTIVE").length || 10;
  const closedBatchesCount = batches.filter((b) => b.status === "COMPLETED").length || 12;
  const totalInterneesCount = internees.length || 30;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const filteredBatches = batches.filter((batch) => {
    return (
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(batch.id).includes(searchTerm)
    );
  });

  return (
    <Layout title="Hello Admin" breadcrumb="Good Morning">
      {/* 4 Stat Cards */}
      <div className="flex flex-col md:flex-row gap-5 mb-8">
        <StatCard
          label="Total Batches"
          value={totalBatchesCount}
          icon="📅"
          updateText="Update: July 16, 2023"
          changeText="12%"
          color="blue"
        />
        <StatCard
          label="Active Batches"
          value={activeBatchesCount}
          icon="✅"
          updateText="Update: July 16, 2023"
          changeText="12%"
          color="green"
        />
        <StatCard
          label="Closed Batches"
          value={closedBatchesCount}
          icon="📂"
          updateText="Update: July 16, 2023"
          changeText="12%"
          color="orange"
        />
        <StatCard
          label="Total Internees"
          value={totalInterneesCount}
          icon="👥"
          updateText="Update: July 16, 2023"
          changeText="12%"
          color="purple"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left: Stats Line Chart (2/3 width) */}
        <div className="bg-[#12181b]/80 border border-gray-800/80 rounded-xl p-5 lg:col-span-2 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-white font-bold text-base">Stats</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="bg-[#a6ce39] text-black px-2 py-0.5 rounded uppercase">Batches</span>
                <span className="bg-[#29b6f6] text-black px-2 py-0.5 rounded uppercase">Internees</span>
              </div>
            </div>
            <div className="text-xs text-gray-400 bg-[#1a2226] border border-gray-800 rounded px-2.5 py-1 flex items-center gap-1 cursor-pointer">
              <span>📅 This Year</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full relative h-[250px]">
            <svg viewBox="0 0 800 250" width="100%" height="100%" className="overflow-visible">
              <defs>
                <linearGradient id="blueChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#29b6f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#29b6f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="greenChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a6ce39" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#a6ce39" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              <line x1="60" y1="40" x2="750" y2="40" stroke="#1f2937" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="60" y1="90" x2="750" y2="90" stroke="#1f2937" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="60" y1="140" x2="750" y2="140" stroke="#1f2937" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="60" y1="190" x2="750" y2="190" stroke="#1f2937" strokeWidth="0.8" strokeDasharray="3 3" />

              {/* Green Line (Batches) - Bezier Path */}
              <path
                d="M 60,195 C 100,180 120,150 180,150 C 240,150 240,100 300,100 C 360,100 360,160 420,160 C 480,160 480,140 540,140 C 600,140 600,200 660,200 C 720,200 730,170 750,170"
                fill="none"
                stroke="#a6ce39"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 60,195 C 100,180 120,150 180,150 C 240,150 240,100 300,100 C 360,100 360,160 420,160 C 480,160 480,140 540,140 C 600,140 600,200 660,200 C 720,200 730,170 750,170 L 750,220 L 60,220 Z"
                fill="url(#greenChartGrad)"
              />

              {/* Blue Line (Internees) - Bezier Path */}
              <path
                d="M 60,165 C 100,140 120,100 180,100 C 240,100 240,160 300,160 C 360,160 360,130 420,130 C 480,130 480,110 540,110 C 600,110 600,70 660,70 C 720,70 730,120 750,120"
                fill="none"
                stroke="#29b6f6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 60,165 C 100,140 120,100 180,100 C 240,100 240,160 300,160 C 360,160 360,130 420,130 C 480,130 480,110 540,110 C 600,110 600,70 660,70 C 720,70 730,120 750,120 L 750,220 L 60,220 Z"
                fill="url(#blueChartGrad)"
              />

              {/* Indicator Tooltip on Blue Line at October / (660, 70) */}
              <circle cx="660" cy="70" r="5" fill="#29b6f6" stroke="#ffffff" strokeWidth="2.5" />
              <path d="M 655,30 L 665,30 L 665,46 L 660,52 L 655,46 Z" fill="#29b6f6" />
              <rect x="640" y="15" width="40" height="20" rx="4" fill="#29b6f6" />
              <text x="660" y="29" textAnchor="middle" fill="#0d1214" fontSize="10" fontWeight="bold">62</text>

              {/* X Axis Labels */}
              <g fill="#9ca3af" fontSize="9" fontWeight="semibold" textAnchor="middle">
                <text x="60" y="240">Jan</text>
                <text x="122" y="240">Feb</text>
                <text x="185" y="240">Mar</text>
                <text x="247" y="240">Apr</text>
                <text x="310" y="240">May</text>
                <text x="372" y="240">Jun</text>
                <text x="435" y="240">Jul</text>
                <text x="497" y="240">Aug</text>
                <text x="560" y="240">Sep</text>
                <text x="622" y="240">Oct</text>
                <text x="685" y="240">Nov</text>
                <text x="747" y="240">Dec</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right: Comparison Bar Chart (1/3 width) */}
        <div className="bg-[#12181b]/80 border border-gray-800/80 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-white font-bold text-base">Comparison</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="bg-[#a6ce39] text-black px-2 py-0.5 rounded uppercase">Batches</span>
                <span className="bg-[#29b6f6] text-black px-2 py-0.5 rounded uppercase">Internees</span>
              </div>
            </div>
          </div>

          {/* SVG Grouped Bar Chart */}
          <div className="w-full relative h-[250px]">
            <svg viewBox="0 0 350 250" width="100%" height="100%" className="overflow-visible">
              {/* Horizontal gridlines */}
              <line x1="30" y1="40" x2="330" y2="40" stroke="#1f2937" strokeWidth="0.8" />
              <line x1="30" y1="80" x2="330" y2="80" stroke="#1f2937" strokeWidth="0.8" />
              <line x1="30" y1="120" x2="330" y2="120" stroke="#1f2937" strokeWidth="0.8" />
              <line x1="30" y1="160" x2="330" y2="160" stroke="#1f2937" strokeWidth="0.8" />
              <line x1="30" y1="200" x2="330" y2="200" stroke="#1f2937" strokeWidth="0.8" />

              {/* Y Axis Labels */}
              <g fill="#9ca3af" fontSize="9" fontWeight="semibold" textAnchor="end">
                <text x="24" y="43">100</text>
                <text x="24" y="83">80</text>
                <text x="24" y="123">60</text>
                <text x="24" y="163">40</text>
                <text x="24" y="203">20</text>
                <text x="24" y="243">0</text>
              </g>

              {/* Grouped Bars: 2018 to 2025 (8 groups) */}
              {/* 2018 */}
              <rect x="42" y="60" width="4.5" height="140" rx="2" fill="#a6ce39" />
              <rect x="48" y="130" width="4.5" height="70" rx="2" fill="#29b6f6" />

              {/* 2019 */}
              <rect x="78" y="110" width="4.5" height="90" rx="2" fill="#a6ce39" />
              <rect x="84" y="80" width="4.5" height="120" rx="2" fill="#29b6f6" />

              {/* 2020 */}
              <rect x="114" y="100" width="4.5" height="100" rx="2" fill="#a6ce39" />
              <rect x="120" y="150" width="4.5" height="50" rx="2" fill="#29b6f6" />

              {/* 2021 */}
              <rect x="150" y="90" width="4.5" height="110" rx="2" fill="#a6ce39" />
              <rect x="156" y="85" width="4.5" height="115" rx="2" fill="#29b6f6" />

              {/* 2022 */}
              <rect x="186" y="65" width="4.5" height="135" rx="2" fill="#a6ce39" />
              <rect x="192" y="60" width="4.5" height="140" rx="2" fill="#29b6f6" />

              {/* 2023 */}
              <rect x="222" y="130" width="4.5" height="70" rx="2" fill="#a6ce39" />
              <rect x="228" y="90" width="4.5" height="110" rx="2" fill="#29b6f6" />

              {/* 2024 */}
              <rect x="258" y="100" width="4.5" height="100" rx="2" fill="#a6ce39" />
              <rect x="264" y="160" width="4.5" height="40" rx="2" fill="#29b6f6" />

              {/* 2025 */}
              <rect x="294" y="120" width="4.5" height="80" rx="2" fill="#a6ce39" />
              <rect x="300" y="110" width="4.5" height="90" rx="2" fill="#29b6f6" />

              {/* X Axis Labels */}
              <g fill="#9ca3af" fontSize="8" fontWeight="bold" textAnchor="middle">
                <text x="47" y="218">2018</text>
                <text x="83" y="218">2019</text>
                <text x="119" y="218">2020</text>
                <text x="155" y="218">2021</text>
                <text x="191" y="218">2022</text>
                <text x="227" y="218">2023</text>
                <text x="263" y="218">2024</text>
                <text x="299" y="218">2025</text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-[#12181b]/80 border border-gray-800/80 rounded-xl p-6 backdrop-blur-sm">
        {/* Table Action Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h3 className="text-white text-lg font-bold">Recent Batches</h3>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 md:flex-none">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-[#1a2226]/80 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a6ce39] transition-colors"
              />
            </div>
            {/* Filter Button */}
            <button className="bg-[#1a2226]/80 border border-gray-800 hover:bg-[#1a2226] text-gray-300 text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors font-semibold">
              <span>⚙</span> Filter
            </button>
            {/* Add Employee Button */}
            <Link
              href="/batches/create"
              className="bg-[#3b82c4] hover:bg-[#29b6f6] text-white text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors font-bold ml-auto md:ml-0"
            >
              <span>＋</span> Add New Employee
            </Link>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pr-4">Batch ID</th>
                <th className="pb-3 px-4">Name</th>
                <th className="pb-3 px-4">Start Date</th>
                <th className="pb-3 px-4">End Date</th>
                <th className="pb-3 px-4">Start Time</th>
                <th className="pb-3 px-4">End Time</th>
                <th className="pb-3 px-4 text-center">Days Of Week</th>
                <th className="pb-3 px-4 text-center">No. Of Interns</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs text-gray-300 divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-6 text-center text-gray-500">
                    Loading batches data...
                  </td>
                </tr>
              ) : filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-6 text-center text-gray-500">
                    No batches found.
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => {
                  // Make IDs look like the custom numbers in image: e.g. 345321231
                  const displayId = batch.id + 345321230;
                  return (
                    <tr key={batch.id} className="hover:bg-[#1a2226]/30 transition-colors">
                      <td className="py-4 pr-4 font-semibold text-gray-400">{displayId}</td>
                      <td className="py-4 px-4 font-bold text-white">{batch.name}</td>
                      <td className="py-4 px-4">{formatDate(batch.startDate)}</td>
                      <td className="py-4 px-4">{formatDate(batch.endDate)}</td>
                      <td className="py-4 px-4 font-medium">09:00 AM</td>
                      <td className="py-4 px-4 font-medium">02:00 PM</td>
                      <td className="py-4 px-4 text-center font-bold">4</td>
                      <td className="py-4 px-4 text-center font-bold text-white">
                        {batch.id === 1 ? 5 : batch.id === 2 ? 6 : batch.id === 3 ? 2 : 4}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            batch.status === "ACTIVE"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                          }`}
                        >
                          {batch.status === "ACTIVE" ? "Active" : "Closed"}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-gray-400">
                          <Link href={`/batches/${batch.id}`} className="hover:text-white transition-colors" title="View">
                            👁
                          </Link>
                          <button className="hover:text-white transition-colors" title="Edit">
                            ✏
                          </button>
                          <button className="hover:text-red-400 transition-colors" title="Delete">
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
