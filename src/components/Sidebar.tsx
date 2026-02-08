import React, { useState } from 'react';
import type { LifePage } from '../types';

interface SidebarProps {
    roomId: string;
    onLeaveRoom: () => void;
    onJoinRoom: (roomId: string) => void;
    currentView: string;
    onViewChange: (view: string) => void;
    lifePages: LifePage[];
    onAddLifePage: (name: string) => void;
    onDeleteLifePage: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    roomId,
    onLeaveRoom,
    onJoinRoom,
    currentView,
    onViewChange,
    lifePages,
    onAddLifePage,
    onDeleteLifePage
}) => {
    const [inputRoomId, setInputRoomId] = useState('');
    const [isAddingPage, setIsAddingPage] = useState(false);
    const [newPageName, setNewPageName] = useState('');

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputRoomId.trim()) {
            onJoinRoom(inputRoomId.trim());
            setInputRoomId('');
        }
    };

    const handleAddPage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPageName.trim()) {
            onAddLifePage(newPageName.trim());
            setNewPageName('');
            setIsAddingPage(false);
        }
    };

    return (
        <aside className="sidebar">
            {/* Top Section: Personal & Info */}
            <div className="sidebar-section">
                <div className="nav-item" style={{ cursor: 'pointer', marginBottom: '1.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-blue)', letterSpacing: '-0.02em' }}>TaskMate</span>
                </div>

                <div className="sidebar-section-title">Personal</div>
                {lifePages.map(page => (
                    <div key={page.id} className="nav-item-container" style={{ position: 'relative' }}>
                        <a
                            href={`#${page.id}`}
                            className={`nav-item ${currentView === page.id ? 'active' : ''}`}
                            onClick={(e) => { e.preventDefault(); onViewChange(page.id); }}
                            style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                        >
                            <span className="nav-icon">{page.icon}</span> {page.name}
                        </a>
                        <button
                            className="delete-item-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteLifePage(page.id);
                            }}
                            title="Delete page"
                        >
                            🗑️
                        </button>
                    </div>
                ))}

                {isAddingPage ? (
                    <form onSubmit={handleAddPage} style={{ padding: '0 8px', marginTop: '8px' }}>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Page name..."
                            value={newPageName}
                            onChange={(e) => setNewPageName(e.target.value)}
                            onBlur={() => !newPageName && setIsAddingPage(false)}
                            style={{
                                width: '100%',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                outline: 'none'
                            }}
                        />
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAddingPage(true)}
                        className="nav-item add-page-btn"
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', opacity: 0.7 }}
                    >
                        <span className="nav-icon">+</span> Add a page
                    </button>
                )}
            </div>

            {/* Middle Section: Workspace */}
            <div className="sidebar-section">
                <div className="sidebar-section-title">Workspace</div>
                <a
                    href="#courses"
                    className={`nav-item ${currentView === 'courses' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('courses'); }}
                >
                    <span className="nav-icon">📚</span> Courses
                </a>
                <a
                    href="#deadlines"
                    className={`nav-item ${currentView === 'deadlines' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('deadlines'); }}
                >
                    <span className="nav-icon">⏰</span> Deadlines
                </a>
                <a
                    href="#simulation"
                    className={`nav-item ${currentView === 'simulation' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('simulation'); }}
                >
                    <span className="nav-icon">🚀</span> Simulation
                </a>
            </div>

            {/* Bottom Section: Global Nav */}
            <div className="sidebar-section" style={{ marginTop: 'auto' }}>
                <div className="sidebar-section-title">Navigation</div>
                <a
                    href="#dashboard"
                    className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('dashboard'); }}
                >
                    <span className="nav-icon">📊</span> Dashboard
                </a>
                <a
                    href="#calendar"
                    className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('calendar'); }}
                >
                    <span className="nav-icon">📅</span> Calendar
                </a>
                <a
                    href="#inbox"
                    className={`nav-item ${currentView === 'inbox' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('inbox'); }}
                >
                    <span className="nav-icon">📥</span> Inbox
                    <span className="badge-purple" style={{ marginLeft: 'auto', borderRadius: '10px', padding: '0 6px', fontSize: '10px' }}>3</span>
                </a>
                <div className="nav-item" style={{ cursor: 'not-allowed', opacity: 0.5 }}>
                    <span className="nav-icon">⚙️</span> Settings
                </div>
            </div>

            {/* Collaboration Section */}
            <div className="sidebar-section" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                {roomId ? (
                    <div className="workspace-block" style={{ padding: '8px' }}>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Shared Room</p>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-blue)' }}>{roomId}</p>
                        <button
                            onClick={onLeaveRoom}
                            style={{ background: 'none', border: 'none', color: 'var(--error)', fontSize: '11px', padding: 0, cursor: 'pointer', marginTop: '4px' }}
                        >
                            Leave
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleJoin} style={{ padding: '0 8px' }}>
                        <input
                            type="text"
                            placeholder="Join Room..."
                            className="workspace-block"
                            style={{ width: '100%', border: '1px solid var(--border-color)', outline: 'none', fontSize: '12px', marginBottom: '8px' }}
                            value={inputRoomId}
                            onChange={(e) => setInputRoomId(e.target.value)}
                        />
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '4px', fontSize: '11px' }}>Join</button>
                    </form>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
