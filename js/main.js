// Etapa 4 — JavaScript de Nefatlantis
// Funcionalidades: cambio de tema (claro / oscuro) y validacion del formulario de contacto

/**
 * Inicializa el boton de cambio entre modo oscuro (por defecto) y modo claro,
 * guardando la preferencia del usuario en localStorage.
 */
function inicializarModoTema() {
    const botonModo = document.getElementById("btn-modo");
    if (!botonModo) return;

    const CLAVE_TEMA = "nefatlantis-tema";

    function aplicarTema(esClaro) {
        document.body.classList.toggle("modo-claro", esClaro);
        botonModo.textContent = esClaro ? "🌙" : "☀";
        botonModo.setAttribute("aria-pressed", String(esClaro));
        botonModo.setAttribute("aria-label", esClaro ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
        botonModo.setAttribute("title", esClaro ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
    }

    // Recuperar preferencia guardada al cargar la pagina
    try {
        const temaGuardado = localStorage.getItem(CLAVE_TEMA);
        aplicarTema(temaGuardado === "claro");
    } catch {
        aplicarTema(false);
    }

    // Alternar tema y guardar eleccion al hacer clic
    botonModo.addEventListener("click", () => {
        const pasaAClaro = !document.body.classList.contains("modo-claro");
        aplicarTema(pasaAClaro);

        try {
            localStorage.setItem(CLAVE_TEMA, pasaAClaro ? "claro" : "oscuro");
        } catch {
            // Ignorar si el navegador bloquea el acceso a localStorage
        }
    });
}

/**
 * Inicializa la validacion interactiva del formulario de contacto.
 * Verifica campos obligatorios y formato de email antes de confirmar el envio.
 */
function inicializarFormularioContacto() {
    const formulario = document.getElementById("form-contacto");
    if (!formulario) return;

    const inputNombre = document.getElementById("nombre");
    const inputEmail = document.getElementById("email");
    const inputMensaje = document.getElementById("mensaje");

    const errorNombre = document.getElementById("error-nombre");
    const errorEmail = document.getElementById("error-email");
    const errorMensaje = document.getElementById("error-mensaje");
    const estadoFormulario = document.getElementById("estado-formulario");
    const botonReset = formulario.querySelector('button[type="reset"]');

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function mostrarError(campo, contenedorError, mensaje) {
        campo.classList.add("campo-invalido");
        campo.setAttribute("aria-invalid", "true");
        if (contenedorError) {
            contenedorError.textContent = mensaje;
        }
    }

    function limpiarError(campo, contenedorError) {
        campo.classList.remove("campo-invalido");
        campo.removeAttribute("aria-invalid");
        if (contenedorError) {
            contenedorError.textContent = "";
        }
    }

    function limpiarEstadoGeneral() {
        if (!estadoFormulario) return;
        estadoFormulario.textContent = "";
        estadoFormulario.classList.remove("estado-error", "estado-exito");
    }

    // Limpiar el error del campo apenas el usuario corrige su entrada
    const camposConError = [
        [inputNombre, errorNombre],
        [inputEmail, errorEmail],
        [inputMensaje, errorMensaje]
    ];

    camposConError.forEach(([campo, contenedorError]) => {
        if (!campo) return;
        campo.addEventListener("input", () => {
            if (campo.classList.contains("campo-invalido")) {
                limpiarError(campo, contenedorError);
            }
        });
    });

    // Limpiar mensajes cuando el usuario pulsa "Limpiar Pergamino"
    if (botonReset) {
        botonReset.addEventListener("click", () => {
            camposConError.forEach(([campo, contenedorError]) => {
                if (campo) limpiarError(campo, contenedorError);
            });
            limpiarEstadoGeneral();
        });
    }

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        limpiarEstadoGeneral();

        let primerCampoInvalido = null;

        const valorNombre = inputNombre ? inputNombre.value.trim() : "";
        const valorEmail = inputEmail ? inputEmail.value.trim() : "";
        const valorMensaje = inputMensaje ? inputMensaje.value.trim() : "";

        // Validacion de nombre
        if (!valorNombre) {
            mostrarError(inputNombre, errorNombre, "Ingresá tu nombre o alias de armas.");
            primerCampoInvalido = primerCampoInvalido || inputNombre;
        } else if (valorNombre.length < 3) {
            mostrarError(inputNombre, errorNombre, "El nombre debe tener al menos 3 caracteres.");
            primerCampoInvalido = primerCampoInvalido || inputNombre;
        } else {
            limpiarError(inputNombre, errorNombre);
        }

        // Validacion de correo
        if (!valorEmail) {
            mostrarError(inputEmail, errorEmail, "Ingresá un correo electrónico de contacto.");
            primerCampoInvalido = primerCampoInvalido || inputEmail;
        } else if (!regexEmail.test(valorEmail)) {
            mostrarError(inputEmail, errorEmail, "Ingresá un correo válido (ej: viajero@reino.org).");
            primerCampoInvalido = primerCampoInvalido || inputEmail;
        } else {
            limpiarError(inputEmail, errorEmail);
        }

        // Validacion de mensaje
        if (!valorMensaje) {
            mostrarError(inputMensaje, errorMensaje, "Detallá el motivo de tu visita o consulta.");
            primerCampoInvalido = primerCampoInvalido || inputMensaje;
        } else if (valorMensaje.length < 10) {
            mostrarError(inputMensaje, errorMensaje, "El mensaje debe tener al menos 10 caracteres.");
            primerCampoInvalido = primerCampoInvalido || inputMensaje;
        } else {
            limpiarError(inputMensaje, errorMensaje);
        }

        if (primerCampoInvalido) {
            if (estadoFormulario) {
                estadoFormulario.textContent = "Revisá los campos marcados antes de enviar tu solicitud.";
                estadoFormulario.classList.add("estado-error");
            }
            primerCampoInvalido.focus();
            return;
        }

        if (estadoFormulario) {
            estadoFormulario.textContent = `¡Solicitud enviada, ${valorNombre}! El Consejo de Ceniza responderá a ${valorEmail}.`;
            estadoFormulario.classList.add("estado-exito");
        }

        formulario.reset();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    inicializarModoTema();
    inicializarFormularioContacto();
});
