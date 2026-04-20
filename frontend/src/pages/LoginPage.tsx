import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleGoogleLogin = () => {
        window.location.href = '/auth/google';
    };

    return (
        <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass animate-fade" style={{ padding: '48px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Welcome Back</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Sign in to Puppet to explore and manage your 3D assets.</p>

                <button onClick={handleGoogleLogin} className="btn-primary btn" style={{ width: '100%', padding: '16px', justifyContent: 'center' }}>
                    Sign in with Google
                </button>

                <p style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
