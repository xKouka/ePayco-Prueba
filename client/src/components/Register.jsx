
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Register() {
    const [formData, setFormData] = useState({ document: '', names: '', email: '', phone: '' });
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Processing...' });
        try {
            const res = await axios.post(`${API_URL}/registerCliente`, formData);
            setStatus({ type: 'success', msg: `User registered! ID: ${res.data.data._id}` });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Error occurred' });
        }
    };

    return (
        <div className="card fade-in">
            <h2>Register Client</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Document ID</label>
                    <input required type="text" value={formData.document} onChange={e => setFormData({ ...formData, document: e.target.value })} />
                </div>
                <div className="input-group">
                    <label>Full Name</label>
                    <input required type="text" value={formData.names} onChange={e => setFormData({ ...formData, names: e.target.value })} />
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="input-group">
                    <label>Phone</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <button className="btn" type="submit">Register</button>
            </form>
            {status && <div className={`alert alert-${status.type === 'error' ? 'error' : 'success'}`}>{status.msg}</div>}
        </div>
    );
}
