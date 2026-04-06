import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createAsset, becomeSeller } from '../lib/api';

const SellPage: React.FC = () => {
    const { user, updateUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('0');
    const [previewModelId, setPreviewModelId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    const handleBecomeSeller = async () => {
        setLoading(true);
        setError(null);
        try {
            const updatedUser = await becomeSeller();
            updateUser(updatedUser);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to upgrade account.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('previewModelId', previewModelId);
            if (file) {
                formData.append('file', file);
            }

            await createAsset(formData);
            navigate('/'); // Redirect to marketplace on success
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create asset.');
        } finally {
            setLoading(false);
        }
    };

    // If user is not joined as a seller yet
    if (user?.role === 'buyer') {
        return (
            <div className="container animate-fade" style={{ paddingTop: '100px', textAlign: 'center', maxWidth: '600px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Become a Seller</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
                    Join our creator community! Upgrading your account to Seller allows you to list 3D assets, set your own prices, and reach thousands of developers.
                </p>
                <div className="glass" style={{ padding: '40px' }}>
                    <ul style={{ textAlign: 'left', marginBottom: '32px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li>✅ List unlimited 3D assets</li>
                        <li>✅ Global reach to creators and developers</li>
                        <li>✅ Secure transactions and payouts</li>
                        <li>✅ 3D preview powered by Sketchfab</li>
                    </ul>
                    <button 
                        onClick={handleBecomeSeller} 
                        className="btn btn-primary" 
                        disabled={loading}
                        style={{ width: '100%', padding: '16px' }}
                    >
                        {loading ? 'Upgrading...' : 'Join as Seller'}
                    </button>
                    {error && <p style={{ color: '#ef4444', marginTop: '16px' }}>{error}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade" style={{ paddingTop: '80px', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Sell an Asset</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
                Fill out the details below to list your 3D model on the Puppet marketplace.
            </p>

            <form onSubmit={handleSubmit} className="glass" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {error && (
                    <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontWeight: 600 }}>Asset Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Low-poly Sci-fi Helmet" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="btn btn-ghost"
                        style={{ textAlign: 'left', cursor: 'text' }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontWeight: 600 }}>Description</label>
                    <textarea 
                        placeholder="Tell buyers about your asset (features, polycount, etc.)" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="btn btn-ghost"
                        style={{ textAlign: 'left', cursor: 'text', minHeight: '120px', resize: 'vertical', padding: '12px 16px' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 600 }}>Price (USD)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            min="0"
                            placeholder="0.00" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="btn btn-ghost"
                            style={{ textAlign: 'left', cursor: 'text' }}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 600 }}>Asset File (.glb, .zip, etc.)</label>
                        <input 
                            type="file" 
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="btn btn-ghost"
                            style={{ textAlign: 'left', cursor: 'pointer', padding: '10px 16px' }}
                            required
                        />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                            Upload the primary asset file for the buyer.
                        </small>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontWeight: 600 }}>Sketchfab Model UID (Preview)</label>
                    <input 
                        type="text" 
                        placeholder="e.g. 7abc123..." 
                        value={previewModelId}
                        onChange={(e) => setPreviewModelId(e.target.value)}
                        className="btn btn-ghost"
                        style={{ textAlign: 'left', cursor: 'text' }}
                        required
                    />
                    <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        The UID from the Sketchfab model URL for 3D preview.
                    </small>
                </div>

                <div style={{ marginTop: '16px', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                        By listing this asset, you confirm that you own the rights to this 3D model and it complies with our creator terms.
                    </p>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                    style={{ padding: '16px', fontSize: '1.1rem' }}
                >
                    {loading ? 'Publishing...' : 'List Asset for Sale'}
                </button>
            </form>
        </div>
    );
};

export default SellPage;
