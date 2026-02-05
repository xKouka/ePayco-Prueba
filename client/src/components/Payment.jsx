
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Payment() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ document: '', phone: '', amount: '' });
    const [session, setSession] = useState({ sessionId: '', token: '' });
    const [status, setStatus] = useState(null);

    const handleNumberInput = (field, value) => {
        // Solo permitir números
        const numericValue = value.replace(/\D/g, '');
        setFormData({ ...formData, [field]: numericValue });
    };

    const handleTokenInput = (value) => {
        // Solo permitir números en el token
        const numericValue = value.replace(/\D/g, '');
        setSession({ ...session, token: numericValue });
    };

    const handleRequest = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Solicitando Pago...' });
        try {
            const res = await axios.post(`${API_URL}/solicitarPago`, {
                ...formData,
                amount: Number(formData.amount)
            });

            console.log('Solicitud de Pago (Éxito):');
            console.log('Código de estado HTTP:', res.status);
            console.log('Mensaje:', res.data.message);

            setSession({ ...session, sessionId: res.data.data.sessionId });
            setStep(2);
            setStatus({ type: 'success', msg: '¡Token enviado al email! Revisa la consola del servidor (simulación).' });
        } catch (err) {
            const status = err.response?.status || 500;
            const message = err.response?.data?.message;
            const errorMsg = Array.isArray(message) ? message[0] : message || 'Error al solicitar pago';

            console.log('Solicitud de Pago (Fallo):');
            console.log('Código de estado HTTP:', status);
            console.log('Motivo del fallo:', errorMsg);

            setStatus({ type: 'error', msg: errorMsg });
        }
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Confirmando...' });
        try {
            const res = await axios.post(`${API_URL}/confirmarPago`, {
                sessionId: session.sessionId,
                token: session.token
            });

            console.log('Confirmación de Pago (Éxito):');
            console.log('Código de estado HTTP:', res.status);
            console.log('Mensaje:', res.data.message);

            setStatus({ type: 'success', msg: `¡Pago Confirmado! Nuevo Saldo: $${res.data.data.newBalance}` });
            // Reset
            setFormData({ document: '', phone: '', amount: '' });
            setSession({ sessionId: '', token: '' });
            setStep(1);
        } catch (err) {
            const status = err.response?.status || 500;
            const message = err.response?.data?.message;
            const errorMsg = Array.isArray(message) ? message[0] : message || 'Token o Sesión inválidos';

            console.log('Confirmación de Pago (Fallo):');
            console.log('Código de estado HTTP:', status);
            console.log('Motivo del fallo:', errorMsg);

            setStatus({ type: 'error', msg: errorMsg });
        }
    };

    return (
        <div className="card fade-in">
            <h2>{step === 1 ? 'Realizar Pago' : 'Confirmar Pago'}</h2>
            {step === 1 ? (
                <form onSubmit={handleRequest}>
                    <div className="input-group">
                        <label>Documento de Identidad</label>
                        <input
                            required
                            type="text"
                            value={formData.document}
                            onChange={e => handleNumberInput('document', e.target.value)}
                            pattern="\d{6,15}"
                            title="El documento debe contener entre 6 y 15 dígitos"
                            maxLength="15"
                            placeholder="Ej: 1234567890"
                        />
                    </div>
                    <div className="input-group">
                        <label>Celular</label>
                        <input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={e => handleNumberInput('phone', e.target.value)}
                            pattern="\d{10}"
                            title="El teléfono debe contener exactamente 10 dígitos"
                            maxLength="10"
                            placeholder="Ej: 3001234567"
                        />
                    </div>
                    <div className="input-group">
                        <label>Monto</label>
                        <input
                            required
                            type="number"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            min="1"
                            step="0.01"
                            placeholder="Ej: 20000"
                        />
                    </div>
                    <button className="btn" type="submit">Solicitar Token</button>
                </form>
            ) : (
                <form onSubmit={handleConfirm}>
                    <p style={{ marginBottom: '1rem', color: '#94a3b8' }}>ID Sesión: {session.sessionId}</p>
                    <div className="input-group">
                        <label>Ingresa Token de 6 dígitos</label>
                        <input
                            required
                            type="text"
                            maxLength="6"
                            value={session.token}
                            onChange={e => handleTokenInput(e.target.value)}
                            pattern="\d{6}"
                            title="El token debe contener exactamente 6 dígitos"
                            placeholder="Ej: 123456"
                        />
                    </div>
                    <button className="btn" type="submit">Confirmar Pago</button>
                    <button type="button" className="btn" style={{ marginTop: '1rem', background: '#334155' }} onClick={() => setStep(1)}>Cancelar</button>
                </form>
            )}
            {status && <div className={`alert alert-${status.type === 'error' ? 'error' : 'success'}`}>{status.msg}</div>}
        </div>
    );
}
