
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Balance() {
    const [formData, setFormData] = useState({ document: '', phone: '' });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        try {
            const res = await axios.get(`${API_URL}/consultarSaldo`, { params: formData });
            setResult(res.data.data.balance);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching balance');
        }
    };

    return (
        <div className="card fade-in">
            <h2>Check Balance</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Document ID</label>
                    <input required type="text" value={formData.document} onChange={e => setFormData({ ...formData, document: e.target.value })} />
                </div>
                <div className="input-group">
                    <label>Phone</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <button className="btn" type="submit">Check Balance</button>
            </form>

            {result !== null && (
                <div className="alert alert-success" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Balance: ${result}
                </div>
            )}
            {error && <div className="alert alert-error">{error}</div>}
        </div>
    );
}
