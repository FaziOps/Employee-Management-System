import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import api, { getErrorMessage } from "../../lib/api";

function BatchesContent() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const limit = 10;

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/batches", { params: { search, status, page, limit } });
      setItems(res.data.data.items);
      setTotal(res.data.data.total);
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
    if (!confirm("Delete this batch? This cannot be undone.")) return;
    try {
      await api.delete(`/batches/${id}`);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  const columns = [
    { key: "id", label: "Batch ID" },
    { key: "name", label: "Name" },
    { key: "domain", label: "Domain" },
    {
      key: "startDate",
      label: "Start Date",
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      label: "End Date",
      render: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      key: "internees",
      label: "No. of Internees",
      render: (row) => row._count?.internees ?? 0,
    },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <div className="flex gap-3 text-xs">
          <Link href={`/batches/${row.id}`} className="text-brandBlue hover:underline">
            View
          </Link>
          <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:underline">
            Delete
          </button>
        </div>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Layout title="Batches" breadcrumb="View all batches">
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-4 gap-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-3 flex-1 max-w-lg">
          <input
            className="input-field"
            placeholder="Search by name or domain"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-field w-40"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button type="submit" className="btn-secondary text-sm">
            Search
          </button>
        </form>
        <Link href="/batches/create" className="btn-primary text-sm whitespace-nowrap">
          + Add New Batch
        </Link>
      </div>

      <DataTable columns={columns} rows={items} loading={loading} />

      <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
        <span>
          Showing {items.length ? (page - 1) * limit + 1 : 0}-{(page - 1) * limit + items.length} of {total}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn-secondary py-1 px-3 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-2 py-1">{page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="btn-secondary py-1 px-3 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default function Batches() {
  return (
    <ProtectedRoute>
      <BatchesContent />
    </ProtectedRoute>
  );
}
