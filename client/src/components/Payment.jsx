
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Payment() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ document: '', phone: '', amount: '' });
    const [session, setSession] = useState({ sessionId: '', token: '' });
    const [status, setStatus] = useState(null);

    const handleRequest = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Solicitando Pago...' });
        try {
            const res = await axios.post(`${API_URL}/solicitarPago`, {
                ...formData,
                amount: Number(formData.amount)
            });
            setSession({ ...session, sessionId: res.data.data.sessionId });
            setStep(2);
            setStatus({ type: 'success', msg: '¡Token enviado al email! Revisa la consola del servidor (simulación).' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Error al solicitar pago' });
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
            setStatus({ type: 'success', msg: `¡Pago Confirmado! Nuevo Saldo: $${res.data.data.newBalance}` });
            setStep(1); // Reset or stay
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Token o Sesión inválidos' });
        }
    };

    return (
        <div className="card fade-in">
            <h2>{step === 1 ? 'Realizar Pago' : 'Confirmar Pago'}</h2>
            {step === 1 ? (
                <form onSubmit={handleRequest}>
                    <div className="input-group">
                        <label>Documento de Identidad</label>
                        <input required type="text" value={formData.document} onChange={e => setFormData({ ...formData, document: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>Celular</label>
                        <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>Monto</label>
                        <input required type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                    </div>
                    <button className="btn" type="submit">Solicitar Token</button>
                </form>
            ) : (
                <form onSubmit={handleConfirm}>
                    <p style={{ marginBottom: '1rem', color: '#94a3b8' }}>ID Sesión: {session.sessionId}</p>
                    <div className="input-group">
                        <label>Ingresa Token de 6 dígitos</label>
                        <input required type="text" maxLength="6" value={session.token} onChange={e => setSession({ ...session, token: e.target.value })} />
                    </div>
                    <button className="btn" type="submit">Confirmar Pago</button>
                    <button type="button" className="btn" style={{ marginTop: '1rem', background: '#334155' }} onClick={() => setStep(1)}>Cancelar</button>
                </form>
            )}
            {status && <div className={`alert alert-${status.type === 'error' ? 'error' : 'success'}`}>{status.msg}</div>}
        </div>
    );
}
