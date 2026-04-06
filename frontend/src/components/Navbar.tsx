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
                {isAuthenticated && <Link to="/seller-id" className="btn btn-ghost" style={{ border: 'none' }}>Get Seller ID</Link>}
                
                {/* Dynamic Sell Link */}
                <Link to="/sell" className="btn btn-ghost" style={{ border: 'none' }}>
                    {user?.role === 'buyer' ? 'Become a Seller' : 'Sell Asset'}
                </Link>

                {isAuthenticated ? (
                    <div style={{ position: 'relative' }}>
                        <div 
                            onClick={() => (document.getElementById('profile-dropdown') as HTMLElement).classList.toggle('active')}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'background 0.2s' }}
                            className="btn-ghost"
                        >
                            <img src={user?.avatar} alt={user?.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-subtle)' }} />
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user?.name}</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>▼</span>
                        </div>
                        
                        <div 
                            id="profile-dropdown"
                            className="glass dropdown-menu" 
                            style={{ 
                                position: 'absolute', 
                                top: 'calc(100% + 8px)', 
                                right: 0, 
                                minWidth: '180px', 
                                background: 'rgba(15, 23, 42, 0.95)',
                                backdropFilter: 'blur(16px)',
                                borderRadius: '12px',
                                border: '1px solid var(--border-subtle)',
                                padding: '8px',
                                display: 'none',
                                flexDirection: 'column',
                                gap: '4px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            <Link to="/profile" className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '10px 12px', fontSize: '0.9rem' }} onClick={() => (document.getElementById('profile-dropdown') as HTMLElement).classList.remove('active')}>
                                👤 Profile
                            </Link>
                            <Link to="/settings" className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '10px 12px', fontSize: '0.9rem' }} onClick={() => (document.getElementById('profile-dropdown') as HTMLElement).classList.remove('active')}>
                                ⚙️ Settings
                            </Link>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
                            <button onClick={() => { logout(); (document.getElementById('profile-dropdown') as HTMLElement).classList.remove('active'); }} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '10px 12px', fontSize: '0.9rem', color: '#ef4444' }}>
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary">Sign In</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
