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

export const shuffle = (array) => {
  const shuffleArray = [...array];
  for (let i = shuffleArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]];
  }

  return shuffleArray;
};

export const pagination = (data, page, count) => {
  const end = count * page;
  const start = page === 1 ? 0 : end - count;
  const totalCount = data.length;

  const pages = Math.ceil(data.length / count);

  return {
    goods: data.slice(start, end),
    page,
    pages,
    size: count,
    totalCount,
  };
};

export const getGoodsList = (data, queryParams = {}) => {
  const page = +queryParams.page || 1;
  const paginationCount = 12;

  if (queryParams.category) {
    data = data.filter((item) => {
      return (
        item.category.eng.trim().toLowerCase() ===
          queryParams.category.trim().toLowerCase() ||
        item.category.rus.trim().toLowerCase() ===
          queryParams.category.trim().toLowerCase()
      );
    });
  }

  if (queryParams.search) {
    const searchWords = queryParams.search.trim().toLowerCase().split("+");

    data = data.filter((item) => {
      const title = item.title.toLowerCase();
      const category = item.category.rus.toLowerCase();
      const characteristics = item.characteristics.map((c) =>
        c.value.toLowerCase()
      );

      return searchWords.some((word) => {
        return (
          title.includes(word) ||
          category.includes(word) ||
          characteristics.some((value) => value.includes(word))
        );
      });
    });
  }

  return pagination(data, page, paginationCount);
};

export const getQueryParams = (req) => {
  let queryParams = {};
  const params = req.params;
  const [, query] = req.url.substring().split("?");

  if (params) {
    queryParams = { ...queryParams, ...params };
  }

  if (query) {
    for (const piece of query.split("&")) {
      const [key, value] = piece.split("=");
      queryParams[key] = value ? decodeURIComponent(value) : "";
    }
  }

  return queryParams;
};
