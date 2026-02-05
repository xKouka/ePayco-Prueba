
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Register() {
    const [formData, setFormData] = useState({ document: '', names: '', email: '', phone: '' });
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Procesando...' });
        try {
            const res = await axios.post(`${API_URL}/registroCliente`, formData);
            setStatus({ type: 'success', msg: `¡Cliente registrado! ID: ${res.data.data._id}` });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Error ocurrido' });
        }
    };

    return (
        <div className="card fade-in">
            <h2>Registrar Cliente</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Documento de Identidad</label>
                    <input required type="text" value={formData.document} onChange={e => setFormData({ ...formData, document: e.target.value })} />
                </div>
                <div className="input-group">
                    <label>Nombres Completos</label>
                    <input required type="text" value={formData.names} onChange={e => setFormData({ ...formData, names: e.target.value })} />
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="input-group">
                    <label>Celular</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <button className="btn" type="submit">Registrar</button>
            </form>
            {status && <div className={`alert alert-${status.type === 'error' ? 'error' : 'success'}`}>{status.msg}</div>}
        </div>
    );
}
