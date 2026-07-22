import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import api, { getErrorMessage } from "../../lib/api";

function AssetsContent() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [internees, setInternees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    assetTag: "",
    name: "",
    type: "LAPTOP",
    interneeId: "",
  });

  useEffect(() => {
    load();
    api
      .get("/internees", { params: { limit: 200 } })
      .then((res) => setInternees(res.data.data.items))
      .catch(() => {});
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/assets", { params: { limit: 20 } });
      setItems(res.data.data.items);
      setTotal(res.data.data.total);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/assets", { ...form, interneeId: form.interneeId || undefined });
      setForm({ assetTag: "", name: "", type: "LAPTOP", interneeId: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReturn(id) {
    try {
      await api.patch(`/assets/${id}/return`);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this asset record?")) return;
    try {
      await api.delete(`/assets/${id}`);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  const columns = [
    { key: "assetTag", label: "Asset Tag" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "internee", label: "Assigned To", render: (row) => row.internee?.fullName || "—" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <div className="flex gap-3 text-xs">
          {row.status === "ASSIGNED" && (
            <button onClick={() => handleReturn(row.id)} className="text-brandBlue hover:underline">
              Mark Returned
            </button>
          )}
          <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:underline">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout title="Assets" breadcrumb="Manage company assets and issuance">
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">All Assets ({total})</h2>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary text-sm">
          {showForm ? "Cancel" : "+ Add New Asset"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-6 mb-6">
          <div className="grid grid-cols-4 gap-6 mb-5">
            <div>
              <label className="label-field">Asset Tag</label>
              <input
                required
                className="input-field"
                placeholder="e.g. LAP-0042"
                value={form.assetTag}
                onChange={(e) => update("assetTag", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Name</label>
              <input
                required
                className="input-field"
                placeholder="e.g. Dell Latitude 5420"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Type</label>
              <select
                className="input-field"
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
              >
                <option value="LAPTOP">Laptop</option>
                <option value="MONITOR">Monitor</option>
                <option value="ACCESSORY">Accessory</option>
                <option value="ID_CARD">ID Card</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="label-field">Assign To (optional)</label>
              <select
                className="input-field"
                value={form.interneeId}
                onChange={(e) => update("interneeId", e.target.value)}
              >
                <option value="">Unassigned</option>
                {internees.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : "Save Asset"}
            </button>
          </div>
        </form>
      )}

      <DataTable columns={columns} rows={items} loading={loading} />
    </Layout>
  );
}

export default function Assets() {
  return (
    <ProtectedRoute>
      <AssetsContent />
    </ProtectedRoute>
  );
}
