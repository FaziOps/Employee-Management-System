import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import api, { getErrorMessage } from "../../lib/api";

function InterneesContent() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/internees", { params: { search, page, limit: pageSize } });
      setItems(res.data.data.items || []);
      setTotal(res.data.data.total || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this internee? This cannot be undone.")) return;
    try {
      await api.delete(`/internees/${id}`);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  // Parse extra details stored in tenure remarks JSON
  const getExtraDetails = (row) => {
    if (row.tenures && row.tenures.length > 0) {
      try {
        const parsed = JSON.parse(row.tenures[0].remarks);
        return parsed.extra || {};
      } catch (e) {}
    }
    return {};
  };

  const renderAvatar = (name) => {
    const initials = name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "IN";
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#29b6f6]/20 to-[#a6ce39]/20 text-[#29b6f6] border border-gray-700/50 flex items-center justify-center font-bold text-xs shrink-0 select-none">
        {initials}
      </div>
    );
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Layout title="Internees" breadcrumb="List of all internees">
      <div className="bg-[#12181b]/80 border border-gray-800/80 rounded-xl p-6 backdrop-blur-sm">
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-2.5 mb-5">
            {error}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 md:flex-none">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 bg-[#1a2226]/80 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a6ce39] transition-colors"
              />
            </div>
            {/* Filter Button */}
            <button
              type="submit"
              className="bg-[#1a2226]/80 border border-gray-800 hover:bg-[#1a2226] text-gray-300 text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors font-semibold"
            >
              <span>⚙</span> Filter
            </button>
          </form>

          {/* Add Employee Button */}
          <Link
            href="/internees/create"
            className="bg-[#3b82c4] hover:bg-[#29b6f6] text-white text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors font-bold ml-auto md:ml-0"
          >
            <span>＋</span> Add New Employee
          </Link>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pr-4">Intern ID</th>
                <th className="pb-3 px-4">Internee Name</th>
                <th className="pb-3 px-4">Email</th>
                <th className="pb-3 px-4">Phone</th>
                <th className="pb-3 px-4">Gender</th>
                <th className="pb-3 px-4">City</th>
                <th className="pb-3 px-4">Batch</th>
                <th className="pb-3 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs text-gray-300 divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-gray-500">
                    Loading internees data...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-gray-500">
                    No internees found.
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  const displayId = row.id + 345321230;
                  const extra = getExtraDetails(row);
                  const gender = extra.gender || "Male";
                  const city = extra.city || "Faisalabad";
                  const batchName = row.batch?.name || "Winter 25";

                  return (
                    <tr key={row.id} className="hover:bg-[#1a2226]/30 transition-colors">
                      <td className="py-4 pr-4 font-semibold text-gray-400">{displayId}</td>
                      <td className="py-4 px-4 font-bold text-white">
                        <div className="flex items-center gap-2.5">
                          {renderAvatar(row.fullName)}
                          <span>{row.fullName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-450">{row.email}</td>
                      <td className="py-4 px-4 font-semibold">{row.phone}</td>
                      <td className="py-4 px-4">{gender}</td>
                      <td className="py-4 px-4 text-gray-300">{city}</td>
                      <td className="py-4 px-4">
                        <span className="text-[10px] font-bold text-[#29b6f6] hover:underline cursor-pointer">
                          {batchName}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex items-center justify-end gap-3 text-gray-400">
                          <Link href={`/internees/${row.id}`} className="hover:text-white transition-colors" title="View">
                            👁
                          </Link>
                          <button className="hover:text-white transition-colors" title="Edit">
                            ✏
                          </button>
                          <button onClick={() => handleDelete(row.id)} className="hover:text-red-400 transition-colors" title="Delete">
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

        {/* Pagination Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span>Showing</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPage(1);
              }}
              className="bg-[#1a2226] border border-gray-800 rounded px-2.5 py-1 text-white focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>
              Showing {items.length ? (page - 1) * pageSize + 1 : 0}-{(page - 1) * pageSize + items.length} out of {total} records
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-gray-800 hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded border font-semibold transition-colors ${
                    page === p
                      ? "border-[#a6ce39] text-[#a6ce39] bg-[#a6ce39]/10"
                      : "border-gray-850 hover:bg-gray-800 text-gray-400"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-gray-800 hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function Internees() {
  return (
    <ProtectedRoute>
      <InterneesContent />
    </ProtectedRoute>
  );
}
