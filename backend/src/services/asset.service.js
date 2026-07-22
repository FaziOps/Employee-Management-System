const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");

async function createAsset(data) {
  const { assetTag, name, type, status, interneeId, issuedDate } = data;

  if (interneeId) {
    const internee = await prisma.internee.findUnique({ where: { id: Number(interneeId) } });
    if (!internee) throw new ApiError(400, "Selected internee does not exist.");
  }

  return prisma.asset.create({
    data: {
      assetTag,
      name,
      type,
      status: status || (interneeId ? "ASSIGNED" : "AVAILABLE"),
      interneeId: interneeId ? Number(interneeId) : null,
      issuedDate: interneeId ? new Date(issuedDate || Date.now()) : null,
    },
  });
}

async function getAllAssets({ search, status, type, page = 1, limit = 10 }) {
  const where = {
    AND: [
      search
        ? { OR: [{ name: { contains: search } }, { assetTag: { contains: search } }] }
        : {},
      status ? { status } : {},
      type ? { type } : {},
    ],
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: { internee: { select: { id: true, fullName: true } } },
    }),
    prisma.asset.count({ where }),
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
}

async function getAssetById(id) {
  const asset = await prisma.asset.findUnique({
    where: { id: Number(id) },
    include: { internee: true },
  });
  if (!asset) throw new ApiError(404, "Asset not found.");
  return asset;
}

async function updateAsset(id, data) {
  await getAssetById(id);
  const payload = { ...data };
  if (payload.interneeId !== undefined) {
    payload.interneeId = payload.interneeId ? Number(payload.interneeId) : null;
  }
  if (payload.issuedDate) payload.issuedDate = new Date(payload.issuedDate);
  if (payload.returnedDate) payload.returnedDate = new Date(payload.returnedDate);

  return prisma.asset.update({ where: { id: Number(id) }, data: payload });
}

// Return an asset: unassign from internee, mark AVAILABLE, stamp returnedDate.
async function returnAsset(id) {
  await getAssetById(id);
  return prisma.asset.update({
    where: { id: Number(id) },
    data: { interneeId: null, status: "AVAILABLE", returnedDate: new Date() },
  });
}

async function deleteAsset(id) {
  await getAssetById(id);
  return prisma.asset.delete({ where: { id: Number(id) } });
}

module.exports = {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  returnAsset,
  deleteAsset,
};
