const API_URL = "http://localhost:8080/api/productos";

// Cargar lista 
function cargarProductos() {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById("lista-productos");
        tbody.innerHTML = "";
        data.forEach((prod, index) => {
            const fila = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${prod.producto}</td>
                    <td>${Number(prod.precio).toLocaleString('es-CO')}</td>
                    <td>${prod.cantidad}</td>
                    <td>
                        <div class="acciones-producto">
                            <button 
                                class="btn-amarillo"
                                onclick="editarProducto(${prod.id_producto})">
                                Editar
                            </button>
                            <button 
                                class="btn-rojo"
                                onclick="eliminarProducto(${prod.id_producto})">
                                Borrar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
    })
    .catch(error => console.error("Error al cargar productos:", error));
}

// Guardar o actualizar 
document.getElementById("form-producto").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("id_producto").value;
    const producto = document.getElementById("producto").value;
    const precio = document.getElementById("precio").value;
    const cantidad = document.getElementById("cantidad").value;
    const datos = { producto, precio, cantidad };
    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(res => {
        cargarProductos();
        this.reset();
    })
    .catch(error => console.error("Error al guardar producto:", error));
});

// Cargar datos en el formulario para editar
function editarProducto(id) {
    fetch(`${API_URL}/${id}`)
    .then(response => response.json())
    .then(prod => {
        document.getElementById("id_producto").value = prod.id_producto;
        document.getElementById("producto").value = prod.producto;
        document.getElementById("precio").value = prod.precio;
        document.getElementById("cantidad").value = prod.cantidad;
    });
}

// Eliminar producto
function eliminarProducto(id) {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;

fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(res => cargarProductos())
    .catch(error => console.error("Error eliminando producto:", error));
}
cargarProductos();
