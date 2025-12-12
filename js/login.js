// LOGIN -------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");
  if (!form) return;

  const usuarioInput = document.getElementById("codigo");   
  const contrasenaInput = document.getElementById("contraseña");
  const mensajeError = document.getElementById("mensaje-error");

  function mostrarError(m) {
    mensajeError.textContent = m;
    mensajeError.style.display = "block";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensajeError.style.display = "none";

    const usuario = usuarioInput.value.trim();
    const contrasena = contrasenaInput.value.trim();

    if (usuario === "" || contrasena === "") {
      mostrarError("Por favor ingresa ambos campos.");
      return;
    }

    // login sin conexion -----------------------------------------------
    if (usuario === "sena" && contrasena === "123") {
      localStorage.setItem("usuarioNombre", "Administrador Sena");
      window.location.href = "./paginas/panel.html";
      return;
    }

    // login para Backend ------------------------------------------
    const datosLogin = {
      entrada: usuario,    
      contrasena: contrasena
    };

    try {
      const respuesta = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosLogin)
      });

      if (respuesta.status === 401) {
        window.location.href = "./paginas/registro/error.html";
        return;
      }

      if (!respuesta.ok) {
        const msg = await respuesta.text();
        mostrarError(msg);
        return;
      }
      // Lee usuario del backend ---------------------------------------------
      const usuarioBack = await respuesta.json();

      localStorage.setItem("usuarioNombre", usuarioBack.nombresYApellidos);
      window.location.href = "./paginas/panel.html";

    } catch (error) {
      window.location.href = "./paginas/registro/error.html";
    }
  });
});

// REGISTRO -------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-registro");
  if (!form) return; 

  const nombre = document.getElementById("nombre");
  const telefono = document.getElementById("telefono");
  const correo = document.getElementById("correo");
  const codigo = document.getElementById("codigo");
  const cedula = document.getElementById("cedula");
  const contrasena = document.getElementById("contraseña");
  const mensajeError = document.getElementById("mensaje-error");

  function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = "block";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensajeError.style.display = "none";

    if (
      nombre.value.trim() === "" ||
      telefono.value.trim() === ""||
      correo.value.trim() === "" ||
      codigo.value.trim() === "" ||
      cedula.value.trim() === "" ||
      contrasena.value.trim() === ""
    ) {
      mostrarError("Por favor completa todos los campos.");
      return;
    }

    if (!correo.value.includes("@") || !correo.value.includes(".")) {
      mostrarError("Por favor ingresa un correo válido.");
      return;
    }

    const usuarioNuevo = {
      nombresYApellidos: nombre.value.trim(),
      telefono: telefono.value.trim(),
      correo: correo.value.trim(),
      codigo: codigo.value.trim(),
      cedula: cedula.value.trim(),
      contrasena: contrasena.value.trim()
    };

    try {
      const respuesta = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioNuevo)
      });

      const mensajeBack = await respuesta.text();
      if (!respuesta.ok) {
        mostrarError(mensajeBack);
        return;
      }

      alert("Usuario creado con éxito");
      window.location.href = "../../index.html";
    } catch (error) {
      mostrarError("Error de conexion con el servidor.");
    }
  });
});


// TABLA USUARIOS -------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const cuerpoTabla = document.getElementById("usuarios-body");
  if (!cuerpoTabla) return;

  try {
    const respuesta = await fetch("http://localhost:8080/api/usuarios");
    if (!respuesta.ok) throw new Error("Error cargando usuarios");

    const usuarios = await respuesta.json();
    cuerpoTabla.innerHTML = "";

    usuarios.forEach(u => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${u.nombresYApellidos}</td>
        <td>${u.telefono || "N/A"}</td>
        <td>${u.correo}</td>
        <td>${u.codigo}</td>
        <td>${u.cedula}</td>
        <td>${u.contrasena}</td>
        <td class="acciones-usuario">
          <button class="btn-amarillo" onclick="editarUsuario(${u.id})">Editar</button>
          <button class="btn-rojo" onclick="borrarUsuario('${u.id}')">Borrar</button>
        </td>
      `;
      cuerpoTabla.appendChild(fila);
    });

  } catch (error) {
    cuerpoTabla.innerHTML = `
      <tr>
        <td colspan="7" class="text-danger text-center">
          Error cargando usuarios
        </td>
      </tr>`;
  }
});
async function borrarUsuario(id) {
  if (!confirm("¿Seguro que deseas borrar este usuario?")) return;

  try {
    const respuesta = await fetch(`http://localhost:8080/api/usuarios/${id}`, { 
  method: "DELETE"
    });

    if (!respuesta.ok) {
      alert("Error borrando el usuario");
      return;
    }

    alert("Usuario eliminado correctamente");
    location.reload();
  } catch (error) {
    alert("Error de conexión con el servidor");
  }
}

// EDITAR USUARIO ------------------------------------------

// Función Auxiliar: Obtener datos de un solo usuario por ID
async function obtenerUsuarioPorId(id) {
    // La URL ahora recibe un ID válido, no 'undefined'
    const respuesta = await fetch(`http://localhost:8080/api/usuarios/${id}`);
    if (!respuesta.ok) {
        // Mejoramos el manejo de errores si el usuario no existe (404)
        throw new Error("Error obteniendo datos del usuario. ID no encontrado.");
    }
    return respuesta.json();
}

async function editarUsuario(id) {
    try {
        // 1. Obtener los datos del usuario usando el ID
        const usuario = await obtenerUsuarioPorId(id);

        // 2. Llenar el formulario del modal con los datos obtenidos
        // (Asegúrate que los ID en el modal HTML sean: edit-id, edit-nombresYApellidos, etc.)
        document.getElementById('edit-id').value = usuario.id;
        document.getElementById('edit-nombresYApellidos').value = usuario.nombresYApellidos;
        document.getElementById('edit-telefono').value = usuario.telefono;
        document.getElementById('edit-correo').value = usuario.correo;
        document.getElementById('edit-codigo').value = usuario.codigo;
        document.getElementById('edit-cedula').value = usuario.cedula;
        document.getElementById('edit-contrasena').value = usuario.contrasena;

        // 3. Mostrar el modal
        const modalElement = document.getElementById('modalEditarUsuario');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

    } catch (error) {
        alert("Error cargando los datos del usuario para edición. Verifique la conexión.");
        console.error("Error en editarUsuario:", error);
    }
}

// Escuchar el evento submit del formulario de edición para enviar el PUT
document.addEventListener("DOMContentLoaded", () => {
    // Si la tabla no existe, salimos.
    const cuerpoTabla = document.getElementById("usuarios-body");
    if (!cuerpoTabla) return;

    // --- CORRECCIÓN EN LA CARGA DE LA TABLA ---
    // Aseguramos que el botón editar use 'u.id' (CORRECCIÓN DEL ERROR 'undefined')
    // El resto del código de carga de la tabla debe usar:
    /*
    <button class="btn-amarillo" onclick="editarUsuario(${u.id})">Editar</button>
    <button class="btn-rojo" onclick="borrarUsuario('${u.id}')">Borrar</button>
    */
    // Si ese código ya estaba dentro de tu función asíncrona de carga, ¡déjalo allí!
    // ------------------------------------------

    const formularioEditar = document.getElementById('form-editar-usuario');
    if (!formularioEditar) return;
    
    formularioEditar.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita el envío tradicional

        const id = document.getElementById('edit-id').value;
        
        // Crea el objeto con los datos del formulario
        const datosActualizados = {
            id: id,
            nombresYApellidos: document.getElementById('edit-nombresYApellidos').value,
            telefono: document.getElementById('edit-telefono').value,
            correo: document.getElementById('edit-correo').value,
            codigo: document.getElementById('edit-codigo').value,
            cedula: document.getElementById('edit-cedula').value,
            contrasena: document.getElementById('edit-contrasena').value
        };

        try {
            // Envío del PUT al Backend
            const respuesta = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosActualizados)
            });

            if (!respuesta.ok) {
                 const errorMsg = await respuesta.text();
                 throw new Error("Error al guardar la edición: " + errorMsg);
            }

            alert("Usuario actualizado correctamente.");
            
            // Ocultar el modal después de guardar
            const modalElement = document.getElementById('modalEditarUsuario');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            location.reload(); // Recargar la tabla
            
        } catch (error) {
            alert("Error al actualizar el usuario. Verifique la conexión o los datos.");
            console.error(error);
        }
    });
});
