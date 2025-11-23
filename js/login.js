//index
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");
  const usuario = document.getElementById("codigo");
  const contraseña = document.getElementById("contraseña");
  const mensajeError = document.getElementById("mensaje-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); 

    // Validación básica-------------------------------------------------------------------------
    if (usuario.value.trim() === "" || contraseña.value.trim() === "") {
      mostrarError("Por favor completa todos los campos");
      return;
    }

    // Validación de credenciales----------------------------------------------------------------
    if (usuario.value === "sena" && contraseña.value === "123") {
      localStorage.setItem("usuarioNombre", usuario.value);
      mensajeError.style.display = "none";
      window.location.href = "./paginas/panel.html";; 
    } else {
      window.location.href = "./paginas/registro/error.html";
    }
  });

  function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = "block";
  }
});

// pagina de registro--------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-registro");
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const codigo = document.getElementById("codigo");
    const cedula = document.getElementById("cedula");
    const contrasena = document.getElementById("contraseña");
    const mensajeError = document.getElementById("mensaje-error");
    
    function mostrarError(mensaje) {
        mensajeError.textContent = mensaje;
        mensajeError.style.display = "block";
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault(); 

        mensajeError.style.display = "none";

        // Validación de Campos Vacíos-------------------------------------------------------------------
        if (nombre.value.trim() === "" || correo.value.trim() === "" || codigo.value.trim() === "" || cedula.value.trim() === "" || contrasena.value.trim() === "") {
            mostrarError("Por favor completa todos los campos del formulario.");
            return;
        }

        // Validación de correo------------------------------------------------------------------
        if (!correo.value.includes('@') || !correo.value.includes('.')) {
             mostrarError("Por favor ingresa un correo electrónico válido.");
             return;
        }
        // Código ya existente---------------------------------------------------------------------
        if (codigo.value.trim() === "02") { 
            mostrarError("El código de usuario ingresado ya está en uso.");
        } else {
            window.location.href = "../../index.html"; 
        }
    });
});

