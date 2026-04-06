import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../lib/api';

const SettingsPage: React.FC = () => {
    const { logout } = useAuth();
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
    });
    const [message, setMessage] = useState<string | null>(null);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('puppet_theme', newTheme);
    };

    const handleChangePassword = async () => {
        try {
            const res = await changePassword();
            setMessage(res.message);
        } catch (err) {
            console.error(err);
            setMessage("Error requesting password change.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '40px 20px' }}>
            <h1 style={{ marginBottom: '32px' }}>Settings</h1>

            <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Theme Setting */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Appearance</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ margin: 0 }}>Theme</p>
                            <small style={{ color: 'var(--text-secondary)' }}>Switch between light and dark mode</small>
                        </div>
                        <button onClick={toggleTheme} className="btn btn-ghost" style={{ padding: '8px 16px', textTransform: 'capitalize' }}>
                            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                        </button>
                    </div>
                </section>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />

                {/* Password Setting */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Security</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                        <div>
                            <p style={{ margin: 0 }}>Password</p>
                            <small style={{ color: 'var(--text-secondary)' }}>Currently logged in via Google OAuth</small>
                        </div>
                        <button onClick={handleChangePassword} className="btn btn-ghost" style={{ padding: '8px 16px' }}>
                            Update Password
                        </button>
                    </div>
                    {message && (
                        <div style={{ 
                            padding: '12px 16px', 
                            borderRadius: '8px', 
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            fontSize: '0.85rem',
                            color: 'var(--accent-primary)',
                            border: '1px solid var(--border-subtle)'
                        }}>
                            {message}
                        </div>
                    )}
                </section>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />

                {/* Account Actions */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ef4444' }}>Account Actions</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ margin: 0 }}>Logout</p>
                            <small style={{ color: 'var(--text-secondary)' }}>Sign out of your account on this device</small>
                        </div>
                        <button onClick={logout} className="btn btn-ghost" style={{ padding: '8px 16px', color: '#ef4444' }}>
                            Sign Out
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;
