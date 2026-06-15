function buildPermitPayload(payload, FolderRSN, ReferenceFile) {
  if (!FolderRSN || !ReferenceFile) {
    throw new Error("FolderRSN AND OR ReferenceFile missing");
  }
  payload["FolderRSN"] = FolderRSN;
  payload["ReferenceFile"] = ReferenceFile;

  return payload;
}

module.exports = { buildPermitPayload };
