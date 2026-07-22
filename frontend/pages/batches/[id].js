import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import api, { getErrorMessage } from "../../lib/api";

function BatchViewContent() {
  const router = useRouter();
  const { id } = router.query;
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get(`/batches/${id}`);
      setBatch(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: "id", label: "Intern ID" },
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  if (loading) {
    return (
      <Layout title="Batch / View">
        <p className="text-gray-400">Loading...</p>
      </Layout>
    );
  }

  if (error || !batch) {
    return (
      <Layout title="Batch / View">
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-2.5">
          {error || "Batch not found."}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Batch / View" breadcrumb={`Batches > ${batch.name}`}>
      <div className="card p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">{batch.name}</h2>
            <p className="text-gray-400 text-sm">{batch.domain}</p>
          </div>
          <StatusBadge status={batch.status} />
        </div>

        <div className="grid grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="text-white">{new Date(batch.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500">End Date</p>
            <p className="text-white">{new Date(batch.endDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500">No. of Internees</p>
            <p className="text-white">{batch.internees?.length ?? 0}</p>
          </div>
          <div>
            <p className="text-gray-500">No. of Tenures</p>
            <p className="text-white">{batch.tenures?.length ?? 0}</p>
          </div>
        </div>

        {batch.description && (
          <div className="mt-6">
            <p className="text-gray-500 text-sm mb-1">Description / Roadmap</p>
            <p className="text-gray-200 text-sm">{batch.description}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Internees in this Batch</h3>
        <Link href="/internees/create" className="btn-primary text-sm py-2">
          + Add Internee
        </Link>
      </div>
      <DataTable columns={columns} rows={batch.internees || []} loading={false} />
    </Layout>
  );
}

export default function BatchView() {
  return (
    <ProtectedRoute>
      <BatchViewContent />
    </ProtectedRoute>
  );
}
