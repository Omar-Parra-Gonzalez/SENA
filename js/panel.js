// panel.js

document.addEventListener("DOMContentLoaded", () => {
    // Definiciones de elementos
    const cuerpoFactura = document.getElementById("productos-body");
    const totalElemento = document.getElementById("total");
    const spanFactura = document.getElementById("numero-factura");
    const FACTURA_KEY = "ultimaFacturaNumero";
    const FACTURAS_GUARDADAS_KEY = "facturasGuardadas";
    const prefijo = "FV ";

    // Inicialización del número de factura
    let numeroActual = parseInt(localStorage.getItem(FACTURA_KEY)) || 1;

    // Obtener los productos guardados en localStorage
    const productosSeleccionados = JSON.parse(localStorage.getItem("productosSeleccionados")) || [];

    // Cargar nombre de usuario
    const nombreUsuario = localStorage.getItem("usuarioNombre");
    const etiquetaNombre = document.getElementById("nombre-usuario");
    if (nombreUsuario && etiquetaNombre) {
        etiquetaNombre.textContent = nombreUsuario;
    }
    
    // Obtener y formatear fecha/vendedor
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
    
    // Función de formato
    function formatearNumeroFactura(num) {
        return prefijo + String(num).padStart(3, '0');
    }

    // Mostrar número de factura actual
    if (spanFactura) {
        spanFactura.textContent = formatearNumeroFactura(numeroActual);
    }

    // --- LÓGICA DE CARGA DE TABLA Y CÁLCULO DE TOTAL ---
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
    
    // Lógica del botón Borrar Datos
    const btnBorrar = document.getElementById("btn-borrar-datos");
    if (btnBorrar) {
        btnBorrar.addEventListener('click', () => {
            localStorage.removeItem("productosSeleccionados");
            window.location.reload(); 
        });
    }

    // -------------------------------------------------------------------
    // LÓGICA UNIFICADA DEL BOTÓN IMPRIMIR (SOLO UN LISTENER)
    // -------------------------------------------------------------------
    const btnImprimir = document.getElementById("btn-imprimir");
    
    if (btnImprimir) {
        btnImprimir.addEventListener('click', () => {
            
            // 1. Verificar si la factura está vacía
            if (productosSeleccionados.length === 0) {
                alert("No puedes imprimir. La factura está vacía.");
                return; 
            }
            
            // 2. Obtener el total numérico (calculado previamente)
            const totalTexto = totalElemento.textContent.replace('$', '').replace(/,/g, '');
            const totalNumerico = parseFloat(totalTexto) || 0;

            // 3. Crear OBJETO DE FACTURA COMPLETA
            const facturaGuardar = {
                numero: formatearNumeroFactura(numeroActual),
                fecha: fechaFormateada,
                vendedor: nombreVendedor,
                productos: productosSeleccionados,
                total: totalNumerico
            };
            
            // 4. GUARDAR LA FACTURA COMPLETA EN EL ARREGLO GLOBAL
            let facturasGuardadas = JSON.parse(localStorage.getItem(FACTURAS_GUARDADAS_KEY)) || [];
            facturasGuardadas.push(facturaGuardar);
            localStorage.setItem(FACTURAS_GUARDADAS_KEY, JSON.stringify(facturasGuardadas));
            
            // 5. Simulación de Impresión
            alert("Imprimiendo Factura N°: " + facturaGuardar.numero);

            // 6. INCREMENTAR Y GUARDAR EL NÚMERO DE FACTURA PARA LA PRÓXIMA (¡UN SOLO INCREMENTO!)
            numeroActual++;
            localStorage.setItem(FACTURA_KEY, numeroActual);

            // 7. LIMPIEZA DE PANTALLA
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

