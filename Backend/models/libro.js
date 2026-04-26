const mongoose = require("mongoose");

const libroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    minlength: 2
  },
  autor: {
    type: String,
    required: true,
    minlength: 2
  },
  genero: {
    type: String,
    required: true
  },
  estado: {
  type: String,
  default: "Pendiente",
  enum: ["Pendiente", "Leyendo", "Terminado"]
},
 calificacion: {
  type: Number,
  min: 0,
  max: 5,
  default: 0
},
  resena: {
    type: String,
    required: true,
    minlength: 5
  },
  portada: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Libro", libroSchema);