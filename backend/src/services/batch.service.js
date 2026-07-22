const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");

async function createBatch(data) {
  const { name, domain, startDate, endDate, status, description } = data;

  if (new Date(endDate) <= new Date(startDate)) {
    throw new ApiError(400, "End date must be after start date.");
  }

  return prisma.batch.create({
    data: {
      name,
      domain,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status || "PENDING",
      description,
    },
  });
}

async function getAllBatches({ search, status, page = 1, limit = 10 }) {
  const where = {
    AND: [
      search
        ? { OR: [{ name: { contains: search } }, { domain: { contains: search } }] }
        : {},
      status ? { status } : {},
    ],
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    prisma.batch.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { internees: true } } },
    }),
    prisma.batch.count({ where }),
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
}

async function getBatchById(id) {
  const batch = await prisma.batch.findUnique({
    where: { id: Number(id) },
    include: {
      internees: true,
      tenures: { include: { internee: true } },
    },
  });
  if (!batch) throw new ApiError(404, "Batch not found.");
  return batch;
}

async function updateBatch(id, data) {
  await getBatchById(id); // throws 404 if missing
  const payload = { ...data };
  if (payload.startDate) payload.startDate = new Date(payload.startDate);
  if (payload.endDate) payload.endDate = new Date(payload.endDate);

  return prisma.batch.update({ where: { id: Number(id) }, data: payload });
}

async function deleteBatch(id) {
  await getBatchById(id);
  return prisma.batch.delete({ where: { id: Number(id) } });
}

module.exports = { createBatch, getAllBatches, getBatchById, updateBatch, deleteBatch };
