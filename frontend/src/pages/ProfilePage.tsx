import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../lib/api';

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const updatedUser = await updateProfile({ name, avatar });
            updateUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '40px 20px' }}>
            <h1 style={{ marginBottom: '32px' }}>Edit Profile</h1>
            
            <form className="glass" onSubmit={handleSubmit} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {message && (
                    <div style={{ 
                        padding: '12px 16px', 
                        borderRadius: '8px', 
                        backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: message.type === 'success' ? '#22c55e' : '#ef4444',
                        border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Display Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="btn btn-ghost"
                        style={{ textAlign: 'left', cursor: 'text' }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Profile Picture URL</label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <img 
                            src={avatar} 
                            alt="Preview" 
                            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} 
                            onError={(e) => (e.currentTarget.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')}
                        />
                        <input 
                            type="text" 
                            value={avatar} 
                            onChange={(e) => setAvatar(e.target.value)}
                            className="btn btn-ghost"
                            style={{ flex: 1, textAlign: 'left', cursor: 'text' }}
                            placeholder="Enter image URL"
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
                    <input 
                        type="email" 
                        value={user?.email} 
                        className="btn btn-ghost"
                        style={{ textAlign: 'left', opacity: 0.6, cursor: 'not-allowed' }}
                        disabled
                    />
                    <small style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email cannot be changed as it is linked to your Google account.</small>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                    style={{ marginTop: '8px' }}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
