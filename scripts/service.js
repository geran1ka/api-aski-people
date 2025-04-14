export const generateUniqueId = (length = 10) =>
  crypto.randomBytes(length).toString("hex").slice(0, length);

export const category = (data) => {
  return [...new Set(data.map((item) => item.category.rus))].sort((a, b) =>
    a > b ? 1 : -1
  );
};
