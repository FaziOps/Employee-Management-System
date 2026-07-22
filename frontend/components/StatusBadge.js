const COLOR_MAP = {
  ACTIVE: "bg-green-500/20 text-green-400",
  AVAILABLE: "bg-green-500/20 text-green-400",
  PENDING: "bg-yellow-500/20 text-yellow-400",
  ON_HOLD: "bg-yellow-500/20 text-yellow-400",
  UNDER_REPAIR: "bg-yellow-500/20 text-yellow-400",
  COMPLETED: "bg-blue-500/20 text-blue-400",
  ASSIGNED: "bg-blue-500/20 text-blue-400",
  TERMINATED: "bg-red-500/20 text-red-400",
  EXPIRED: "bg-red-500/20 text-red-400",
  RETIRED: "bg-red-500/20 text-red-400",
};

export default function StatusBadge({ status }) {
  const classes = COLOR_MAP[status] || "bg-gray-500/20 text-gray-400";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${classes}`}>
      {status?.replaceAll("_", " ")}
    </span>
  );
}
