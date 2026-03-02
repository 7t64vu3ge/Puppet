import React from 'react';
import { Link } from 'react-router-dom';

interface AssetCardProps {
    asset: {
        _id: string;
        title: string;
        price: number;
        thumbnailUrl?: string;
    };
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
    return (
        <Link to={`/assets/${asset._id}`} className="glass animate-fade" style={{ textDecoration: 'none', color: 'inherit', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'var(--transition-smooth)' }}>
            <div style={{ width: '100%', aspectRatio: '16/10', background: 'rgba(0,0,0,0.2)', position: 'relative' }}>
                {asset.thumbnailUrl ? (
                    <img src={asset.thumbnailUrl} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>No Preview</div>
                )}
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', backdropFilter: 'blur(4px)', border: '1px solid var(--border-subtle)' }}>
                    ${asset.price}
                </div>
            </div>
            <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{asset.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Full Commercial License</p>
            </div>

            <style>{`
        .glass:hover {
          transform: translateY(-8px);
          border-color: var(--accent-primary);
          box-shadow: 0 12px 30px rgba(0,0,0,0.4);
        }
      `}</style>
        </Link>
    );
};

export default AssetCard;
