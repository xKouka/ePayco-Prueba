const NEST_URL = 'http://localhost:3000/wallet';
const LARAVEL_URL = 'http://localhost:8000/api/wallet';

// URL activa basada en detección previa
export const API_URL = localStorage.getItem('detected_backend') || NEST_URL;

// Verifica disponibilidad de backends y prioriza NestJS
const verifyBackends = async () => {
    try {
        const nest = await fetch(NEST_URL + '/consultarSaldo', { method: 'HEAD' }).then(r => r.ok).catch(() => false);
        if (nest) {
            if (localStorage.getItem('detected_backend') !== NEST_URL) {
                localStorage.setItem('detected_backend', NEST_URL);
                console.log("Backend Activo: NestJS");
            }
            return;
        }

        const laravel = await fetch(LARAVEL_URL + '/consultarSaldo', { method: 'HEAD' }).then(r => r.ok).catch(() => false);
        if (laravel) {
            if (localStorage.getItem('detected_backend') !== LARAVEL_URL) {
                localStorage.setItem('detected_backend', LARAVEL_URL);
                console.log("Backend Activo: Laravel");
                window.location.reload();
            }
        }
    } catch (e) { }
};

verifyBackends();
