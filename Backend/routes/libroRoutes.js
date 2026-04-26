const express = require("express");
const router = express.Router();

const {
  crearLibro,
  obtenerLibros,
  obtenerLibroPorId,
  actualizarLibro,
  eliminarLibro
} = require("../controllers/libroController");

router.post("/", crearLibro);
router.get("/", obtenerLibros);
router.get("/:id", obtenerLibroPorId);
router.put("/:id", actualizarLibro);
router.delete("/:id", eliminarLibro);

module.exports = router;