// Elementos del DOM
const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.getElementById('fileName');
const shareBtn = document.getElementById('shareBtn');
const mensajeTxt = document.getElementById('mensaje');
const successAnim = document.querySelector('.success-animation');
const uploadLabel = document.getElementById('uploadLabel');

// URL de tu Google App Script (¡Mantenla segura!)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvSCsiHn0e1nbhhqKMto3EIRtxFpaO-edwYNQs0vEjGC0xhlARarFy7h3chYnAg5NOTw/exec";

// 1. Escuchar cuando el usuario selecciona un archivo
fileInput.addEventListener('change', function() {
    if (this.files && this.files.length > 0) {
        // Mostrar el nombre del archivo cortado si es muy largo
        let name = this.files[0].name;
        if(name.length > 25) name = name.substring(0, 24) + "...";
        
        fileNameDisplay.textContent = `Seleccionado: ${name}`;
        // Habilitar el botón de compartir
        shareBtn.disabled = false;
        // Resetear mensajes anteriores
        resetMessages();
    } else {
        fileNameDisplay.textContent = "Ninguna foto seleccionada aún";
        shareBtn.disabled = true;
    }
});

function resetMessages() {
    mensajeTxt.innerText = "";
    mensajeTxt.style.color = "inherit";
    successAnim.classList.add('hidden');
}

// 2. Función principal de subida
function subirFoto() {
  if (!fileInput.files.length) {
    mensajeTxt.innerText = "Por favor selecciona una foto primero.";
    mensajeTxt.style.color = "red";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  // Estado de carga visual
  estadoCargando(true);

  reader.onload = function () {
    fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        filename: file.name,
        mimeType: file.type,
        data: reader.result
      })
    })
    .then(response => {
        // Estado de carga terminado
        estadoCargando(false);
        
        // Mostrar animación de éxito
        successAnim.classList.remove('hidden');
        mensajeTxt.innerText = "¡Foto compartida con éxito! ¡Gracias! 💕";
        mensajeTxt.style.color = "#28a745";

        // Limpiar el input para otra subida si se desea
        fileInput.value = "";
        fileNameDisplay.textContent = "Foto subida correctamente";
        shareBtn.disabled = true;

        // Opcional: Ocultar la animación después de unos segundos
        setTimeout(() => {
            successAnim.classList.add('hidden');
            mensajeTxt.style.color = "inherit";
        }, 5000);
    })
    .catch(error => {
        estadoCargando(false);
        console.error('Error:', error);
        mensajeTxt.innerText = "Hubo un error al subir la foto. Intenta de nuevo.";
        mensajeTxt.style.color = "red";
    });
  };

  reader.onerror = function() {
      estadoCargando(false);
      mensajeTxt.innerText = "Error al leer el archivo.";
      mensajeTxt.style.color = "red";
  };

  reader.readAsDataURL(file);
}

// Función auxiliar para cambiar el estado visual del botón durante la carga
function estadoCargando(isUploading) {
    if(isUploading) {
        shareBtn.disabled = true;
        shareBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo recuerdo...';
        resetMessages();
    } else {
        // Restaurar el botón original
        shareBtn.innerHTML = '<i class="fas fa-heart"></i> Compartir mi recuerdo';
        // Nota: No lo habilitamos aquí, se habilita solo si seleccionan otro archivo
    }
}