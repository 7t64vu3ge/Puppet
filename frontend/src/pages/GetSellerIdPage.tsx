import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const GetSellerIdPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [copied, setCopied] = useState(false);

    if (!isAuthenticated) {
        return (
            <div className="container animate-fade" style={{ paddingTop: '100px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '24px' }}>Authentication Required</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Please log in to retrieve your Seller ID.</p>
                <Link to="/login" className="btn btn-primary">Sign In</Link>
            </div>
        );
    }

    const handleCopy = () => {
        if (user?.id) {
            navigator.clipboard.writeText(user.id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="container animate-fade" style={{ paddingTop: '80px', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', textAlign: 'center' }}>Your Seller ID</h1>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px' }}>
                Use this unique Seller ID for developer API integrations and establishing your marketplace presence.
            </p>

            <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} alt="Avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--border-subtle)' }} />
                    <div>
                        <h2 style={{ fontSize: '1.2rem' }}>{user?.name}</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
                    </div>
                </div>

                <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Seller ID</label>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                        <code style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', wordBreak: 'break-all' }}>
                            {user?.id}
                        </code>
                        <button onClick={handleCopy} className={`btn ${copied ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '8px 16px', minWidth: '100px' }}>
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--accent-secondary)' }}>Information</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        Keep this ID handy if you want to publish assets through the API. Your current role is <strong>{user?.role}</strong>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GetSellerIdPage;
