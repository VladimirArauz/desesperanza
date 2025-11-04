const apiUrl = '/api/panes';
let carrito = [];


// --- Cargar catálogo (index.html) ---
async function cargarCatalogo() {
    const catalogo = document.getElementById("catalogo-panes");
    if (!catalogo) return;

    const res = await fetch(apiUrl);
    const panes = await res.json();

    catalogo.innerHTML = "";
    panes.forEach(pan => {
        const card = document.createElement("div");
        card.className = "col";
        card.innerHTML = `
            <div class="card h-100">
                <img src="data:image/jpeg;base64,${pan.imagen}" class="card-img-top" alt="${pan.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${pan.nombre}</h5>
                    <p class="card-text">${pan.descripcion}</p>
                    <p class="card-text fw-bold">Costo: $${pan.costo}</p>
                    <p class="card-text fw-bold">Cantidad disponible: ${pan.cantidad}</p>
                    <button class="btn btn-success me-2" onclick="agregarCarrito(${pan.id})">Agregar</button>
                    <button class="btn btn-danger" onclick="eliminarCarrito(${pan.id})">Eliminar</button>
                </div>
            </div>
        `;
        catalogo.appendChild(card);
    });
}


// --- Carrito ---
function agregarCarrito(id) {
    carrito.push(id);
    actualizarCarrito();
}
function eliminarCarrito(id) {
    carrito = carrito.filter(x => x !== id);
    actualizarCarrito();
}
function actualizarCarrito() {
    const count = document.getElementById("cart-count");
    if (count) count.textContent = carrito.length;
}


// --- Cargar lista para admin (indexgestionarpanes.html) ---
async function cargarListaPanes() {
    const lista = document.getElementById("lista-panes");
    if (!lista) return;

    const res = await fetch(apiUrl);
    const panes = await res.json();

    lista.innerHTML = "";
    panes.forEach(pan => {
        const card = document.createElement("div");
        card.className = "col";
        card.innerHTML = `
            <div class="card h-100">
                <img src="data:image/jpeg;base64,${pan.imagen}" class="card-img-top">
                <div class="card-body">
                    <h5>${pan.nombre}</h5>
                    <p>${pan.descripcion}</p>
                    <p class="fw-bold">Costo: $${pan.costo}</p>
                    <p class="fw-bold">Cantidad: ${pan.cantidad}</p>
                    <button class="btn btn-warning me-2" onclick="editarPan(${pan.id})">Editar</button>
                    <button class="btn btn-danger" onclick="borrarPan(${pan.id})">Eliminar</button>
                </div>
            </div>
        `;
        lista.appendChild(card);
    });
}


// --- Editar Pan ---
function editarPan(id) {
    fetch(`${apiUrl}/${id}`)
        .then(res => res.json())
        .then(pan => {
            document.getElementById("pan-id").value = pan.id;
            document.getElementById("nombre").value = pan.nombre;
            document.getElementById("costo").value = pan.costo;
            document.getElementById("descripcion").value = pan.descripcion;
            document.getElementById("cantidad").value = pan.cantidad;
        });
}


// --- Borrar pan ---
function borrarPan(id) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(() => {
            cargarListaPanes();
            cargarCatalogo();
        });
}


// --- Guardar pan ---
const form = document.getElementById("form-pan");
if (form) {
    form.addEventListener("submit", async e => {
        e.preventDefault();
        
        const id = document.getElementById("pan-id").value;
        const nombre = document.getElementById("nombre").value;
        const costo = document.getElementById("costo").value;
        const descripcion = document.getElementById("descripcion").value;
        const cantidad = document.getElementById("cantidad").value;
        const imagenInput = document.getElementById("imagen");

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("costo", costo);
        formData.append("descripcion", descripcion);
        formData.append("cantidad", cantidad);
        if (imagenInput.files[0]) formData.append("imagen", imagenInput.files[0]);

        if (id) {
            await fetch(`${apiUrl}/${id}`, { method: 'PUT', body: formData });
        } else {
            await fetch(apiUrl, { method: 'POST', body: formData });
        }

        form.reset();
        document.getElementById("pan-id").value = "";
        cargarListaPanes();
        cargarCatalogo();
    });
}


document.addEventListener("DOMContentLoaded", () => {
    cargarCatalogo();
    cargarListaPanes();
});
