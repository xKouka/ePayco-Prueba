
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Balance() {
    const [formData, setFormData] = useState({ document: '', phone: '' });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleNumberInput = (field, value) => {
        // Solo permitir números
        const numericValue = value.replace(/\D/g, '');
        setFormData({ ...formData, [field]: numericValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        try {
            const res = await axios.get(`${API_URL}/consultarSaldo`, { params: formData });

            console.log('Consulta de Saldo (Éxito):');
            console.log('Código de estado HTTP:', res.status);
            console.log('Mensaje:', res.data.message);

            setResult(res.data.data.balance);
        } catch (err) {
            const status = err.response?.status || 500;
            const message = err.response?.data?.message;
            const errorMsg = Array.isArray(message) ? message[0] : message || 'Error al consultar saldo';

            console.log('Consulta de Saldo (Fallo):');
            console.log('Código de estado HTTP:', status);
            console.log('Motivo del fallo:', errorMsg);

            setError(errorMsg);
        }
    };

    return (
        <div className="card fade-in">
            <h2>Consultar Saldo</h2>
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
                <button className="btn" type="submit">Consultar</button>
            </form>

            {result !== null && (
                <div className="alert alert-success" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Saldo: ${result}
                </div>
            )}
            {error && <div className="alert alert-error">{error}</div>}
        </div>
    );
}
