import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import api, { getErrorMessage } from "../../lib/api";

function CreateBatchContent() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    status: "PENDING",
    startDate: "",
    endDate: "",
    startTime: "09:00 AM",
    endTime: "02:00 PM",
    daysOfWeek: "4",
    score: "90",
    roadmap: "",
    comments: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // Pack extra details into description as JSON
      const extraData = {
        startTime: form.startTime,
        endTime: form.endTime,
        daysOfWeek: form.daysOfWeek,
        score: form.score,
        roadmap: form.roadmap,
      };

      const payload = {
        name: form.name,
        domain: "Web Development", // Default required domain in DB
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
        description: JSON.stringify({
          comments: form.comments,
          extra: extraData,
        }),
      };

      await api.post("/batches", payload);
      router.push("/batches");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout title="Create Batch" breadcrumb="Batch List > Create New Batch">
      <div className="bg-[#12181b]/80 border border-gray-800/80 rounded-xl p-8 backdrop-blur-sm">
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-2.5 mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Row 1: Batch Name & Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div className="md:col-span-3">
              <label className="label-field font-semibold">Batch Name</label>
              <input
                required
                className="input-field"
                placeholder="Enter Here"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field font-semibold">Select Status</label>
              <select
                className="input-field cursor-pointer"
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Row 2: Start Date, End Date, Start Time, End Time */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div>
              <label className="label-field font-semibold">Start Date</label>
              <input
                type="date"
                required
                className="input-field"
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field font-semibold">End Date</label>
              <input
                type="date"
                required
                className="input-field"
                value={form.endDate}
                onChange={(e) => update("endDate", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field font-semibold">Start Time</label>
              <input
                className="input-field"
                placeholder="Enter Here"
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field font-semibold">End Time</label>
              <input
                className="input-field"
                placeholder="Enter Here"
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
              />
            </div>
          </div>

          {/* Row 3: Days of Week, Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="label-field font-semibold">Days Of Week</label>
              <input
                className="input-field"
                placeholder="Enter Here"
                value={form.daysOfWeek}
                onChange={(e) => update("daysOfWeek", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field font-semibold">Score</label>
              <input
                className="input-field"
                placeholder="Enter Here"
                value={form.score}
                onChange={(e) => update("score", e.target.value)}
              />
            </div>
          </div>

          {/* Row 4: Roadmap & Comments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="label-field font-semibold">Roadmap</label>
              <textarea
                className="input-field min-h-[120px]"
                placeholder="Enter Here"
                value={form.roadmap}
                onChange={(e) => update("roadmap", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field font-semibold">Comments</label>
              <textarea
                className="input-field min-h-[120px]"
                placeholder="Enter Here"
                value={form.comments}
                onChange={(e) => update("comments", e.target.value)}
              />
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex justify-end gap-4 border-t border-gray-800/80 pt-6">
            <button
              type="button"
              onClick={() => router.push("/batches")}
              className="btn-secondary min-w-[100px] text-xs font-semibold py-2 bg-transparent text-gray-300 border-gray-700/80 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#a6ce39] hover:bg-[#bce64c] text-black font-extrabold text-xs px-5 py-2.5 rounded-lg min-w-[100px] transition-all disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default function CreateBatch() {
  return (
    <ProtectedRoute>
      <CreateBatchContent />
    </ProtectedRoute>
  );
}
