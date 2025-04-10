import express from "express";
import { PORT } from "./var.js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use("/img", express.static("DB/img"));

const loadData = async () => {
  const data = await readFile(path.join(__dirname, "DB/goods.json"), "utf8");
  return JSON.parse(data);
};

const sendData = async () => {
  const data = await loadData();
  return data;
};

app.get("/goods", async (req, res) => {
  try {
    const updatedGoods = await sendData();
    res.header("Access-Control-Allow-Origin", "*");
    res.json(updatedGoods);
  } catch (error) {
    res.send("Error data");
  }
});

app.get("/skis", async (req, res) => {
  try {
    const updatedGoods = await sendData();
    const skis = updatedGoods.filter((item) => item.category === "Лыжи");
    res.header("Access-Control-Allow-Origin", "*");
    res.json(skis);
  } catch (error) {
    res.send("Error skies");
  }
});

app.get("/accessories", async (req, res) => {
  try {
    const updatedGoods = await sendData();
    const accessories = updatedGoods.filter((item) => item.category === "Аксессуары");
    res.header("Access-Control-Allow-Origin", "*");
    res.json(accessories);
  } catch (error) {
    res.send("Error accessories");
  }
});

app.get("/snowboard", async (req, res) => {
  try {
    const updatedGoods = await sendData();
    const snowboard = updatedGoods.filter((item) => item.category === "Сноуборды");
    res.header("Access-Control-Allow-Origin", "*");
    res.json(snowboard);
  } catch (error) {
    res.send("Error snowboard");
  }
});

app.get("/equipment", async (req, res) => {
  try {
    const updatedGoods = await sendData();
    const equipment = updatedGoods.filter((item) => item.category === "Экипировка");
    res.header("Access-Control-Allow-Origin", "*");
    res.json(equipment);
  } catch (error) {
    res.send("Error equipment");
  }
});


app.get("/category", async (req, res) => {
  try {
    const updatedGoods = await sendData();
    const category = [...new Set(updatedGoods.map((item) => item.category))];
    res.header("Access-control-allow-Origin", "*");
    res.json(category);
  } catch (error) {
    res.send("Error");
  }
});

app.get("/product:id", async (req, res) => {
  try {
    const updatedGoods = await sendData();
    const category = [...new Set(updatedGoods.map((item) => item.category))];
    res.header("Access-control-allow-Origin", "*");
    res.json(category);
  } catch (error) {
    res.send("Error");
  }
});

app.listen(PORT, () => {
  console.log("Server start on 3000 port");
});
