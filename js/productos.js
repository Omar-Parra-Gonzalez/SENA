// productos.js

document.addEventListener("DOMContentLoaded", () => {
  const tarjetas = document.querySelectorAll(".tarjeta");

  // Lista de productos y precios
  const precios = {
    "1 Pollo Broaster": 45000,
    "Medio Broaster": 25000,
    "Cuarto Broaster": 15000,
    "Presa Broaster": 8000,
    "Papa Amarilla": 6000,
    "Porción Francesa": 5000,
    "Combo Familiar": 65000,
    "Yuca Frita": 6000,
    "Coca Cola 3L": 7000,
    "Coca Cola medio litro": 4000,
    "Coca Cola 400ml": 3000,
    "Jugo Natural": 5000
  };

  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {

      // Obtener nombre del producto
      const textoCompleto = tarjeta.querySelector("p").textContent.trim();
      const productoLimpio = textoCompleto.replace(/^\s*\d+\s*/, '').trim();
      const productoNombre = productoLimpio;

      if (!precios[productoNombre]) {
        alert(productoNombre +" ¡NO ENCONTRADO!");
        return;
      }

      const precio = precios[productoNombre];

      // Pedir cantidad
      const cantidad = parseInt(prompt(`¿Cuántas unidades de "${productoNombre}" deseas agregar?`, "1"));
      if (isNaN(cantidad) || cantidad <= 0) {
        alert("Ingrese las cantidades a facturar.");
        return;
      }

      // Crear objeto producto
      const producto = {
        nombre: productoNombre,
        cantidad: cantidad,
        precio: precio,
        total: precio * cantidad,
        tipo: "Domicilio",
        vendedor: localStorage.getItem("usuarioNombre") || "Administrador"
      };

      // Guardar en localStorage
      let productosSeleccionados = JSON.parse(localStorage.getItem("productosSeleccionados")) || [];
      productosSeleccionados.push(producto);

      localStorage.setItem("productosSeleccionados", JSON.stringify(productosSeleccionados));

      alert(`"${productoNombre}" agregado al pedido (${cantidad} unidades).`);
      window.location.href = "../panel.html";
    });
  });
});

