const API_URL = "https://[dominio-de-railway].up.railway.app/api/productos";

// Funciones del modal

/** Configura el modal en editar.
@param {boolean} esNuevo 
 */
function abrirModalProducto(esNuevo = true) {
    const modalElement = document.getElementById('modalGestionProducto');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    const form = document.getElementById('form-producto');
    
    if (esNuevo) {
        form.reset();
        document.getElementById('id_producto').value = '';
        document.getElementById('modalLabelProducto').textContent = 'Crear Nuevo Producto';
    } else {
        document.getElementById('modalLabelProducto').textContent = 'Editar Producto';
    }
    
    modal.show();
}

function cerrarModalProducto() {
    const modalElement = document.getElementById('modalGestionProducto');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }
}

// Carga la tabla
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


// Eliminar datos -------------------------------------------------------------
function editarProducto(id) {
    fetch(`${API_URL}/${id}`)
    .then(response => response.json())
    .then(prod => {
        document.getElementById("id_producto").value = prod.id_producto;
        document.getElementById("producto").value = prod.producto;
        document.getElementById("precio").value = prod.precio;
        document.getElementById("cantidad").value = prod.cantidad;
        abrirModalProducto(false); 
    })
    .catch(error => console.error("Error al cargar producto para editar:", error));
}
function eliminarProducto(id) {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(res => cargarProductos())
    .catch(error => console.error("Error eliminando producto:", error));
}
// Guardar o actualizar --------------------------------------------------------------------- 
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
        cerrarModalProducto(); 
        
        cargarProductos();
        this.reset();
    })
    .catch(error => console.error("Error al guardar producto:", error));
});
cargarProductos();
