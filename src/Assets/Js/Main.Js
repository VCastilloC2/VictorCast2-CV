/*==================== SHOW MENU ====================*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId);

    // Validate that variables exist
    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            // We add the show-menu class to the div tag with the nav__menu class
            nav.classList.toggle("show-menu");
        });
    }
};
showMenu("nav-toggle", "nav-menu");

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
    const navMenu = document.getElementById("nav-menu");
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute("id");

        const link = document.querySelector(
            ".nav__menu a[href*='" + sectionId + "']",
        );

        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add("active-link");
            } else {
                link.classList.remove("active-link");
            }
        }
    });
}

window.addEventListener("scroll", scrollActive);

/*==================== SHOW SCROLL TOP ====================*/
function scrollTop() {
    const scrollTop = document.getElementById("scroll-top");
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if (this.scrollY >= 200) scrollTop.classList.add("show-scroll");
    else scrollTop.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollTop);

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "bx-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
    themeButton.classList.contains(iconTheme) ? "bx-moon" : "bx-sun";

// We validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
        darkTheme,
    );
    themeButton.classList[selectedIcon === "bx-moon" ? "add" : "remove"](
        iconTheme,
    );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    // We save the theme and the current icon that the user chose
    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
});

/*==================== REDUCE THE SIZE AND PRINT ON AN A4 SHEET ====================*/
function scaleCv() {
    document.body.classList.add("scale-cv");
}

/*==================== REMOVE THE SIZE WHEN THE CV IS DOWNLOADED ====================*/
function removeScaleCv() {
    document.body.classList.remove("scale-cv");
}

/*==================== ANIMATION ====================*/

/*==================== PDF CONFIG VARIABLES ====================*/
// Lee todas las variables desde window.ENV (archivo env.js en la raiz).
// Si env.js no carga, usa valores por defecto para no romper la app.
const E = window.ENV || {};

const CV_CONFIG = {

    /*---------- Datos personales ----------*/
    nombre:    E.NOMBRE    || '',
    cargo:     E.CARGO     || '',
    ubicacion: E.UBICACION || '',
    email:     E.EMAIL     || '',
    telefono:  E.TELEFONO  || '',

    /*---------- Redes sociales ----------*/
    linkedin:  E.LINKEDIN  || '#',
    github:    E.GITHUB    || '#',
    youtube:   E.YOUTUBE   || '#',
    facebook:  E.FACEBOOK  || '#',

    /*---------- URL del portafolio / QR ----------*/
    portfolioUrl: E.PORTFOLIO_URL || '',

    /*---------- Referencias ----------*/
    referencias: E.REFERENCIAS || [],

    /*---------- Configuracion del PDF ----------*/
    pdf: {
        filename:    E.PDF_FILENAME    || 'Curriculum.pdf',
        margin:      E.PDF_MARGIN      || [0, 0, 0, 0],
        imageQuality:E.PDF_QUALITY     || 0.98,
        scale:       E.PDF_SCALE       || 2,
        pageFormat:  E.PDF_FORMAT      || 'letter',
        orientation: E.PDF_ORIENTATION || 'portrait',
    },
};

/*==================== GENERATE PDF ====================*/
const areaCv      = document.getElementById('area-cv');
const resumeButton = document.getElementById('resume-button');

const pdfOptions = {
    margin:      CV_CONFIG.pdf.margin,
    filename:    CV_CONFIG.pdf.filename,
    image:       { type: 'jpeg', quality: CV_CONFIG.pdf.imageQuality },
    html2canvas: {
        scale:           CV_CONFIG.pdf.scale,
        useCORS:         true,
        letterRendering: true,
        scrollX:         0,
        scrollY:         -window.scrollY,
        // Ancho fijo = ancho del .resume (816px) para que html2canvas
        // capture exactamente el layout de dos columnas
        windowWidth:     document.documentElement.scrollWidth,
    },
    jsPDF: {
        unit:        'mm',
        format:      CV_CONFIG.pdf.pageFormat,
        orientation: CV_CONFIG.pdf.orientation,
    },
};

function generateResume() {
    // Recalcular scrollY en el momento de generar
    pdfOptions.html2canvas.scrollY = -window.scrollY;
    html2pdf()
        .set(pdfOptions)
        .from(areaCv)
        .save()
        .then(removeScaleCv);
}

resumeButton.addEventListener('click', () => {
    scaleCv();
    // Pequeño delay para que el CSS de scale-cv se aplique antes del render
    setTimeout(generateResume, 300);
});

/*==================== INYECTAR DATOS DESDE window.ENV ====================*/
function injectCvData() {
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    // Datos personales
    set('cv-ubicacion', CV_CONFIG.ubicacion);
    set('cv-email',     CV_CONFIG.email);
    set('cv-telefono',  CV_CONFIG.telefono);

    // Referencias: genera las tarjetas desde ENV.REFERENCIAS
    const refContainer = document.getElementById('referencias-container');
    if (refContainer && CV_CONFIG.referencias.length) {
        refContainer.innerHTML = CV_CONFIG.referencias.map(ref => `
            <div class="references__content bd-grid">
                <span class="references__subtitle">${ref.cargo}</span>
                <h3 class="references__title">${ref.nombre}</h3>
                <ul class="references__contact">
                    <li>Phone: ${ref.telefono}</li>
                    <li>Email: ${ref.email}</li>
                </ul>
            </div>
        `).join('');
    }
}

/*==================== GENERAR QR DESDE CV_CONFIG ====================*/
// Usa la API de QuickChart para generar un QR escaneable como imagen PNG.
// Solo cambia CV_CONFIG.portfolioUrl para actualizar el QR.
function generateQR() {
    const container = document.getElementById('qr-canvas');
    const label     = document.getElementById('qr-label');
    if (!container) return;

    // SIEMPRE negro sobre blanco — los lectores de celular no soportan QR invertido
    const encoded = encodeURIComponent(CV_CONFIG.portfolioUrl);
    const apiUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}&bgcolor=ffffff&color=000000&margin=8&ecc=H`;

    const img         = document.createElement('img');
    img.src           = apiUrl;
    img.alt           = 'QR Portafolio';
    img.width         = 160;
    img.height        = 160;
    img.crossOrigin   = 'anonymous';
    img.style.cssText = 'display:block; border-radius:4px;';
    img.id            = 'qr-img';

    container.replaceWith(img);

    if (label) label.textContent = CV_CONFIG.portfolioUrl;
}

// Ejecutar directamente — los scripts estan al final del body
// por lo que el DOM ya esta listo cuando este codigo corre
injectCvData();
generateQR();