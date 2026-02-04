
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
        setStatus({ type: 'loading', msg: 'Requesting Payment...' });
        try {
            const res = await axios.post(`${API_URL}/solicitarPago`, {
                ...formData,
                amount: Number(formData.amount)
            });
            setSession({ ...session, sessionId: res.data.data.sessionId });
            setStep(2);
            setStatus({ type: 'success', msg: 'Token sent to email! Check server console for simulation.' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Error requesting payment' });
        }
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Confirming...' });
        try {
            const res = await axios.post(`${API_URL}/confirmarPago`, {
                sessionId: session.sessionId,
                token: session.token
            });
            setStatus({ type: 'success', msg: `Payment Confirmed! New Balance: $${res.data.data.newBalance}` });
            setStep(1); // Reset or stay
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Invalid Token or Session' });
        }
    };

    return (
        <div className="card fade-in">
            <h2>{step === 1 ? 'Make a Payment' : 'Confirm Payment'}</h2>
            {step === 1 ? (
                <form onSubmit={handleRequest}>
                    <div className="input-group">
                        <label>Document ID</label>
                        <input required type="text" value={formData.document} onChange={e => setFormData({ ...formData, document: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>Phone</label>
                        <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>Amount</label>
                        <input required type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                    </div>
                    <button className="btn" type="submit">Request Token</button>
                </form>
            ) : (
                <form onSubmit={handleConfirm}>
                    <p style={{ marginBottom: '1rem', color: '#94a3b8' }}>Session ID: {session.sessionId}</p>
                    <div className="input-group">
                        <label>Enter 6-digit Token</label>
                        <input required type="text" maxLength="6" value={session.token} onChange={e => setSession({ ...session, token: e.target.value })} />
                    </div>
                    <button className="btn" type="submit">Confirm Payment</button>
                    <button type="button" className="btn" style={{ marginTop: '1rem', background: '#334155' }} onClick={() => setStep(1)}>Cancel</button>
                </form>
            )}
            {status && <div className={`alert alert-${status.type === 'error' ? 'error' : 'success'}`}>{status.msg}</div>}
        </div>
    );
}
