// --- CONSTANTES DE CONFIGURACIÓN ---
const HISTORY_API_ENDPOINT = "/payments"; // Tu endpoint GET
const UPLOAD_API_ENDPOINT = "/payments";  // Tu endpoint POST
const INDEX_PAGE = "index.html";
const LOCAL_STORAGE_KEY = 'payment_document_detail'; // Clave temporal si la necesitamos

/**
 * Función para obtener la clase de color basada en el estado.
 */
function getStatusColor(status) {
    if (!status) return 'bg-gray-100 text-gray-600';
    const s = status.toLowerCase();
    if (s.includes('successful') || s.includes('processed') || s.includes('exitoso')) return 'bg-success/20 text-success';
    if (s.includes('pending') || s.includes('pendiente')) return 'bg-warning/20 text-warning';
    if (s.includes('error') || s.includes('failed') || s.includes('fallido')) return 'bg-error/20 text-error';
    if (s.includes('processing') || s.includes('queued')) return 'bg-indigo-100 text-primary-indigo';
    return 'bg-gray-100 text-gray-600';
}