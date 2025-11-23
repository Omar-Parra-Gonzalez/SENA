// pagos.js
function mostrarDetalles(numeroFactura) {
    const FACTURAS_GUARDADAS_KEY = "facturasGuardadas";
    const facturasGuardadas = JSON.parse(localStorage.getItem(FACTURAS_GUARDADAS_KEY)) || [];
    const factura = facturasGuardadas.find(f => f.numero === numeroFactura);

    if (factura) {
        let detalleText = `Factura N°: ${factura.numero}\nFecha: ${factura.fecha}\nVendedor: ${factura.vendedor}\n\n`;
        detalleText += `Productos Detallados:\n`;
        
        factura.productos.forEach(p => {
            const cantidad = p.cantidad || 1;
            const precioUnitario = parseFloat(p.precio) || 0;
            const subtotal = precioUnitario * cantidad;
            
            detalleText += `  - ${cantidad}x ${p.nombre} (Tipo: ${p.tipo || '-'}) - $${subtotal.toLocaleString('es-ES')}\n`;
        });
        
        detalleText += `\nTOTAL A PAGAR: $${factura.total.toLocaleString('es-ES')}`;
        alert(detalleText); 
    } else {
        alert(`No se encontró la factura ${numeroFactura} en el historial.`);
    }
}

//Carga y Borrado con Modal----------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const FACTURAS_GUARDADAS_KEY = "facturasGuardadas";
    const FACTURA_KEY = "ultimaFacturaNumero"; 
    const facturasGuardadas = JSON.parse(localStorage.getItem(FACTURAS_GUARDADAS_KEY)) || [];
    const facturasBody = document.getElementById("facturas-body");

    if (!facturasBody) return;

    //Carga de la tabla------------------------------------------------------------------------------------------------------
    if (facturasGuardadas.length === 0) {
        facturasBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay pagos recibidos aún.</td></tr>';
    } else {
        facturasBody.innerHTML = ''; 

        facturasGuardadas.forEach((factura) => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${factura.numero}</td>
                <td>${factura.fecha}</td>
                <td>${factura.vendedor}</td>
                <td>$${factura.total.toLocaleString('es-ES')}</td>
                <td><button class="btn btn-sm btn-info" onclick="mostrarDetalles('${factura.numero}')">Ver</button></td>
            `;
            facturasBody.appendChild(fila);
        });
    }

    //Boton de borrado (MODAL)--------------------------------------------------------------------------------------
    const btnConfirmarBorrado = document.getElementById("btn-confirmar-borrado");
    const confirmarBorradoModalElement = document.getElementById('confirmarBorradoModal');
    
    if (confirmarBorradoModalElement && typeof bootstrap !== 'undefined') {
        const modalInstance = new bootstrap.Modal(confirmarBorradoModalElement);

        if (btnConfirmarBorrado) {
            btnConfirmarBorrado.addEventListener('click', () => {
                
                localStorage.removeItem(FACTURAS_GUARDADAS_KEY);
                localStorage.setItem(FACTURA_KEY, 1); 
                modalInstance.hide();
                alert("El historial se ha borrado.");
                window.location.reload();
            });
        }
    }
});