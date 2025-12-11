const API_URL = "http://localhost:8080/api/productos";

// =========================================================
// FUNCIONES DE CONTROL DEL MODAL
// =========================================================

/**
 * Abre y configura el modal para CREAR o EDITAR.
 * @param {boolean} esNuevo - Indica si se está creando un producto (true) o si es una carga inicial (false).
 */
function abrirModalProducto(esNuevo = true) {
    const modalElement = document.getElementById('modalGestionProducto');
    // Inicializa o obtiene la instancia del modal de Bootstrap
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    const form = document.getElementById('form-producto');
    
    // Si es un producto nuevo (al hacer clic en "Crear Nuevo"):
    if (esNuevo) {
        // 1. Limpia el formulario
        form.reset();
        document.getElementById('id_producto').value = '';
        // 2. Actualiza el título
        document.getElementById('modalLabelProducto').textContent = 'Crear Nuevo Producto';
    } else {
        // Si no es nuevo (viene de editarProducto), solo actualiza el título.
        document.getElementById('modalLabelProducto').textContent = 'Editar Producto';
    }
    
    // 3. Muestra el modal
    modal.show();
}

/**
 * Cierra el modal de gestión de productos.
 */
function cerrarModalProducto() {
    const modalElement = document.getElementById('modalGestionProducto');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }
}


// =========================================================
// CARGA Y GENERACIÓN DE TABLA
// =========================================================

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


// =========================================================
// LÓGICA DE EDICIÓN Y ELIMINACIÓN
// =========================================================

// Cargar datos en el formulario para editar Y MOSTRAR MODAL
function editarProducto(id) {
    fetch(`${API_URL}/${id}`)
    .then(response => response.json())
    .then(prod => {
        // 1. Carga los datos en el formulario
        document.getElementById("id_producto").value = prod.id_producto;
        document.getElementById("producto").value = prod.producto;
        document.getElementById("precio").value = prod.precio;
        document.getElementById("cantidad").value = prod.cantidad;
        
        // 2. Abre el modal en modo EDICIÓN
        abrirModalProducto(false); 
    })
    .catch(error => console.error("Error al cargar producto para editar:", error));
}

// Eliminar producto
function eliminarProducto(id) {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(res => cargarProductos())
    .catch(error => console.error("Error eliminando producto:", error));
}


// =========================================================
// LÓGICA DE GUARDAR/ACTUALIZAR
// =========================================================

// Guardar o actualizar (con CIERRE DE MODAL)
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
        // CIERRA EL MODAL después de guardar/actualizar
        cerrarModalProducto(); 
        
        cargarProductos();
        this.reset();
    })
    .catch(error => console.error("Error al guardar producto:", error));
});

// =========================================================
// INICIO DE LA APLICACIÓN
// =========================================================

// Inicialmente carga la tabla
cargarProductos();