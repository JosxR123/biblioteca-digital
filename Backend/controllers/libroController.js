const Libro = require("../models/libro");

exports.crearLibro = async (req, res) => {
  try {
    const { titulo, autor, genero, estado, calificacion, resena, portada } = req.body;

    if (!titulo || !autor || !genero || !estado || !calificacion || !resena) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const nuevoLibro = new Libro({
      titulo,
      autor,
      genero,
      estado,
      calificacion,
      resena,
      portada
    });

    const libroGuardado = await nuevoLibro.save();
    res.status(201).json(libroGuardado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

exports.obtenerLibros = async (req, res) => {
  try {
    const libros = await Libro.find().sort({ createdAt: -1 });
    res.json(libros);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

exports.obtenerLibroPorId = async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);

    if (!libro) {
      return res.status(404).json({ mensaje: "Libro no encontrado" });
    }

    res.json(libro);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

exports.actualizarLibro = async (req, res) => {
  try {
    const libroActualizado = await Libro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!libroActualizado) {
      return res.status(404).json({ mensaje: "Libro no encontrado" });
    }

    res.json(libroActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

exports.eliminarLibro = async (req, res) => {
  try {
    const libroEliminado = await Libro.findByIdAndDelete(req.params.id);

    if (!libroEliminado) {
      return res.status(404).json({ mensaje: "Libro no encontrado" });
    }

    res.json({ mensaje: "Libro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};