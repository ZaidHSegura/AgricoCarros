function viewGreenhouse(name) {
    // Mostrar el contenedor de detalles
    document.querySelector('#mainContainer').style.display = 'none';
    document.querySelector('#details').style.display = 'block';

    // Actualizar el título de detalles
    var title = document.querySelector('#greenhouseTitle');
    title.textContent = 'Invernadero ' + name;

    // Guardar el nombre del invernadero actual para usarlo en el botón de volver
    document.querySelector('#details').dataset.greenhouse = name;

    // Actualizar los botones en función del invernadero seleccionado
    var optionsContainer = document.querySelector('#optionsContainer');
    optionsContainer.innerHTML = ''; // Limpiar el contenido anterior

    var buttons = [];
    if (name === '2OTE') {
        buttons = [
            { text: 'Eléctricos 1', onClick: 'showElectric("2OTE")' },
            { text: 'Hidráulicos 1', onClick: 'showHydraulic("2OTE")' },
            { text: 'Cargadores 1', onClick: 'showLoaders("2OTE")' }
        ];
    } else if (name === '2PTE') {
        buttons = [
            { text: 'Eléctricos 2', onClick: 'showElectric("2PTE")' },
            { text: 'Hidráulicos 2', onClick: 'showHydraulic("2PTE")' },
            { text: 'Cargadores 2', onClick: 'showLoaders("2PTE")' }
        ];
    } else if (name === '3PTE') {
        buttons = [
            { text: 'Eléctricos 3', onClick: 'showElectric("3PTE")' },
            { text: 'Hidráulicos 3', onClick: 'showHydraulic("3PTE")' },
            { text: 'Cargadores 3', onClick: 'showLoaders("3PTE")' }
        ];
    }

    buttons.forEach(button => {
        var btn = document.createElement('button');
        btn.className = 'greenhouse-button';
        btn.textContent = button.text;
        btn.setAttribute('onclick', button.onClick);
        optionsContainer.appendChild(btn);
    });
}

function showElectric(name) {
    // Ocultar todos los contenedores de detalles
    hideAllDetails();
    // Mostrar el contenedor de eléctricos específico
    document.querySelector('#electricContent' + name).style.display = 'block';
}

function showHydraulic(name) {
    // Ocultar todos los contenedores de detalles
    hideAllDetails();
    // Mostrar el contenedor de hidráulicos específico
    document.querySelector('#hydraulicContent' + name).style.display = 'block';
}

function showLoaders(name) {
    // Ocultar todos los contenedores de detalles
    hideAllDetails();
    // Mostrar el contenedor de cargadores específico
    document.querySelector('#loadersContent' + name).style.display = 'block';
}

function hideAllDetails() {
    document.querySelector('#details').style.display = 'none';
    var detailSections = document.querySelectorAll('.details');
    detailSections.forEach(function(section) {
        section.style.display = 'none';
    });
}

function goBackToDetails() {
    // Volver a la sección de detalles del invernadero correspondiente
    hideAllDetails();
    document.querySelector('#details').style.display = 'block';
}

function goBack() {
    // Volver al menú principal
    document.querySelector('#mainContainer').style.display = 'block';
    hideAllDetails();
}

function goBackToMain() {
    // Volver al menú principal desde cualquier submenú
    document.querySelector('#mainContainer').style.display = 'block';
    hideAllDetails();
}

function scanCode() {
    // Ocultar el contenedor principal y mostrar el contenido de escanear código
    document.querySelector('#mainContainer').style.display = 'none';
    document.querySelector('#scanCodeContent').style.display = 'block';

    // Inicializar el escáner de QR cuando se accede a la sección de escanear código
    let html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start(
        { facingMode: "environment" }, // Puede ser "user" para la cámara frontal
        {
            fps: 10, // Frecuencia de escaneo
            qrbox: { width: 300, height: 300 } // Dimensiones del área de escaneo
        },
        onScanSuccess,
        onScanFailure
    ).catch(err => {
        console.error(`No se pudo iniciar el escaneo: ${err}`);
    });
}

// Función para verificar si un elemento está en el centro de la vista del contenedor
function isElementInContainerView(element, container) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const elemTop = elementRect.top - containerRect.top;
    const elemBottom = elementRect.bottom - containerRect.top;

    const containerHeight = containerRect.height;

    // Verifica si el centro del elemento está dentro del contenedor
    const elemCenter = (elemTop + elemBottom) / 2;
    return elemCenter >= containerHeight / 3 && elemCenter <= (2 * containerHeight) / 3;
}

function goToImageById() {
    var imageId = document.getElementById('imageIdInput').value;
    var imageElement = document.getElementById(imageId);

    if (imageElement) {
        // Ocultar la sección de escanear código
        document.querySelector('#scanCodeContent').style.display = 'none';

        // Mostrar la sección correspondiente (en este caso, Eléctricos 2 OTE)
        document.querySelector('#electricContent2OTE').style.display = 'block';

       // Desplazarse a la imagen y centrarla verticalmente
       imageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Resaltar la imagen (opcional)
        imageElement.style.border = '2px solid green';
        setTimeout(() => {
            imageElement.style.border = '';
        }, 2000);
    } else {
        alert('ID de imagen no encontrado');
    }
}

// Función para aplicar el efecto de aumento de tamaño
function applyScrollEffect() {
    const sectionsContainer = document.querySelector('.sections-container');
    const sections = document.querySelectorAll('.section-box');
    sections.forEach(section => {
        if (isElementInContainerView(section, sectionsContainer)) {
            section.classList.add('in-view');
        } else {
            section.classList.remove('in-view');
        }
    });
}

// Escucha el evento de desplazamiento
const sectionsContainer = document.querySelector('.sections-container');
sectionsContainer.addEventListener('scroll', applyScrollEffect);

// Aplica el efecto inicialmente
applyScrollEffect();

function onScanSuccess(decodedText, decodedResult) {
    // Maneja el resultado aquí.
    console.log(`Código escaneado: ${decodedText}`);
    document.getElementById('qr-reader-results').innerText = `Resultado: ${decodedText}`;

    // Actualizar el contenido del cuadro de texto
    var imageIdInput = document.getElementById('imageIdInput');
    imageIdInput.value = decodedText;

    // Resaltar visualmente el área del escáner cuando detecta un código QR
    let qrReader = document.getElementById('qr-scan-area');
    qrReader.classList.add('scanning');

    // Quitar el resaltado después de un tiempo (opcional)
    setTimeout(() => {
        qrReader.classList.remove('scanning');
    }, 2000); // 2 segundos

    // Simular un clic en el botón "Ir" después de actualizar el campo de texto
    var goToImageButton = document.getElementById('goToImageButton');
    if (goToImageButton) {
        goToImageButton.click();
    } else {
        console.warn('No se encontró el botón "Ir".');
    }
}

function onScanFailure(error) {
    // Maneja la falla del escaneo, usualmente es mejor ignorarlo y seguir escaneando.
    console.warn(`Error de escaneo: ${error}`);
}

// Función para validar si el texto escaneado es una URL válida
function isValidUrl(text) {
    // Implementa lógica para verificar si el texto es una URL válida
    return text.startsWith("http://") || text.startsWith("https://");
}
