export const generateUniqueId = (length = 10) =>
  crypto.randomBytes(length).toString("hex").slice(0, length);

export const category = (data) => {
  const categories = [];

  data.forEach((item) => {
    if (!categories.find((category) => category.eng === item.category.eng)) {
      categories.push(item.category);
    }
  });
  return categories.sort((a, b) => (a > b ? 1 : -1));
};
