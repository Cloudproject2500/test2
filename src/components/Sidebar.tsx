import React, { useState } from 'react';
import type { LifePage } from '../types';

interface SidebarProps {
    currentView: string;
    onViewChange: (view: string) => void;
    lifePages: LifePage[];
    onAddLifePage: (name: string) => void;
    onDeleteLifePage: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    currentView,
    onViewChange,
    lifePages,
    onAddLifePage,
    onDeleteLifePage
}) => {
    const [isAddingPage, setIsAddingPage] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleAddPage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPageName.trim()) {
            onAddLifePage(newPageName.trim());
            setNewPageName('');
            setIsAddingPage(false);
        }
    };

    return (
        <aside className="sidebar" style={{
            width: isCollapsed ? '64px' : '240px',
            transition: 'width 0.3s ease',
            overflow: 'hidden'
        }}>
            {/* Top Section: Personal & Info */}
            <div className="sidebar-section">
                <div
                    className="nav-item flex-center"
                    style={{
                        cursor: 'pointer',
                        marginBottom: '1.5rem',
                        justifyContent: isCollapsed ? 'center' : 'space-between',
                        padding: isCollapsed ? '0.5rem' : '0.5rem 0.75rem'
                    }}
                >
                    {!isCollapsed && (
                        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-blue)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                            TaskMate
                        </span>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px',
                            marginLeft: isCollapsed ? 0 : 'auto'
                        }}
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? '»' : '«'}
                    </button>
                </div>

                {!isCollapsed && <div className="sidebar-section-title">Personal</div>}

                {lifePages.map(page => (
                    <div key={page.id} className="nav-item-container" style={{ position: 'relative' }}>
                        <a
                            href={`#${page.id}`}
                            className={`nav-item ${currentView === page.id ? 'active' : ''}`}
                            onClick={(e) => { e.preventDefault(); onViewChange(page.id); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                justifyContent: isCollapsed ? 'center' : 'flex-start'
                            }}
                            title={isCollapsed ? page.name : ''}
                        >
                            <span className="nav-icon" style={{ marginRight: isCollapsed ? 0 : '0.75rem' }}>{page.icon}</span>
                            {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{page.name}</span>}
                        </a>
                        {!isCollapsed && (
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
                        )}
                    </div>
                ))}

                {!isCollapsed && (
                    isAddingPage ? (
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
                            <span className="nav-icon" style={{ marginRight: '0.75rem' }}>+</span> Add a page
                        </button>
                    )
                )}
            </div>

            {/* Middle Section: Workspace */}
            <div className="sidebar-section">
                {!isCollapsed && <div className="sidebar-section-title">Workspace</div>}
                <a
                    href="#courses"
                    className={`nav-item ${currentView === 'courses' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('courses'); }}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    title={isCollapsed ? "Courses" : ''}
                >
                    <span className="nav-icon" style={{ marginRight: isCollapsed ? 0 : '0.75rem' }}>📚</span>
                    {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Courses</span>}
                </a>
                <a
                    href="#deadlines"
                    className={`nav-item ${currentView === 'deadlines' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('deadlines'); }}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    title={isCollapsed ? "Deadlines" : ''}
                >
                    <span className="nav-icon" style={{ marginRight: isCollapsed ? 0 : '0.75rem' }}>⏰</span>
                    {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Deadlines</span>}
                </a>
                <a
                    href="#simulation"
                    className={`nav-item ${currentView === 'simulation' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('simulation'); }}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    title={isCollapsed ? "Simulation" : ''}
                >
                    <span className="nav-icon" style={{ marginRight: isCollapsed ? 0 : '0.75rem' }}>🚀</span>
                    {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Simulation</span>}
                </a>
            </div>

            {/* Bottom Section: Global Nav */}
            <div className="sidebar-section" style={{ marginTop: 'auto' }}>
                {!isCollapsed && <div className="sidebar-section-title">Navigation</div>}
                <a
                    href="#dashboard"
                    className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('dashboard'); }}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    title={isCollapsed ? "Dashboard" : ''}
                >
                    <span className="nav-icon" style={{ marginRight: isCollapsed ? 0 : '0.75rem' }}>📊</span>
                    {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Dashboard</span>}
                </a>
                <a
                    href="#calendar"
                    className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('calendar'); }}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    title={isCollapsed ? "Calendar" : ''}
                >
                    <span className="nav-icon" style={{ marginRight: isCollapsed ? 0 : '0.75rem' }}>📅</span>
                    {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Calendar</span>}
                </a>
                <a
                    href="#inbox"
                    className={`nav-item ${currentView === 'inbox' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('inbox'); }}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    title={isCollapsed ? "Inbox" : ''}
                >
                    <span className="nav-icon" style={{ marginRight: isCollapsed ? 0 : '0.75rem' }}>📥</span>
                    {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Inbox</span>}
                    {!isCollapsed && <span className="badge-purple" style={{ marginLeft: 'auto', borderRadius: '10px', padding: '0 6px', fontSize: '10px' }}>3</span>}
                </a>
                <div
                    className="nav-item"
                    style={{
                        cursor: 'not-allowed',
                        opacity: 0.5,
                        justifyContent: isCollapsed ? 'center' : 'flex-start'
                    }}
                    title={isCollapsed ? "Settings" : ''}
                >
                    <span className="nav-icon" style={{ marginRight: isCollapsed ? 0 : '0.75rem' }}>⚙️</span>
                    {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Settings</span>}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
