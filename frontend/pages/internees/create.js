import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import api, { getErrorMessage } from "../../lib/api";

export default function CreateInternee() {
  const router = useRouter();
  const [tab, setTab] = useState("personal"); // 'personal' | 'tenure'
  const [createdInternee, setCreatedInternee] = useState(null);
  const [batches, setBatches] = useState([]);
  const [tenuresList, setTenuresList] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Modal State for adding batch inline
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [modalBatchForm, setModalBatchForm] = useState({
    name: "",
    domain: "Web Development",
    startDate: "",
    endDate: "",
    status: "PENDING",
    description: "",
  });

  // Personal Info Form State
  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    city: "Faisalabad",
    email: "",
    phone: "",
    referredBy: "",
    fatherName: "",
    guardianPhone: "",
    role: "Internee",
  });

  // Tenure Info Form State
  const [tenure, setTenure] = useState({
    batchId: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    institute: "FAST Faisalabad",
    degree: "BS CS",
    degreeStartDate: "",
    degreeEndDate: "",
    degreeSemester: "4",
    degreeGrade: "A",
    skills: "",
    miscCourses: "",
    skillsLearned: "",
    certStartDate: "",
    certEndDate: "",
    certIssueDate: "",
    score: "",
    comments: "",
  });

  // Load batches on start
  useEffect(() => {
    loadBatches();
  }, []);

  // Load tenures once internee is created
  useEffect(() => {
    if (createdInternee) {
      loadTenures();
    }
  }, [createdInternee]);

  async function loadBatches() {
    try {
      const res = await api.get("/batches", { params: { limit: 100 } });
      setBatches(res.data.data.items || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadTenures() {
    if (!createdInternee) return;
    try {
      const res = await api.get("/tenures");
      const list = res.data.data.filter((t) => t.internConId === createdInternee.id) || [];
      setTenuresList(list);
    } catch (err) {
      console.error(err);
    }
  }

  function updatePersonal(field, value) {
    setPersonal((f) => ({ ...f, [field]: value }));
  }
  function updateTenure(field, value) {
    setTenure((f) => ({ ...f, [field]: value }));
  }

  // Submit Personal Info
  async function handleSavePersonal(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const fullName = `${personal.firstName} ${personal.lastName}`.trim();
      const mockCnic = `35201-${Math.floor(1000000 + Math.random() * 9000000)}-1`;
      
      const payload = {
        fullName,
        email: personal.email,
        phone: personal.phone,
        cnic: mockCnic,
        address: personal.city,
        status: "ACTIVE",
      };

      const res = await api.post("/internees", payload);
      setCreatedInternee(res.data.data);
      setTab("tenure");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  // Submit Tenure Info
  async function handleSaveTenure(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const extraData = {
        gender: personal.gender,
        city: personal.city,
        referredBy: personal.referredBy,
        fatherName: personal.fatherName,
        guardianPhone: personal.guardianPhone,
        role: personal.role,
        institute: tenure.institute,
        degree: tenure.degree,
        degreeStartDate: tenure.degreeStartDate,
        degreeEndDate: tenure.degreeEndDate,
        degreeSemester: tenure.degreeSemester,
        degreeGrade: tenure.degreeGrade,
        skills: tenure.skills,
        miscCourses: tenure.miscCourses,
        skillsLearned: tenure.skillsLearned,
        certStartDate: tenure.certStartDate,
        certEndDate: tenure.certEndDate,
        certIssueDate: tenure.certIssueDate,
        score: tenure.score,
      };

      const remarks = JSON.stringify({
        comments: tenure.comments,
        extra: extraData,
      });

      await api.post("/tenures", {
        internConId: createdInternee.id,
        batchId: parseInt(tenure.batchId),
        startDate: tenure.startDate,
        endDate: tenure.endDate,
        status: tenure.status,
        remarks: remarks,
      });

      // Clear tenure inputs
      setTenure((prev) => ({
        ...prev,
        batchId: "",
        startDate: "",
        endDate: "",
        comments: "",
      }));

      // Reload lists and send user to Internees List after finalizing
      loadTenures();
      router.push("/internees");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  // Modal batch creation
  async function handleCreateBatchModal(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/batches", modalBatchForm);
      await loadBatches();
      updateTenure("batchId", res.data.data.id);
      setShowBatchModal(false);
      // Reset form
      setModalBatchForm({
        name: "",
        domain: "Web Development",
        startDate: "",
        endDate: "",
        status: "PENDING",
        description: "",
      });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <ProtectedRoute>
      <Layout title="Create Internee" breadcrumb="Internees List > Create New Internee">
        <div className="bg-[#12181b]/80 border border-gray-800/80 rounded-xl p-8 backdrop-blur-sm relative">
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-2.5 mb-6">
              {error}
            </div>
          )}

          {/* Steps Tab Header */}
          <div className="flex justify-center border-b border-gray-800/80 mb-8">
            <div className="flex gap-12">
              <button
                onClick={() => setTab("personal")}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors duration-200 ${
                  tab === "personal"
                    ? "text-[#29b6f6] border-b-2 border-[#29b6f6]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                👤 Personal Info
              </button>
              <button
                onClick={() => createdInternee && setTab("tenure")}
                disabled={!createdInternee}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors duration-200 ${
                  tab === "tenure"
                    ? "text-[#29b6f6] border-b-2 border-[#29b6f6]"
                    : "text-gray-450"
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                💼 Tenure Info
              </button>
            </div>
          </div>

          {/* STEP 1: Personal Info */}
          {tab === "personal" && (
            <form onSubmit={handleSavePersonal}>
              {/* Profile pic & CV Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="label-field font-semibold text-gray-400">Profile Pic</label>
                  <div className="w-16 h-16 rounded-xl bg-[#0f1518] border border-gray-800 hover:border-gray-700 flex items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-white">
                    📷
                  </div>
                </div>
                <div>
                  <label className="label-field font-semibold text-gray-400">Upload CV</label>
                  <div className="border border-dashed border-[#29b6f6]/40 hover:border-[#29b6f6] bg-[#0f1518]/50 rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-[#29b6f6]/10 text-[#29b6f6] flex items-center justify-center text-lg">
                      📤
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 font-semibold">
                        Drag & Drop or <span className="text-[#29b6f6] underline">choose file</span> to upload
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Supported formats: Jpeg, pdf</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 1: Name, Gender, City */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                <div>
                  <label className="label-field font-semibold">First Name</label>
                  <input
                    required
                    className="input-field"
                    placeholder="Enter Here"
                    value={personal.firstName}
                    onChange={(e) => updatePersonal("firstName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Last Name</label>
                  <input
                    required
                    className="input-field"
                    placeholder="Enter Here"
                    value={personal.lastName}
                    onChange={(e) => updatePersonal("lastName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Gender</label>
                  <select
                    className="input-field cursor-pointer"
                    value={personal.gender}
                    onChange={(e) => updatePersonal("gender", e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label-field font-semibold">City</label>
                  <select
                    className="input-field cursor-pointer"
                    value={personal.city}
                    onChange={(e) => updatePersonal("city", e.target.value)}
                  >
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                </div>
              </div>

              {/* Grid 2: Email, Phone, Referred By */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="label-field font-semibold">Email</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    placeholder="Enter Here"
                    value={personal.email}
                    onChange={(e) => updatePersonal("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Phone</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">+92</span>
                    <input
                      required
                      className="input-field pl-12"
                      placeholder="Enter Here"
                      value={personal.phone}
                      onChange={(e) => updatePersonal("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="label-field font-semibold">Referred By</label>
                  <input
                    className="input-field"
                    placeholder="Enter Here"
                    value={personal.referredBy}
                    onChange={(e) => updatePersonal("referredBy", e.target.value)}
                  />
                </div>
              </div>

              {/* Grid 3: Father, Guardian Phone, Role */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div>
                  <label className="label-field font-semibold">Father Name</label>
                  <input
                    required
                    className="input-field"
                    placeholder="Enter Here"
                    value={personal.fatherName}
                    onChange={(e) => updatePersonal("fatherName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Guardian Phone</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">+92</span>
                    <input
                      className="input-field pl-12"
                      placeholder="Enter Here"
                      value={personal.guardianPhone}
                      onChange={(e) => updatePersonal("guardianPhone", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="label-field font-semibold">Role</label>
                  <input
                    className="input-field"
                    placeholder="Enter Here"
                    value={personal.role}
                    onChange={(e) => updatePersonal("role", e.target.value)}
                  />
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex justify-end gap-4 border-t border-gray-800/80 pt-6">
                <button
                  type="button"
                  onClick={() => router.push("/internees")}
                  className="btn-secondary min-w-[100px] text-xs font-semibold py-2 bg-transparent text-gray-300 border-gray-700/80 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#a6ce39] hover:bg-[#bce64c] text-black font-extrabold text-xs px-5 py-2.5 rounded-lg min-w-[120px] transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save & Next"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Tenure Info */}
          {tab === "tenure" && createdInternee && (
            <form onSubmit={handleSaveTenure}>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-gray-400 font-medium">
                  Adding tenure details for: <span className="text-white font-bold">{createdInternee.fullName}</span>
                </p>
              </div>

              {/* Select Batch, Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="label-field font-semibold">Select Batch</label>
                  <div className="flex gap-2">
                    <select
                      required
                      className="input-field cursor-pointer"
                      value={tenure.batchId}
                      onChange={(e) => updateTenure("batchId", e.target.value)}
                    >
                      <option value="">Select</option>
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowBatchModal(true)}
                      className="w-10 h-10 shrink-0 bg-[#a6ce39]/10 text-[#a6ce39] hover:bg-[#a6ce39]/20 border border-[#a6ce39]/30 rounded-lg flex items-center justify-center font-bold text-lg transition-colors"
                      title="Add new batch"
                    >
                      ＋
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <label className="label-field font-semibold">Start Date</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={tenure.startDate}
                    onChange={(e) => updateTenure("startDate", e.target.value)}
                  />
                </div>
                <div className="relative">
                  <label className="label-field font-semibold">End Date</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={tenure.endDate}
                    onChange={(e) => updateTenure("endDate", e.target.value)}
                  />
                </div>
              </div>

              {/* Institute & Degree */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="label-field font-semibold">Select Institute</label>
                  <select
                    className="input-field cursor-pointer"
                    value={tenure.institute}
                    onChange={(e) => updateTenure("institute", e.target.value)}
                  >
                    <option value="FAST Faisalabad">FAST Faisalabad</option>
                    <option value="UET Lahore">UET Lahore</option>
                    <option value="GC Faisalabad">GC Faisalabad</option>
                    <option value="NUST Islamabad">NUST Islamabad</option>
                  </select>
                </div>
                <div>
                  <label className="label-field font-semibold">Select Degree</label>
                  <select
                    className="input-field cursor-pointer"
                    value={tenure.degree}
                    onChange={(e) => updateTenure("degree", e.target.value)}
                  >
                    <option value="BS CS">BS CS</option>
                    <option value="BS SE">BS SE</option>
                    <option value="BS IT">BS IT</option>
                    <option value="MS CS">MS CS</option>
                  </select>
                </div>
              </div>

              {/* Degree parameters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                <div>
                  <label className="label-field font-semibold">Degree Start Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={tenure.degreeStartDate}
                    onChange={(e) => updateTenure("degreeStartDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Degree End Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={tenure.degreeEndDate}
                    onChange={(e) => updateTenure("degreeEndDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Degree Semester</label>
                  <input
                    className="input-field"
                    placeholder="Enter"
                    value={tenure.degreeSemester}
                    onChange={(e) => updateTenure("degreeSemester", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Degree Grade</label>
                  <input
                    className="input-field"
                    placeholder="Enter"
                    value={tenure.degreeGrade}
                    onChange={(e) => updateTenure("degreeGrade", e.target.value)}
                  />
                </div>
              </div>

              {/* Textareas row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="label-field font-semibold">Skills</label>
                  <textarea
                    className="input-field min-h-[80px]"
                    placeholder="Enter"
                    value={tenure.skills}
                    onChange={(e) => updateTenure("skills", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Misc Courses</label>
                  <textarea
                    className="input-field min-h-[80px]"
                    placeholder="Enter"
                    value={tenure.miscCourses}
                    onChange={(e) => updateTenure("miscCourses", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Skills Learned</label>
                  <textarea
                    className="input-field min-h-[80px]"
                    placeholder="Enter"
                    value={tenure.skillsLearned}
                    onChange={(e) => updateTenure("skillsLearned", e.target.value)}
                  />
                </div>
              </div>

              {/* Cert parameters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                <div>
                  <label className="label-field font-semibold">Cert Start Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={tenure.certStartDate}
                    onChange={(e) => updateTenure("certStartDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Cert End Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={tenure.certEndDate}
                    onChange={(e) => updateTenure("certEndDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Cert Issue Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={tenure.certIssueDate}
                    onChange={(e) => updateTenure("certIssueDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field font-semibold">Score</label>
                  <input
                    className="input-field"
                    placeholder="Enter"
                    value={tenure.score}
                    onChange={(e) => updateTenure("score", e.target.value)}
                  />
                </div>
              </div>

              {/* Upload zone & Comments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="label-field font-semibold text-gray-400">Upload Cert</label>
                  <div className="border border-dashed border-[#29b6f6]/40 hover:border-[#29b6f6] bg-[#0f1518]/50 rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-[#29b6f6]/10 text-[#29b6f6] flex items-center justify-center text-lg">
                      📤
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 font-semibold">
                        Drag & Drop or <span className="text-[#29b6f6] underline">choose file</span> to upload
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Supported formats: Jpeg, pdf</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label-field font-semibold">Comments</label>
                  <textarea
                    className="input-field min-h-[70px]"
                    placeholder="Enter"
                    value={tenure.comments}
                    onChange={(e) => updateTenure("comments", e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 border-t border-gray-800/80 pt-6 mb-8">
                <button
                  type="button"
                  onClick={() => router.push("/internees")}
                  className="btn-secondary min-w-[100px] text-xs font-semibold py-2 bg-transparent text-gray-300 border-gray-700/80 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#a6ce39] hover:bg-[#bce64c] text-black font-extrabold text-xs px-5 py-2.5 rounded-lg min-w-[120px] transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>

              {/* Display list of tenures table inside page */}
              {tenuresList.length > 0 && (
                <div className="border-t border-gray-800/80 pt-8 mt-4">
                  <h3 className="text-white text-base font-bold mb-4">Saved Tenures</h3>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800 text-[10px] text-gray-450 font-bold uppercase tracking-wider">
                          <th className="pb-3 pr-4">Tenure ID</th>
                          <th className="pb-3 px-4">Batch Name</th>
                          <th className="pb-3 px-4">Start Date</th>
                          <th className="pb-3 px-4">End Date</th>
                          <th className="pb-3 px-4">Institute</th>
                          <th className="pb-3 px-4">Degree</th>
                          <th className="pb-3 px-4 text-center">Semester</th>
                          <th className="pb-3 px-4 text-center">Grade</th>
                          <th className="pb-3 pl-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs text-gray-300 divide-y divide-gray-800/60">
                        {tenuresList.map((t) => {
                          const displayId = t.id + 345321230;
                          const batchName = batches.find((b) => b.id === t.batchId)?.name || `Batch ${t.batchId}`;
                          
                          let parsedData = {};
                          try {
                            const parsed = JSON.parse(t.remarks);
                            parsedData = parsed.extra || {};
                          } catch (e) {}

                          return (
                            <tr key={t.id} className="hover:bg-[#1a2226]/30 transition-colors">
                              <td className="py-4 pr-4 font-semibold text-gray-400">{displayId}</td>
                              <td className="py-4 px-4 font-bold text-white">{batchName}</td>
                              <td className="py-4 px-4">{formatDate(t.startDate)}</td>
                              <td className="py-4 px-4">{formatDate(t.endDate)}</td>
                              <td className="py-4 px-4">{parsedData.institute || "FAST Faisalabad"}</td>
                              <td className="py-4 px-4">{parsedData.degree || "BS CS"}</td>
                              <td className="py-4 px-4 text-center font-bold">{parsedData.degreeSemester || "4"}</td>
                              <td className="py-4 px-4 text-center font-bold text-white">{parsedData.degreeGrade || "A"}</td>
                              <td className="py-4 pl-4 text-right">
                                <div className="flex items-center justify-end gap-2 text-gray-400">
                                  <button type="button" className="hover:text-white transition-colors" title="View">👁</button>
                                  <button type="button" className="hover:text-white transition-colors" title="Edit">✏</button>
                                  <button type="button" className="hover:text-red-400 transition-colors" title="Delete">🗑</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Modal Overlay for Add Batch */}
        {showBatchModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#12181b] border border-gray-800 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white text-lg font-bold">Create Internee - Tenure / Add Batch</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Add a new batch directly here</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBatchModal}>
                {/* Batch Name & Status */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                  <div className="md:col-span-3">
                    <label className="label-field font-semibold">Batch Name</label>
                    <input
                      required
                      className="input-field"
                      placeholder="Enter Here"
                      value={modalBatchForm.name}
                      onChange={(e) => setModalBatchForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label-field font-semibold">Select Status</label>
                    <select
                      className="input-field cursor-pointer"
                      value={modalBatchForm.status}
                      onChange={(e) => setModalBatchForm((prev) => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Dates & Times */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                  <div>
                    <label className="label-field font-semibold">Start Date</label>
                    <input
                      type="date"
                      required
                      className="input-field"
                      value={modalBatchForm.startDate}
                      onChange={(e) => setModalBatchForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label-field font-semibold">End Date</label>
                    <input
                      type="date"
                      required
                      className="input-field"
                      value={modalBatchForm.endDate}
                      onChange={(e) => setModalBatchForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label-field font-semibold">Start Time</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 09:00 AM"
                    />
                  </div>
                  <div>
                    <label className="label-field font-semibold">End Time</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 02:00 PM"
                    />
                  </div>
                </div>

                {/* Days of week & Score */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="label-field font-semibold">Days Of Week</label>
                    <input
                      className="input-field"
                      placeholder="Enter Here"
                    />
                  </div>
                  <div>
                    <label className="label-field font-semibold">Score</label>
                    <input
                      className="input-field"
                      placeholder="Enter Here"
                    />
                  </div>
                </div>

                {/* Roadmap & Comments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="label-field font-semibold">Roadmap</label>
                    <textarea
                      className="input-field min-h-[100px]"
                      placeholder="Enter Here"
                      value={modalBatchForm.description}
                      onChange={(e) => setModalBatchForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label-field font-semibold">Comments</label>
                    <textarea
                      className="input-field min-h-[100px]"
                      placeholder="Enter Here"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800/80">
                  <button
                    type="button"
                    onClick={() => setShowBatchModal(false)}
                    className="btn-secondary text-xs font-semibold py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#a6ce39] hover:bg-[#bce64c] text-black font-extrabold text-xs px-5 py-2.5 rounded-lg min-w-[100px] transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
