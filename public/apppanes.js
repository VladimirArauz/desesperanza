async function cargarPanes() {
    const res = await fetch("/panes");
    const panes = await res.json();

    const tabla = document.getElementById("listaPanes");
    tabla.innerHTML = "";

    panes.forEach(pan => {
        const img = pan.imagen
        ? `<img src="data:image/jpeg;base64,${pan.imagen}" width="70" class="rounded">`
        : `<img src="https://via.placeholder.com/70" class="rounded">`;

        tabla.innerHTML += `
        <tr>
            <td>${img}</td>
            <td>${pan.nombre}</td>
            <td>$${pan.precio}</td>
            <td>${pan.cantidad}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarPan(${pan.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPan(${pan.id})">Eliminar</button>
            </td>
        </tr>`;
    });
}

// Guardar nuevo pan
document.getElementById("formPan").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    await fetch("/panes", {
        method: "POST",
        body: data
    });

    e.target.reset();
    cargarPanes();
});

// Eliminar pan
async function eliminarPan(id) {
    if (confirm("¿Eliminar este pan?")) {
        await fetch("/panes/" + id, { method: "DELETE" });
        cargarPanes();
    }
}

// Editar pan
async function editarPan(id) {
    const nombre = prompt("Nuevo nombre:");
    const precio = prompt("Nuevo precio:");
    const cantidad = prompt("Nueva cantidad:");
    const descripcion = prompt("Nueva descripción:");

    await fetch("/panes/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio, cantidad, descripcion })
    });

    cargarPanes();
}

cargarPanes();
