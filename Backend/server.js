console.log("Archivo server.js iniciado");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const conectarDB = require("./config/db");

dotenv.config();

const app = express();

conectarDB();

app.use(cors());
app.use(express.json());

const libroRoutes = require("./routes/libroRoutes");

app.use("/api/libros", libroRoutes);

app.use(express.static(path.join(__dirname, "../Frontend/public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/public/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});