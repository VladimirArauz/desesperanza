const form = document.getElementById("formPan");
const listaPanes = document.getElementById("listaPanes");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Obtiene los datos del formulario
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = document.getElementById("precio").value;
  const foto = document.getElementById("foto").files[0];

  // Crear URL temporal para mostrar la imagen
  const imagenURL = URL.createObjectURL(foto);

  // Crear la tarjeta del pan
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img src="${imagenURL}" alt="${nombre}">
    <h3>${nombre}</h3>
    <p>${descripcion}</p>
    <strong>$${precio}</strong>
  `;

  // Agregar la tarjeta a la lista
  listaPanes.appendChild(card);

  // Limpiar el formulario
  form.reset();
});
