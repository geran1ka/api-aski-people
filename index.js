import express from "express";
import { PORT } from "./var.js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import { category, getGoodsList, getQueryParams } from "./scripts/service.js";

const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();

app.use("/img", express.static("DB/img"));

const loadData = async () => {
  try {
    const data = await readFile(path.join(__dirname, "DB/goods.json"), "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read data file:", err);
    throw err;
  }
};

const sendData = async () => {
  try {
    const data = await loadData();
    return data;
  } catch (error) {
    console.error("Failed to read data file:", err);
    throw err;
  }
};

// export const loadOrders = async () => {
//   try {
//     const data = await readFile(path.join(__dirname, "DB/orders.json"), "utf8");
//     return JSON.parse(data);
//   } catch (err) {
//     console.error("Failed to read orders file:", err);
//     return [];
//   }
// };

// export const saveOrders = async (orders) => {
//   try {
//     await writeFile(
//       path.join(__dirname, "DB/orders.json"),
//       JSON.stringify(orders, null, 2),
//       "utf8"
//     );
//     return true;
//   } catch (err) {
//     console.error("Failed to write to orders file:", err);
//     return false;
//   }
// };

// export const loadCart = async () => {
//   try {
//     const data = await readFile(path.join(__dirname, "DB/cart.json"), "utf8");
//     return JSON.parse(data);
//   } catch (err) {
//     console.error("Failed to read orders file:", err);
//     return [];
//   }
// };

// export const saveCart = async (cart) => {
//   try {
//     await writeFile(
//       path.join(__dirname, "DB/cart.json"),
//       JSON.stringify(cart, null, 2),
//       "utf8"
//     );
//     return true;
//   } catch (err) {
//     console.error("Failed to write to orders file:", err);
//     return false;
//   }
// };

app.get("/", async (req, res) => {
  try {
    const data = await sendData();
    res.header("Access-Control-Allow-Origin", "*");
    const queryParams = getQueryParams(req);
    const products = getGoodsList(data, queryParams);

    return res.json(products);
  } catch (error) {
    res.send("Error data");
  }
});

app.get("/category", async (req, res) => {
  try {
    const data = await sendData();
    res.header("Access-Control-Allow-Origin", "*");

    const categories = category(data);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to load category" });
  }
});

app.get("/goods/:category", async (req, res) => {
  try {
    const data = await sendData();
    res.header("Access-Control-Allow-Origin", "*");
    const queryParams = getQueryParams(req);
    const products = getGoodsList(data, queryParams);
    return res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to load product" });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const data = await sendData();
    res.header("Access-Control-Allow-Origin", "*");

    const product = data.find((item) => item.id === parseInt(req.params.id));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load product" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const data = await sendData();
    res.header("Access-Control-Allow-Origin", "*");
    const queryParams = getQueryParams(req);
    const products = getGoodsList(data, queryParams);

    return res.json(products);
  } catch (error) {
    res.send("Error search");
  }
});

app.get("/favorite", async (req, res) => {
  try { 
    const data = await sendData();
    res.header("Access-Control-Allow-Origin", "*");
    const queryParams = getQueryParams(req);
    const products = getGoodsList(data, queryParams);

    return res.json(products);
  } catch (error) {
    res.send("Error search");
  }
});

app.post("/orders", async (req, res) => {
  const { products, storeId } = req.body;

  if (!products || !Array.isArray(products) || !storeId) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  try {
    const orders = await loadOrders();
    const order = {
      id: generateUniqueId(),
      products,
      storeId,
      date: new Date().toISOString(),
    };

    orders.push(order);

    if (await saveOrders(orders)) {
      res.status(201).json({ orderId: order.id });
    } else {
      res.status(500).json({ error: "Failed to save order" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to process order" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
