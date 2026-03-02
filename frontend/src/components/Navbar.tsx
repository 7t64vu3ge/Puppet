import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="glass" style={{ margin: '16px', padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '16px', zIndex: 100 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>P</div>
                <h1 style={{ fontSize: '1.25rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Puppet</h1>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <Link to="/" className="btn btn-ghost" style={{ border: 'none' }}>Explore</Link>
                {user?.role === 'seller' && <button className="btn btn-ghost" style={{ border: 'none' }}>Sell</button>}

                {isAuthenticated ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={user?.avatar} alt={user?.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-subtle)' }} />
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user?.name}</span>
                        </div>
                        <button onClick={logout} className="btn btn-ghost">Logout</button>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary">Sign In</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
