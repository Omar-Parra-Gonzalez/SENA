// panel.js
document.addEventListener("DOMContentLoaded", () => {
    const cuerpoFactura = document.getElementById("productos-body");
    const totalElemento = document.getElementById("total");
    const spanFactura = document.getElementById("numero-factura");
    const FACTURA_KEY = "ultimaFacturaNumero";
    const FACTURAS_GUARDADAS_KEY = "facturasGuardadas";
    const prefijo = "FV ";

    let numeroActual = parseInt(localStorage.getItem(FACTURA_KEY)) || 1;

    const productosSeleccionados = JSON.parse(localStorage.getItem("productosSeleccionados")) || [];

    // Cargar nombre de usuario-------------------------------------------------------
    const nombreUsuario = localStorage.getItem("usuarioNombre");
    const etiquetaNombre = document.getElementById("nombre-usuario");
    if (nombreUsuario && etiquetaNombre) {
        etiquetaNombre.textContent = nombreUsuario;
    }
    
    // Obtener y formatear fecha/vendedor-----------------------------------------------------------------------------
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const nombreVendedor = localStorage.getItem("usuarioNombre") || "Cajero"; 
    const spanFecha = document.getElementById("factura-fecha");
    const spanVendedor = document.getElementById("factura-vendedor");
    if (spanFecha) {
        spanFecha.textContent = fechaFormateada;
    }
    if (spanVendedor) {
        spanVendedor.textContent = nombreVendedor;
    }
    
    function formatearNumeroFactura(num) {
        return prefijo + String(num).padStart(3, '0');
    }

    // Mostrar número de factura actual-----------------------------------------------
    if (spanFactura) {
        spanFactura.textContent = formatearNumeroFactura(numeroActual);
    }

    // TABLA Y CÁLCULO DE TOTAL ------------------------------------------------------
    let total = 0;
    if (productosSeleccionados.length === 0) {
        console.log("No hay productos seleccionados.");
    } else {
        cuerpoFactura.innerHTML = "";
        
        productosSeleccionados.forEach((producto, index) => {
            const fila = document.createElement("tr");
            const valor = parseFloat(producto.precio) * parseInt(producto.cantidad || 1);
            total += valor;

            fila.innerHTML = `
                <th scope="row">${String(index + 1).padStart(2, "0")}</th>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad || 1}</td>
                <td>${producto.tipo || "-"}</td>
                <td>${producto.vendedor || "-"}</td>
                <td>$${valor.toLocaleString()}</td>
            `;
            cuerpoFactura.appendChild(fila);
        });

        const filaTotal = document.createElement("tr");
        filaTotal.innerHTML = `
            <td colspan="5" class="text-end table-primary"><strong>Total a pagar:</strong></td>
            <td class="text-end"><strong>$${total.toLocaleString()}</strong></td>
        `;
        cuerpoFactura.appendChild(filaTotal);

        totalElemento.textContent = `$${total.toLocaleString()}`;
    }
    
    // Botón Borrar Datos----------------------------------------------
    const btnBorrar = document.getElementById("btn-borrar-datos");
    if (btnBorrar) {
        btnBorrar.addEventListener('click', () => {
            localStorage.removeItem("productosSeleccionados");
            window.location.reload(); 
        });
    }

    // Boton imprimir --------------------------------------------------------------------------------------
    function esMovil() {
        const ua = navigator.userAgent.toLowerCase();
        return /android|iphone|ipad|ipod|mobile|blackberry|mini|windows phone|tablet|kindle/.test(ua);
    }
    const btnImprimir = document.getElementById("btn-imprimir");

    if (btnImprimir) {
        btnImprimir.addEventListener('click', () => {

            if (esMovil()) {
            alert("No se pueden imprimir facturas desde dispositivos móviles.");
            return;
        }

            if (productosSeleccionados.length === 0) {
                alert("No puedes imprimir. La factura está vacía.");
                return;
            }

            const totalTexto = totalElemento.textContent.replace('$', '').replace(/,/g, '');
            const totalNumerico = parseFloat(totalTexto) || 0;

            const facturaGuardar = {
                numero: formatearNumeroFactura(numeroActual),
                fecha: fechaFormateada,
                vendedor: nombreVendedor,
                productos: productosSeleccionados,
                total: totalNumerico
            };

            let facturasGuardadas = JSON.parse(localStorage.getItem(FACTURAS_GUARDADAS_KEY)) || [];
            facturasGuardadas.push(facturaGuardar);
            localStorage.setItem(FACTURAS_GUARDADAS_KEY, JSON.stringify(facturasGuardadas));

            alert("Imprimiendo Factura N°: " + facturaGuardar.numero);

            numeroActual++;
            localStorage.setItem(FACTURA_KEY, numeroActual);

            localStorage.removeItem("productosSeleccionados");
            if (spanFactura) {
                spanFactura.textContent = formatearNumeroFactura(numeroActual);
            }
            if (cuerpoFactura) {
                cuerpoFactura.innerHTML = '';
            }
            if (totalElemento) {
                totalElemento.textContent = '$0';
            }
        });
    }    
});

