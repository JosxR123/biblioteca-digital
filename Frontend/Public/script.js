const API_URL = "/api/libros";

const formLibro = document.getElementById("formLibro");
const libroId = document.getElementById("libroId");
const titulo = document.getElementById("titulo");
const autor = document.getElementById("autor");
const genero = document.getElementById("genero");
const estado = document.getElementById("estado");
const calificacion = document.getElementById("calificacion");
const grupoCalificacion = document.getElementById("grupoCalificacion");
const portada = document.getElementById("portada");
const resena = document.getElementById("resena");
const listaLibros = document.getElementById("listaLibros");
const mensaje = document.getElementById("mensaje");
const tituloFormulario = document.getElementById("tituloFormulario");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const buscar = document.getElementById("buscar");
const filtroEstado = document.getElementById("filtroEstado");

const totalLibros = document.getElementById("totalLibros");
const librosTerminados = document.getElementById("librosTerminados");
const librosPendientes = document.getElementById("librosPendientes");
const promedioCalificacion = document.getElementById("promedioCalificacion");

let libros = [];

document.addEventListener("DOMContentLoaded", () => {
  controlarCalificacion();
  obtenerLibros();
});

formLibro.addEventListener("submit", guardarLibro);
btnCancelar.addEventListener("click", cancelarEdicion);
buscar.addEventListener("input", mostrarLibros);
filtroEstado.addEventListener("change", mostrarLibros);
estado.addEventListener("change", controlarCalificacion);

function controlarCalificacion() {
  if (estado.value === "Terminado") {
    grupoCalificacion.classList.remove("oculto");
    calificacion.required = true;
  } else {
    grupoCalificacion.classList.add("oculto");
    calificacion.required = false;
    calificacion.value = "";
  }
}

async function obtenerLibros() {
  try {
    const respuesta = await fetch(API_URL);
    libros = await respuesta.json();
    mostrarLibros();
    actualizarIndicadores();
  } catch (error) {
    mostrarMensaje("No se pudieron cargar los libros", true);
  }
}

async function guardarLibro(e) {
  e.preventDefault();

  const datosLibro = {
    titulo: titulo.value.trim(),
    autor: autor.value.trim(),
    genero: genero.value,
    estado: estado.value,
    calificacion: estado.value === "Terminado" ? Number(calificacion.value) : 0,
    portada: portada.value.trim(),
    resena: resena.value.trim()
  };

  if (!datosLibro.titulo || !datosLibro.autor || !datosLibro.genero || !datosLibro.estado || !datosLibro.resena) {
    mostrarMensaje("Completa todos los campos obligatorios", true);
    return;
  }

  if (datosLibro.titulo.length < 2 || datosLibro.autor.length < 2 || datosLibro.resena.length < 5) {
    mostrarMensaje("Verifica la longitud mínima de los campos", true);
    return;
  }

  if (datosLibro.estado === "Terminado" && (!datosLibro.calificacion || datosLibro.calificacion < 1 || datosLibro.calificacion > 5)) {
    mostrarMensaje("Si el libro está terminado, debes agregar una calificación entre 1 y 5", true);
    return;
  }

  if (libroId.value) {
    await actualizarLibro(libroId.value, datosLibro);
  } else {
    await crearLibro(datosLibro);
  }
}

async function crearLibro(datosLibro) {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosLibro)
    });

    if (!respuesta.ok) {
      mostrarMensaje("No se pudo guardar el libro", true);
      return;
    }

    mostrarMensaje("Libro guardado correctamente", false);
    formLibro.reset();
    controlarCalificacion();
    await obtenerLibros();
  } catch (error) {
    mostrarMensaje("Error al guardar el libro", true);
  }
}

async function actualizarLibro(id, datosLibro) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosLibro)
    });

    if (!respuesta.ok) {
      mostrarMensaje("No se pudo actualizar el libro", true);
      return;
    }

    mostrarMensaje("Libro actualizado correctamente", false);
    cancelarEdicion();
    await obtenerLibros();
  } catch (error) {
    mostrarMensaje("Error al actualizar el libro", true);
  }
}

async function eliminarLibro(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar este libro?");

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      mostrarMensaje("No se pudo eliminar el libro", true);
      return;
    }

    mostrarMensaje("Libro eliminado correctamente", false);
    await obtenerLibros();
  } catch (error) {
    mostrarMensaje("Error al eliminar el libro", true);
  }
}

function editarLibro(id) {
  const libro = libros.find((item) => item._id === id);

  if (!libro) {
    return;
  }

  libroId.value = libro._id;
  titulo.value = libro.titulo;
  autor.value = libro.autor;
  genero.value = libro.genero;
  estado.value = libro.estado;
  calificacion.value = libro.calificacion > 0 ? libro.calificacion : "";
  portada.value = libro.portada;
  resena.value = libro.resena;

  tituloFormulario.textContent = "Editar libro";
  btnGuardar.textContent = "Actualizar libro";

  controlarCalificacion();

  window.scrollTo({
    top: 250,
    behavior: "smooth"
  });
}

function cancelarEdicion() {
  libroId.value = "";
  formLibro.reset();
  tituloFormulario.textContent = "Registrar libro";
  btnGuardar.textContent = "Guardar libro";
  controlarCalificacion();
}

function mostrarLibros() {
  listaLibros.innerHTML = "";

  const texto = buscar.value.toLowerCase();
  const estadoSeleccionado = filtroEstado.value;

  const librosFiltrados = libros.filter((libro) => {
    const coincideTexto =
      libro.titulo.toLowerCase().includes(texto) ||
      libro.autor.toLowerCase().includes(texto) ||
      libro.genero.toLowerCase().includes(texto);

    const coincideEstado =
      estadoSeleccionado === "" || libro.estado === estadoSeleccionado;

    return coincideTexto && coincideEstado;
  });

  if (librosFiltrados.length === 0) {
    listaLibros.innerHTML = `
      <div class="sin-resultados">
        <h3>No hay resultados</h3>
        <p>No se encontraron libros registrados.</p>
      </div>
    `;
    return;
  }

  librosFiltrados.forEach((libro) => {
    const imagen = libro.portada || "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800";
    const textoCalificacion = libro.calificacion > 0
      ? "★".repeat(libro.calificacion) + "☆".repeat(5 - libro.calificacion)
      : "Sin calificar";

    listaLibros.innerHTML += `
      <div class="tarjeta">
        <img src="${imagen}" alt="Portada del libro">
        <div class="contenido">
          <span class="estado">${libro.estado}</span>
          <h3>${libro.titulo}</h3>
          <p><strong>Autor:</strong> ${libro.autor}</p>
          <p><strong>Género:</strong> ${libro.genero}</p>
          <p><strong>Calificación:</strong> ${textoCalificacion}</p>
          <p><strong>Reseña:</strong> ${libro.resena}</p>

          <div class="acciones">
            <button class="btn-editar" onclick="editarLibro('${libro._id}')">Editar</button>
            <button class="btn-eliminar" onclick="eliminarLibro('${libro._id}')">Eliminar</button>
          </div>
        </div>
      </div>
    `;
  });
}

function actualizarIndicadores() {
  totalLibros.textContent = libros.length;

  const terminados = libros.filter((libro) => libro.estado === "Terminado").length;
  const pendientes = libros.filter((libro) => libro.estado === "Pendiente").length;
  const librosConCalificacion = libros.filter((libro) => libro.calificacion > 0);

  librosTerminados.textContent = terminados;
  librosPendientes.textContent = pendientes;

  if (librosConCalificacion.length === 0) {
    promedioCalificacion.textContent = "0";
    return;
  }

  const suma = librosConCalificacion.reduce((total, libro) => total + libro.calificacion, 0);
  promedioCalificacion.textContent = (suma / librosConCalificacion.length).toFixed(1);
}

function mostrarMensaje(texto, error) {
  mensaje.textContent = texto;
  mensaje.style.color = error ? "#a94442" : "#2d7a46";

  setTimeout(() => {
    mensaje.textContent = "";
  }, 3000);
}