import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAssets } from '../lib/api';
import AssetCard from '../components/AssetCard';

const HomePage: React.FC = () => {
    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const loadAssets = async (queryValue?: string, catValue?: string) => {
        setLoading(true);
        setError(null);
        try {
            const finalQuery = [queryValue, catValue].filter(Boolean).join(' ').trim();
            const data = await fetchAssets({ q: finalQuery });
            
            // Merge custom local assets and external Sketchfab results
            const localAssets = data.local || [];
            const externalAssets = data.external || [];
            
            setAssets([...localAssets, ...externalAssets]);
        } catch (err: any) {
            console.error('Failed to load assets', err);
            setError(err.response?.data?.error || 'Failed to communicate with the server.');
            setAssets([]);
        }
        setLoading(false);
    };

    // Handle OAuth callback parameters on the home page
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userStr = params.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                login(token, user);

                // Clean up URL so query params don't stay visible
                navigate('/', { replace: true });
            } catch (err) {
                console.error('Failed to parse login payload', err);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    // Load assets on initial mount (and when manually searching)
    useEffect(() => {
        loadAssets(search, category);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container" style={{ paddingTop: '80px' }}>
            {/* Hero Section */}
            <header className="animate-fade" style={{ textAlign: 'center', marginBottom: '80px' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '24px', background: 'linear-gradient(135deg, #fff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Craft Your Digital World
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px' }}>
                    High-quality 3D assets for developers, artists, and creators. Production-ready for Blender, Unity, and Unreal.
                </p>

                <div className="glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '8px', display: 'flex', gap: '12px' }}>
                    <input
                        type="text"
                        placeholder="Search assets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadAssets(search, category)}
                        style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '0 16px', outline: 'none', fontSize: '1rem' }}
                    />
                    <button className="btn btn-primary" onClick={() => loadAssets(search, category)}>Search</button>
                </div>
            </header>

            {/* Assets Grid */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Trending Assets</h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className={`btn ${category === '' ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                            onClick={() => {
                                setCategory('');
                                loadAssets(search, '');
                            }}
                        >
                            All
                        </button>
                        {['Characters', 'Props', 'Environments'].map((cat) => (
                            <button 
                                key={cat}
                                className={`btn ${category === cat ? 'btn-primary' : 'btn-ghost'}`} 
                                style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                                onClick={() => {
                                    setCategory(cat);
                                    loadAssets(search, cat);
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>Loading assets...</div>
                ) : error ? (
                    <div className="glass" style={{ textAlign: 'center', padding: '80px', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                        <p style={{ color: '#fca5a5', marginBottom: '16px' }}>{error}</p>
                        <button className="btn btn-ghost" onClick={() => loadAssets(search, category)}>Try Again</button>
                    </div>
                ) : assets.length > 0 ? (
                    <div className="asset-grid">
                        {assets.map((asset) => (
                            <AssetCard key={asset._id} asset={asset} />
                        ))}
                    </div>
                ) : (
                    <div className="glass" style={{ textAlign: 'center', padding: '100px', borderStyle: 'dashed' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No assets found matching your criteria.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;
