//productos.js
document.addEventListener("DOMContentLoaded", () => {
  const tarjetas = document.querySelectorAll(".tarjeta");

  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("click", async () => {

      const idProducto = tarjeta.getAttribute("data-id");

      //const respuesta = await fetch(`http://localhost:8080/api/productos/${idProducto}`);
      const respuesta = await fetch(`https://[dominio-de-railway].up.railway.app/api/productos/${idProducto}`);
      const productoBD = await respuesta.json();

      if (!productoBD) {
        alert("Producto no encontrado en la base de datos.");
        return;
      }

      const disponible = productoBD.cantidad;

      if (disponible <= 0) {
        alert(`No hay productos disponibles de ${productoBD.producto}`);
        return;
      }

      // Pedir cantidad
      const cantidad = parseInt(prompt(`¿Cuántas unidades deseas agregar? Disponible: ${disponible}`, "1"));

      if (isNaN(cantidad) || cantidad <= 0) {
        alert("Cantidad inválida.");
        return;
      }

      if (cantidad > disponible) {
        alert(`No puedes agregar ${cantidad}. Solo hay ${disponible} unidades.`);
        return;
      }

      // Restar el inventario en Base de Datos
      //await fetch(`http://localhost:8080/api/productos/descontar/${idProducto}`
        await fetch(`https://[dominio-de-railway].up.railway.app/api/productos/descontar/${idProducto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad: cantidad })
      });

      // Crear objeto 
      const producto = {
        nombre: productoBD.producto,
        cantidad: cantidad,
        precio: productoBD.precio,
        total: productoBD.precio * cantidad,
        tipo: "Domicilio",
        vendedor: localStorage.getItem("usuarioNombre") || "Administrador"
      };

      // Guardar en localStorage
      let productosSeleccionados = JSON.parse(localStorage.getItem("productosSeleccionados")) || [];
      productosSeleccionados.push(producto);
      localStorage.setItem("productosSeleccionados", JSON.stringify(productosSeleccionados));

      alert(`"${productoBD.producto}" agregado (${cantidad} unidades).`);
      window.location.href = "../panel.html";
    });
  });
});
