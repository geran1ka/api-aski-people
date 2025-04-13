export const generateUniqueId = (length = 10) =>
  crypto.randomBytes(length).toString("hex").slice(0, length);
