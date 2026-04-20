import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAssetById, toggleLikeAsset, buyAsset, downloadAsset } from '../lib/api';
import { useAuth } from '../context/AuthContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Asset = any;

const AssetDetailPage: React.FC = () => {
    const { id } = useParams();
    const { user, isAuthenticated, updateUser } = useAuth();
    const [asset, setAsset] = useState<Asset>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [buyingState, setBuyingState] = useState<'idle' | 'buying' | 'done'>('idle');
    const navigate = useNavigate();

    const assetId = asset?._id || asset?.id;
    const isLiked = isAuthenticated && user?.likedAssets?.includes(assetId);
    const isOwned = isAuthenticated && user?.purchasedAssets?.includes(assetId);

    const handleLike = async () => {
        if (!isAuthenticated) return navigate('/login');
        try {
            const updatedUser = await toggleLikeAsset(assetId);
            updateUser(updatedUser);
        } catch (err) {
            console.error('Failed to toggle like', err);
        }
    };

    const handleBuy = async () => {
        if (!isAuthenticated) return navigate('/login');
        if (isOwned) return;
        setBuyingState('buying');
        try {
            const updatedUser = await buyAsset(assetId);
            updateUser(updatedUser);
            setBuyingState('done');
        } catch (err) {
            console.error('Failed to buy asset', err);
            setBuyingState('idle');
        }
    };

    const handleDownload = async () => {
        if (!assetId) return;
        
        if (asset.fileUrl) {
            window.open(asset.fileUrl, '_blank');
            return;
        }

        setDownloading(true);
        try {
            const data = await downloadAsset(assetId);
            if (data.url) {
                window.open(data.url, '_blank');
            } else {
                // Fallback: open the Sketchfab model page
                window.open(`https://sketchfab.com/3d-models/${assetId}`, '_blank');
            }
        } catch {
            // Fallback: open the Sketchfab model page
            window.open(`https://sketchfab.com/3d-models/${assetId}`, '_blank');
        }
        setDownloading(false);
    };

    useEffect(() => {
        const loadAsset = async () => {
            try {
                const data = await fetchAssetById(id!);
                setAsset(data);
            } catch (err) {
                console.error(err);
                navigate('/');
            }
            setLoading(false);
        };
        loadAsset();
    }, [id, navigate]);

    if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Loading...</div>;
    if (!asset) return null;

    return (
        <div className="container animate-fade" style={{ paddingTop: '40px' }}>
            <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: '32px' }}>← Back</button>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px' }}>
                {/* Left: Preview */}
                <div>
                    <div className="glass" style={{ overflow: 'hidden', width: '100%', aspectRatio: '16/10', position: 'relative' }}>
                        {asset.previewModelId ? (
                            <iframe
                                title="Sketchfab"
                                src={`https://sketchfab.com/models/${asset.previewModelId}/embed`}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                allow="autoplay; fullscreen; vr"
                            />
                        ) : asset.thumbnailUrl ? (
                            <img src={asset.thumbnailUrl} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Preview</div>
                        )}
                    </div>
                </div>

                {/* Right: Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{asset.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                                {asset.price === 0 ? 'Free' : `$${asset.price}`}
                            </span>
                            <span className="glass" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Royalty Free</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        {isOwned ? (
                            <button
                                className="btn btn-primary"
                                onClick={handleDownload}
                                disabled={downloading}
                                style={{ flex: 1, padding: '16px', fontSize: '1.1rem' }}
                            >
                                {downloading ? 'Getting Link...' : '↓ Download'}
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={handleBuy}
                                disabled={buyingState === 'buying'}
                                style={{ flex: 1, padding: '16px', fontSize: '1.1rem' }}
                            >
                                {buyingState === 'buying' ? 'Processing...' : buyingState === 'done' ? '✓ Purchased!' : 'Buy Now'}
                            </button>
                        )}
                        <button
                            className="btn btn-ghost"
                            onClick={handleLike}
                            style={{ padding: '16px', fontSize: '1.2rem', color: isLiked ? '#ef4444' : 'var(--text-secondary)', transition: 'all 0.2s ease' }}
                        >
                            {isLiked ? '♥' : '♡'}
                        </button>
                    </div>

                    {/* Show "View on Sketchfab" link for all users */}
                    <a
                        href={`https://sketchfab.com/3d-models/${assetId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                        style={{ textAlign: 'center', textDecoration: 'none' }}
                    >
                        View on Sketchfab ↗
                    </a>

                    <div className="glass" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Description</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            {asset.description || "No description provided for this high-quality 3D asset."}
                        </p>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${asset.author || 'creator'}`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="Creator" />
                        <div>
                            <p style={{ fontWeight: '600' }}>{asset.author || "Unknown Creator"}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sketchfab Artist</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetDetailPage;
