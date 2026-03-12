import React from 'react';

interface TutorialOverlayProps {
    onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-in-out'
        }}>
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
            <div style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '16px',
                maxWidth: '500px',
                textAlign: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                fontFamily: "'Outfit', sans-serif",
                animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
            }}>
                {/* Glow behind the icon to make it a "spotlight" focus */}
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: -1
                }}></div>

                <div style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1 }}>💡</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem 0' }}>
                    Quick Tips to Get Started
                </h2>
                <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem' }}>
                    Welcome to TaskMate! Here is a quick guide to managing your entire life in one place:
                </p>

                <div style={{ textAlign: 'left', color: '#334155', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.25rem 0.75rem', borderRadius: '8px', fontWeight: 'bold' }}>1</span>
                        <div><strong>Add Tasks:</strong> Head to your Inbox or Custom Pages to capture anything on your mind.</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.25rem 0.75rem', borderRadius: '8px', fontWeight: 'bold' }}>2</span>
                        <div><strong>Organize Your Life:</strong> Use the Sidebar to switch seamlessly between Work, Personal, and Academic tasks.</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.25rem 0.75rem', borderRadius: '8px', fontWeight: 'bold' }}>3</span>
                        <div><strong>Track Deadlines:</strong> Your Hybrid Calendar automatically syncs all due dates automatically!</div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: '#000',
                        color: 'white',
                        border: 'none',
                        padding: '0.85rem 2rem',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        width: '100%'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                >
                    Got it, let's go!
                </button>
            </div>
        </div>
    );
};

export default TutorialOverlay;
