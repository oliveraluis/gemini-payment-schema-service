// Este script asume que utils.js ya se cargó.

document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    document.getElementById('refreshButton').addEventListener('click', loadHistory);
    // Configurar el cierre del modal
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('detailModal').classList.add('hidden');
    });
});

/**
 * Carga el historial y renderiza la tabla.
 */
async function loadHistory() {
    // ... (Lógica de mensajes de estado y carga - Igual que antes) ...
    const historyTableBody = document.getElementById('historyTableBody');
    const statusMessage = document.getElementById('statusMessage');
    const tableWrapper = document.getElementById('tableWrapper');

    historyTableBody.innerHTML = '';
    tableWrapper.classList.add('hidden');
    statusMessage.textContent = 'Cargando historial de pagos...';
    statusMessage.className = 'text-center py-16 text-gray-500 text-lg font-semibold block';

    try {
        const response = await fetch(HISTORY_API_ENDPOINT);
        if (!response.ok) throw new Error(`Error ${response.status}: Fallo en la API.`);

        const history = await response.json();

        if (!history || history.length === 0) {
            statusMessage.textContent = '¡No hay registros de pagos procesados aún!';
            statusMessage.className = 'text-center py-16 text-warning text-2xl font-bold block';
            return;
        }

        statusMessage.classList.add('hidden');
        tableWrapper.classList.remove('hidden');
        renderHistoryTable(history, historyTableBody);

    } catch (error) {
        console.error("Fallo al obtener historial:", error);
        statusMessage.textContent = `❌ ERROR: ${error.message}. Revise su servidor Spring Boot.`;
        statusMessage.className = 'text-center py-16 bg-red-100 text-error text-xl font-bold block';
    }
}

/**
 * Renderiza los datos en la tabla y configura los enlaces de detalle (ahora modal).
 */
function renderHistoryTable(history, tableBody) {
    tableBody.innerHTML = '';

    history.forEach((doc, index) => {
        const status = doc.status || 'PENDING';
        const statusClass = getStatusColor(status);
        const amountDisplay = doc.amount || 'S/ 0.00';
        const recipientDisplay = doc.recipient || 'N/A';
        const statusText = status.toUpperCase();
        const dateTimeDisplay = doc.dateTime || 'N/A';
        const idShort = doc.paymentId ? doc.paymentId.substring(doc.paymentId.length - 8) : `TEMP-${index}`;

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition duration-150';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">${idShort}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dateTimeDisplay}</td>
            <td class="px-6 py-4 whitespace-nowrap text-lg font-bold ${status.toLowerCase() === 'processed' ? 'text-primary-dark' : 'text-gray-400'}">
                ${amountDisplay}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">${recipientDisplay}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                    ${statusText}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" class="text-primary-indigo hover:text-primary-dark details-link" data-id="${doc.paymentId || index}">Ver Detalles</a>
            </td>
        `;
        tableBody.appendChild(row);

        // Adjuntar el manejador de clic al nuevo elemento
        row.querySelector('.details-link').addEventListener('click', (e) => {
            e.preventDefault();
            showDetailsModal(doc);
        });
    });
}

/**
 * Muestra el modal con los detalles del documento.
 */
function showDetailsModal(doc) {
    const modal = document.getElementById('detailModal');

    // 1. Rellenar datos en el encabezado y resumen

    // ID de Registro (paymentId)
    document.getElementById('modalRecordId').textContent = `${doc.paymentId || 'N/A'}`;

    // Estado, Color y Texto
    const statusText = doc.status ? doc.status.toUpperCase() : 'N/A';
    // Se asume que getStatusColor está definido en tu utils.js
    const statusClass = getStatusColor(doc.status);
    document.getElementById('modalFinalStatus').textContent = statusText;
    // Usamos 'text-base' para la fuente del estado en el diseño mejorado
    document.getElementById('modalFinalStatus').className = `px-3 py-1 text-base font-bold rounded-full shadow-sm ${statusClass}`;

    // Monto
    document.getElementById('modalTotalAmount').textContent = doc.amount || 'S/ 0.00';

    // Fecha de Creación del Registro (createdAt - Asumiendo que viene como string compatible con new Date())
    const createdAtDate = doc.createdAt ? new Date(doc.createdAt).toLocaleString('es-PE', { timeZone: 'America/Lima' }) : 'N/A';
    document.getElementById('modalCreatedAt').textContent = createdAtDate;

    // 2. LÓGICA DE IMAGEN ELIMINADA:
    // Ya no se intenta buscar ni manipular 'modalPaymentImage' o 'base64Image'

    // Si estás usando el diseño mejorado, asegúrate de que el 'imagePlaceholder' esté siempre visible
    // en el panel izquierdo (si no hay imagen en el HTML) o puedes eliminar ese panel por completo.

    // 3. Tabla de Detalles (Datos Extraídos)

    // Recipiente
    document.getElementById('modalRecipient').textContent = doc.recipient || 'N/A';

    // Fecha y Hora de la Transacción (dateTime)
    document.getElementById('modalDateTime').textContent = doc.dateTime || 'N/A';

    // Destino (Yape/Plin)
    document.getElementById('modalDestination').textContent = doc.destination || 'N/A';

    // Número de Teléfono
    document.getElementById('modalPhoneNumber').textContent = doc.phoneNumber || 'N/A';

    // Código de Operación
    document.getElementById('modalOperationCode').textContent = doc.operationCode || 'N/A';

    // 4. Mostrar el modal
    modal.classList.remove('hidden');

    // Opcional: Para la animación CSS del diseño mejorado (si lo implementaste)
    setTimeout(() => {
        const modalContent = modal.querySelector('.relative');
        if(modalContent) {
            modalContent.classList.remove('scale-95', 'opacity-0');
        }
    }, 10);
}