const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");

async function createInternee(data) {
  const { fullName, email, phone, cnic, address, status, batchId } = data;

  if (batchId) {
    const batch = await prisma.batch.findUnique({ where: { id: Number(batchId) } });
    if (!batch) throw new ApiError(400, "Selected batch does not exist.");
  }

  return prisma.internee.create({
    data: {
      fullName,
      email,
      phone,
      cnic,
      address,
      status: status || "ACTIVE",
      batchId: batchId ? Number(batchId) : null,
    },
  });
}

async function getAllInternees({ search, status, batchId, page = 1, limit = 10 }) {
  const where = {
    AND: [
      search
        ? {
            OR: [
              { fullName: { contains: search } },
              { email: { contains: search } },
              { cnic: { contains: search } },
            ],
          }
        : {},
      status ? { status } : {},
      batchId ? { batchId: Number(batchId) } : {},
    ],
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    prisma.internee.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: { batch: { select: { id: true, name: true } } },
    }),
    prisma.internee.count({ where }),
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
}

async function getInterneeById(id) {
  const internee = await prisma.internee.findUnique({
    where: { id: Number(id) },
    include: { batch: true, tenures: { include: { batch: true } }, assets: true },
  });
  if (!internee) throw new ApiError(404, "Internee not found.");
  return internee;
}

async function updateInternee(id, data) {
  await getInterneeById(id);
  const payload = { ...data };
  if (payload.batchId !== undefined) payload.batchId = payload.batchId ? Number(payload.batchId) : null;

  return prisma.internee.update({ where: { id: Number(id) }, data: payload });
}

async function deleteInternee(id) {
  await getInterneeById(id);
  return prisma.internee.delete({ where: { id: Number(id) } });
}

module.exports = {
  createInternee,
  getAllInternees,
  getInterneeById,
  updateInternee,
  deleteInternee,
};
