// Este script asume que utils.js ya se cargó.

document.addEventListener('DOMContentLoaded', setupUploadPage);

function setupUploadPage() {
    // Obtener todos los elementos del formulario
    const imageUpload = document.getElementById('imageUpload');
    const submitButton = document.getElementById('submitButton');
    const imagePreview = document.getElementById('imagePreview');
    const previewText = document.getElementById('previewText');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const statusMessage = document.getElementById('statusMessage');
    const labelUploadText = document.getElementById('labelUploadText');
    const uploadForm = document.getElementById('uploadForm');

    let uploadedFile = null;

    // Lógica para previsualizar la imagen seleccionada
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadedFile = file;
            fileNameDisplay.textContent = `Archivo: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
            labelUploadText.textContent = `Archivo Seleccionado: ${file.name}`;
            submitButton.disabled = false;

            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden');
                previewText.classList.add('hidden');
            };
            reader.readAsDataURL(file);
            statusMessage.classList.add('hidden');
        }
    });

    // Lógica para enviar el formulario a la API
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!uploadedFile) return;

        showLoadingState();

        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);

            // Llamada al endpoint POST /payments
            const response = await fetch(UPLOAD_API_ENDPOINT, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                // Si la respuesta no es 2xx (ej. 400, 500)
                throw new Error(`Error ${response.status} en el servidor. El procesamiento falló.`);
            }

            // Si es 201 Created, el procesamiento terminó.
            alert('✅ Comprobante enviado y registrado. Redirigiendo al Dashboard.');

            window.location.href = INDEX_PAGE;

        } catch (error) {
            console.error("Error al enviar la imagen:", error);
            statusMessage.textContent = `❌ Fallo en el envío o en el procesamiento: ${error.message}`;
            statusMessage.className = 'text-center p-3 rounded-lg font-semibold bg-error/10 text-error block';

            submitButton.disabled = false;
            submitButton.innerHTML = '<span>Enviar a Procesamiento Asíncrono</span>';
        }
    });

    function showLoadingState() {
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Enviando al servidor...</span>
        `;
        statusMessage.textContent = 'Enviando imagen y registrando transacción...';
        statusMessage.className = 'text-center p-3 rounded-lg font-semibold bg-indigo-100 text-primary-dark block';
    }
}