
// -------------------------------------------------------------------------
// CONFIGURACIÓN DEL BACKEND
// -------------------------------------------------------------------------
// Puedes usar el servidor de NestJS (Puerto 3000) o Laravel (Puerto 8000).
// Ambas APIs son compatibles y siguen el mismo estándar de respuesta.

// -------------------------------------------------------------------------
// AUTO-DETECCIÓN DE BACKEND (NESTJS VS LARAVEL)
// -------------------------------------------------------------------------
// Este script detecta automáticamente qué servidor está encendido.
// Prioridad: NestJS (Puerto 3000) > Laravel (Puerto 8000)

const NEST_URL = 'http://localhost:3000/wallet';
const LARAVEL_URL = 'http://localhost:8000/api/wallet';

// Determinamos la URL activa. 
// NOTA: Para una detección 100% instantánea sin await, usamos la guardada en localStorage
// o probamos suerte con la de NestJS por defecto.
export const API_URL = localStorage.getItem('detected_backend') || NEST_URL;

// En segundo plano verificamos cuál está realmente prendido para la próxima interacción
const verifyBackends = async () => {
    try {
        const nest = await fetch(NEST_URL + '/consultarSaldo', { method: 'HEAD' }).then(r => r.ok).catch(() => false);
        if (nest) {
            if (localStorage.getItem('detected_backend') !== NEST_URL) {
                localStorage.setItem('detected_backend', NEST_URL);
                console.log("%c Backend Activo: NestJS (Puerto 3000)", "background: #e0234e; color: white; padding: 2px 5px; border-radius: 3px;");
            }
            return;
        }

        const laravel = await fetch(LARAVEL_URL + '/consultarSaldo', { method: 'HEAD' }).then(r => r.ok).catch(() => false);
        if (laravel) {
            if (localStorage.getItem('detected_backend') !== LARAVEL_URL) {
                localStorage.setItem('detected_backend', LARAVEL_URL);
                console.log("%c Backend Activo: Laravel (Puerto 8000)", "background: #ff2d20; color: white; padding: 2px 5px; border-radius: 3px;");
                // Forzamos recarga solo si el backend cambió respecto a lo guardado
                window.location.reload();
            }
        }
    } catch (e) { }
};

verifyBackends();
