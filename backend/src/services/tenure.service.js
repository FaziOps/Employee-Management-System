const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");

async function createTenure(data) {
  const { internConId, batchId, startDate, endDate, status, remarks } = data;

  if (new Date(endDate) <= new Date(startDate)) {
    throw new ApiError(400, "End date must be after start date.");
  }

  const [internee, batch] = await Promise.all([
    prisma.internee.findUnique({ where: { id: Number(internConId) } }),
    prisma.batch.findUnique({ where: { id: Number(batchId) } }),
  ]);

  if (!internee) throw new ApiError(400, "Selected internee does not exist.");
  if (!batch) throw new ApiError(400, "Selected batch does not exist.");

  return prisma.tenure.create({
    data: {
      internConId: Number(internConId),
      batchId: Number(batchId),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status || "ACTIVE",
      remarks,
    },
    include: { internee: true, batch: true },
  });
}

async function getAllTenures({ internConId, batchId, page = 1, limit = 10 }) {
  const where = {
    AND: [
      internConId ? { internConId: Number(internConId) } : {},
      batchId ? { batchId: Number(batchId) } : {},
    ],
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    prisma.tenure.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: { internee: true, batch: true },
    }),
    prisma.tenure.count({ where }),
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
}

async function getTenureById(id) {
  const tenure = await prisma.tenure.findUnique({
    where: { id: Number(id) },
    include: { internee: true, batch: true },
  });
  if (!tenure) throw new ApiError(404, "Tenure not found.");
  return tenure;
}

async function updateTenure(id, data) {
  await getTenureById(id);
  const payload = { ...data };
  if (payload.startDate) payload.startDate = new Date(payload.startDate);
  if (payload.endDate) payload.endDate = new Date(payload.endDate);

  return prisma.tenure.update({ where: { id: Number(id) }, data: payload });
}

async function deleteTenure(id) {
  await getTenureById(id);
  return prisma.tenure.delete({ where: { id: Number(id) } });
}

module.exports = { createTenure, getAllTenures, getTenureById, updateTenure, deleteTenure };
