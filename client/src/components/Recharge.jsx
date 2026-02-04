
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Recharge() {
    const [formData, setFormData] = useState({ document: '', phone: '', amount: '' });
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Procesando...' });
        try {
            const res = await axios.post(`${API_URL}/recargarBilletera`, {
                ...formData,
                amount: Number(formData.amount)
            });
            setStatus({ type: 'success', msg: `¡Recarga Exitosa! Nuevo Saldo: $${res.data.data.balance}` });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Error ocurrido' });
        }
    };

    return (
        <div className="card fade-in">
            <h2>Recargar Billetera</h2>
            <form onSubmit={handleSubmit}>
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
                <button className="btn" type="submit">Recargar</button>
            </form>
            {status && <div className={`alert alert-${status.type === 'error' ? 'error' : 'success'}`}>{status.msg}</div>}
        </div>
    );
}
