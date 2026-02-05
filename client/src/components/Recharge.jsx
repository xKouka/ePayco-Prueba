
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Recharge() {
    const [formData, setFormData] = useState({ document: '', phone: '', amount: '' });
    const [status, setStatus] = useState(null);

    const handleNumberInput = (field, value) => {
        // Solo permitir números
        const numericValue = value.replace(/\D/g, '');
        setFormData({ ...formData, [field]: numericValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Procesando...' });
        try {
            const res = await axios.post(`${API_URL}/recargarBilletera`, {
                ...formData,
                amount: Number(formData.amount)
            });

            console.log('Respuesta Servidor (Éxito):');
            console.log('Código de estado HTTP:', res.status);
            console.log('Mensaje:', res.data.message);

            setStatus({ type: 'success', msg: `¡Recarga Exitosa! Nuevo Saldo: $${res.data.data.balance}` });
            // Limpiar formulario después del éxito
            setFormData({ document: '', phone: '', amount: '' });
        } catch (err) {
            const status = err.response?.status || 500;
            const message = err.response?.data?.message;
            const errorMsg = Array.isArray(message) ? message[0] : message || 'Error al recargar';

            console.log('Respuesta Servidor (Fallo):');
            console.log('Código de estado HTTP:', status);
            console.log('Motivo del fallo:', errorMsg);

            setStatus({ type: 'error', msg: errorMsg });
        }
    };

    return (
        <div className="card fade-in">
            <h2>Recargar Billetera</h2>
            <form onSubmit={handleSubmit}>
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
                        placeholder="Ej: 50000"
                    />
                </div>
                <button className="btn" type="submit">Recargar</button>
            </form>
            {status && <div className={`alert alert-${status.type === 'error' ? 'error' : 'success'}`}>{status.msg}</div>}
        </div>
    );
}
