import React, { useState, useRef, useEffect } from 'react';
import type { LifePage } from '../types';

interface SidebarProps {
    currentView: string;
    onViewChange: (view: string) => void;
    lifePages: LifePage[];
    onAddLifePage: (name: string) => void;
    onDeleteLifePage: (id: string) => void;
    onRenameLifePage: (id: string, newName: string) => void;
    onChangeLifePageIcon: (id: string, newIcon: string) => void;
    personalColor: string;
    setPersonalColor: (color: string) => void;
    workspaceColor: string;
    setWorkspaceColor: (color: string) => void;
}

const EMOJI_OPTIONS = [
    // General
    '📄', '🏠', '💼', '🎓', '💪', '🎨', '🎮', '🎵', '📚', '🌍',
    '❤️', '⭐', '🔥', '🌈', '🧠', '💡', '📷', '🚀', '🎬', '💻',
    '📝', '🌸', '🐶', '🐱', '🎭', '🏆', '💎', '🌙', '📌', '🎁',
    '🌿', '🦋', '🔬', '🖌️',
    // Sports
    '🏀', '🏈', '⚽', '⚾', '🎾', '🏐', '🏉', '🥏', '🏓', '🏸',
    '🥊', '🥋', '⛳', '⛸️', '🎿', '🛷', '🏄', '🏊', '🤽', '🚣',
    '🧗', '🏇', '🤺', '🎳', '🏒', '🥍', '🤸', '🤾', '🏌️', '🥇',
    // Food & Drink
    '🍕', '🍔', '🌮', '🌯', '🍜', '🍣', '🍱', '🍝', '🥗', '🥩',
    '🍗', '🍖', '🥐', '🍞', '🧁', '🎂', '🍩', '🍪', '🍫', '🍦',
    '🍰', '🥤', '☕', '🍵', '🧃', '🍺', '🍷', '🥂', '🧋', '🥑',
    // Vehicles & Travel
    '🚗', '🚕', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚌', '🚎', '🏍️',
    '🛵', '🚲', '🛴', '🚁', '✈️', '🛩️', '🚢', '🚂', '🚆', '🚇',
    '🏖️', '🗻', '🏕️', '🌋',
    // Activities
    '🎯', '🛹', '🧘', '🎸', '🎧', '🎪', '🎻', '🎤', '🎲', '🧩',
    '🎰', '🎱', '🪂', '🏋️', '🤿', '🛶', '⛷️', '🪁', '🎣', '🎼'
];

const Sidebar: React.FC<SidebarProps> = ({
    currentView,
    onViewChange,
    lifePages,
    onAddLifePage,
    onDeleteLifePage,
    onRenameLifePage,
    onChangeLifePageIcon,
    personalColor,
    setPersonalColor,
    workspaceColor,
    setWorkspaceColor
}) => {
    const [isAddingPage, setIsAddingPage] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [editingPageId, setEditingPageId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [emojiPickerPageId, setEmojiPickerPageId] = useState<string | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
                setEmojiPickerPageId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddPage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPageName.trim()) {
            onAddLifePage(newPageName.trim());
            setNewPageName('');
            setIsAddingPage(false);
        }
    };

    const handleStartRename = (page: LifePage) => {
        setEditingPageId(page.id);
        setEditingName(page.name);
    };

    const handleFinishRename = () => {
        if (editingPageId && editingName.trim()) {
            onRenameLifePage(editingPageId, editingName.trim());
        }
        setEditingPageId(null);
        setEditingName('');
    };

    const handleRenameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleFinishRename();
        if (e.key === 'Escape') { setEditingPageId(null); setEditingName(''); }
    };

    return (
        <aside className="sidebar" style={{
            width: isCollapsed ? '64px' : '240px',
            transition: 'width 0.3s ease',
            overflow: 'visible'
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

                {!isCollapsed && (
                    <div className="sidebar-section-title" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.75rem',
                        margin: '1.5rem 0 0.75rem 0'
                    }}>
                        <div
                            onClick={() => document.getElementById('personal-color-picker')?.click()}
                            style={{
                                width: '14px',
                                height: '14px',
                                borderRadius: '50%',
                                background: personalColor,
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease',
                                flexShrink: 0
                            }}
                            className="color-dot"
                            title="Change color"
                        />
                        <input
                            id="personal-color-picker"
                            type="color"
                            style={{ display: 'none' }}
                            value={personalColor}
                            onChange={(e) => {
                                localStorage.setItem('taskmate_personal_color', e.target.value);
                                setPersonalColor(e.target.value);
                            }}
                        />
                        Personal
                    </div>
                )}

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
                            {/* Clickable emoji */}
                            <span
                                className="nav-icon"
                                style={{ marginRight: isCollapsed ? 0 : '0.75rem', cursor: 'pointer', position: 'relative' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setEmojiPickerPageId(emojiPickerPageId === page.id ? null : page.id);
                                }}
                                title="Change emoji"
                            >
                                {page.icon}
                            </span>

                            {/* Editable name */}
                            {!isCollapsed && (
                                editingPageId === page.id ? (
                                    <input
                                        autoFocus
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onBlur={handleFinishRename}
                                        onKeyDown={handleRenameKeyDown}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            border: '1px solid var(--accent-blue)',
                                            borderRadius: '4px',
                                            padding: '2px 6px',
                                            fontSize: '13px',
                                            outline: 'none',
                                            width: '100%',
                                            background: 'var(--bg-card)',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                ) : (
                                    <span
                                        style={{ whiteSpace: 'nowrap', cursor: 'text' }}
                                        onDoubleClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleStartRename(page);
                                        }}
                                        title="Double-click to rename"
                                    >
                                        {page.name}
                                    </span>
                                )
                            )}
                        </a>

                        {/* Emoji Picker Dropdown */}
                        {emojiPickerPageId === page.id && !isCollapsed && (
                            <div
                                ref={emojiPickerRef}
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '4px',
                                    right: '4px',
                                    zIndex: 9999,
                                    background: '#ffffff',
                                    border: '1px solid var(--border-color, #e2e8f0)',
                                    borderRadius: '12px',
                                    padding: '8px',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    gap: '4px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                    maxHeight: '220px',
                                    overflowY: 'auto'
                                }}
                            >
                                {EMOJI_OPTIONS.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChangeLifePageIcon(page.id, emoji);
                                            setEmojiPickerPageId(null);
                                        }}
                                        style={{
                                            background: page.icon === emoji ? 'var(--accent-blue)' : 'none',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '1.2rem',
                                            cursor: 'pointer',
                                            padding: '6px',
                                            transition: 'background 0.15s ease'
                                        }}
                                        onMouseEnter={(e) => { if (page.icon !== emoji) (e.target as HTMLElement).style.background = 'var(--bg-hover, #f1f5f9)'; }}
                                        onMouseLeave={(e) => { if (page.icon !== emoji) (e.target as HTMLElement).style.background = 'none'; }}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}

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
                {!isCollapsed && (
                    <div className="sidebar-section-title" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.75rem',
                        margin: '1.5rem 0 0.75rem 0'
                    }}>
                        <div
                            onClick={() => document.getElementById('workspace-color-picker')?.click()}
                            style={{
                                width: '14px',
                                height: '14px',
                                borderRadius: '50%',
                                background: workspaceColor,
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease',
                                flexShrink: 0
                            }}
                            className="color-dot"
                            title="Change color"
                        />
                        <input
                            id="workspace-color-picker"
                            type="color"
                            style={{ display: 'none' }}
                            value={workspaceColor}
                            onChange={(e) => {
                                localStorage.setItem('taskmate_workspace_color', e.target.value);
                                setWorkspaceColor(e.target.value);
                            }}
                        />
                        Workspace
                    </div>
                )}
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
                <a
                    href="#settings"
                    className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onViewChange('settings'); }}
                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    title={isCollapsed ? "Settings" : ''}
                >
                    <span className="nav-icon" style={{ marginRight: isCollapsed ? 0 : '0.75rem' }}>⚙️</span>
                    {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Settings</span>}
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
