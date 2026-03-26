import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import type { LifePage } from '../types';

interface PersonalPageViewProps {
    page: LifePage;
    content: string;
    onUpdateContent: (pageId: string, content: string) => void;
    onUpdatePage: (id: string, updates: Partial<LifePage>) => void;
}


// --- Toolbar Button Component ---
const ToolbarButton: React.FC<{
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
    danger?: boolean;
}> = ({ onClick, active, title, children, danger }) => (
    <button
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        data-tooltip={title}
        className="toolbar-btn"
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '6px',
            border: 'none',
            background: active ? 'var(--accent-blue, #3b82f6)' : 'transparent',
            color: danger ? '#ef4444' : active ? '#ffffff' : 'var(--text-secondary, #64748b)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'all 0.15s ease',
            flexShrink: 0,
            position: 'relative',
        }}
        onMouseEnter={(e) => {
            if (!active) e.currentTarget.style.background = 'var(--bg-hover, #f1f5f9)';
        }}
        onMouseLeave={(e) => {
            if (!active) e.currentTarget.style.background = 'transparent';
        }}
    >
        {children}
    </button>
);

// --- Divider ---
const ToolbarDivider = () => (
    <div style={{ width: '1px', height: '20px', background: 'var(--border-color, #e2e8f0)', margin: '0 4px', flexShrink: 0 }} />
);

// --- Main Component ---
const PersonalPageView: React.FC<PersonalPageViewProps> = ({ page, content, onUpdateContent, onUpdatePage }) => {
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [showTextColorPicker, setShowTextColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [toolbarMinimized, setToolbarMinimized] = useState(true);
    const [titleSize, setTitleSize] = useState(page.titleSize || 56); // 3.5rem is ~56px
    const [isHoveringHeader, setIsHoveringHeader] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link',
                },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: content || '',
        onUpdate: () => {
            setSaveStatus('unsaved');
        },
        onBlur: ({ editor }) => {
            onUpdateContent(page.id, editor.getHTML());
            setSaveStatus('saving');
            setTimeout(() => setSaveStatus('saved'), 800);
        },
        editorProps: {
            attributes: {
                style: [
                    'outline: none',
                    'font-size: 1.0625rem',
                    'line-height: 1.75',
                    'color: var(--text-primary)',
                    'font-family: inherit',
                    'padding: 1rem 0',
                ].join(';'),
            },
        },
    });

    // Sync content when page switches
    useEffect(() => {
        if (editor) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    useEffect(() => {
        if (page.titleSize) setTitleSize(page.titleSize);
    }, [page.id, page.titleSize]);

    const setLink = () => {
        const url = window.prompt('Enter URL');
        if (url === null) return;
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const insertTable = () => {
        editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    const addRow = () => editor?.chain().focus().addRowAfter().run();
    const addCol = () => editor?.chain().focus().addColumnAfter().run();
    const deleteRow = () => editor?.chain().focus().deleteRow().run();
    const deleteCol = () => editor?.chain().focus().deleteColumn().run();

    const editorContainerRef = useRef<HTMLDivElement>(null);
    const [tablePos, setTablePos] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    // Track the active table's DOM position for overlay buttons
    useEffect(() => {
        if (!editor) return;
        const updateTablePos = () => {
            if (!editor.isActive('table') || !editorContainerRef.current) {
                setTablePos(null);
                return;
            }
            try {
                const { from } = editor.state.selection;
                const domAtPos = editor.view.domAtPos(from);
                const node = domAtPos.node instanceof Element ? domAtPos.node : domAtPos.node.parentElement;
                const table = node?.closest('table') as HTMLElement | null;
                if (!table || !editorContainerRef.current) { setTablePos(null); return; }
                const containerRect = editorContainerRef.current.getBoundingClientRect();
                const tableRect = table.getBoundingClientRect();
                setTablePos({
                    top: tableRect.top - containerRect.top,
                    left: tableRect.left - containerRect.left,
                    width: tableRect.width,
                    height: tableRect.height,
                });
            } catch { setTablePos(null); }
        };
        editor.on('selectionUpdate', updateTablePos);
        editor.on('update', updateTablePos);
        return () => {
            editor.off('selectionUpdate', updateTablePos);
            editor.off('update', updateTablePos);
        };
    }, [editor]);

    if (!editor) return null;

    const HIGHLIGHT_COLORS = [
        { color: '#fef08a', label: 'Yellow' },
        { color: '#bbf7d0', label: 'Green' },
        { color: '#bfdbfe', label: 'Blue' },
        { color: '#fecaca', label: 'Red' },
        { color: '#e9d5ff', label: 'Purple' },
        { color: '#ffffff', label: 'White' },
        { color: 'none',   label: 'Clear' },
    ];

    const TEXT_COLORS = [
        { color: 'var(--text-primary)', label: 'Default' },
        { color: '#ffffff', label: 'White' },
        { color: '#3b82f6', label: 'Blue' },
        { color: '#22c55e', label: 'Green' },
        { color: '#ef4444', label: 'Red' },
        { color: '#f59e0b', label: 'Orange' },
        { color: '#8b5cf6', label: 'Purple' },
        { color: '#94a3b8', label: 'Gray' },
    ];

    return (
        <main className="main-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <div className="container" style={{ width: '100%', maxWidth: '100%', flex: 1, display: 'flex', flexDirection: 'column', padding: '0 48px', paddingBottom: 0 }}>

                {/* Page Header */}
                <header 
                    style={{ marginBottom: '2rem', position: 'relative' }}
                    onMouseEnter={() => setIsHoveringHeader(true)}
                    onMouseLeave={() => setIsHoveringHeader(false)}
                >
                    <div style={{ 
                        fontSize: `${titleSize}px`, 
                        fontWeight: 900, 
                        margin: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1.25rem', 
                        color: 'var(--text-primary)',
                        transition: 'font-size 0.2s ease-in-out',
                        justifyContent: page.titleAlign === 'center' ? 'center' : page.titleAlign === 'right' ? 'flex-end' : 'flex-start'
                    }}>
                        <span style={{ cursor: 'pointer', flexShrink: 0 }}>{page.icon}</span>
                        <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                                const newName = e.currentTarget.innerText.trim();
                                if (newName !== page.name && newName !== "") {
                                    onUpdatePage(page.id, { name: newName });
                                } else if (newName === "") {
                                    e.currentTarget.innerText = page.name;
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    (e.target as HTMLElement).blur();
                                }
                            }}
                            style={{
                                fontSize: 'inherit',
                                fontWeight: 'inherit',
                                border: 'none',
                                background: 'transparent',
                                color: 'inherit',
                                padding: 0,
                                margin: 0,
                                outline: 'none',
                                textAlign: 'inherit',
                                display: 'inline-block',
                                minWidth: '50px',
                                cursor: 'text',
                            }}
                        >
                            {page.name}
                        </span>
                    </div>
                    {/* Font size slider — only on hover */}
                    <div style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: isHoveringHeader ? 1 : 0,
                        visibility: isHoveringHeader ? 'visible' : 'hidden',
                        transition: 'opacity 0.2s ease, visibility 0.2s ease',
                        background: 'var(--bg-card)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        border: '1px solid var(--border-color, #e2e8f0)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        zIndex: 20,
                    }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Size</span>
                        <input 
                            type="range" 
                            min="24" 
                            max="100" 
                            value={titleSize}
                            onChange={(e) => {
                                const newSize = parseInt(e.target.value);
                                setTitleSize(newSize);
                            }}
                            onMouseUp={() => {
                                onUpdatePage(page.id, { titleSize });
                            }}
                            style={{ 
                                width: '100px',
                                cursor: 'pointer'
                            }} 
                        />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)', minWidth: '35px' }}>{titleSize}px</span>

                        <div style={{ width: '1px', height: '16px', background: 'var(--border-color, #e2e8f0)', margin: '0 4px' }} />

                        {/* Alignment Buttons */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                            <button 
                                onClick={() => onUpdatePage(page.id, { titleAlign: 'left' })}
                                title="Align Left"
                                style={{
                                    border: 'none', background: page.titleAlign === 'left' || !page.titleAlign ? 'var(--bg-hover, #f1f5f9)' : 'transparent',
                                    borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', color: page.titleAlign === 'left' || !page.titleAlign ? 'var(--accent-blue)' : '#94a3b8'
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
                            </button>
                            <button 
                                onClick={() => onUpdatePage(page.id, { titleAlign: 'center' })}
                                title="Align Center"
                                style={{
                                    border: 'none', background: page.titleAlign === 'center' ? 'var(--bg-hover, #f1f5f9)' : 'transparent',
                                    borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', color: page.titleAlign === 'center' ? 'var(--accent-blue)' : '#94a3b8'
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
                            </button>
                            <button 
                                onClick={() => onUpdatePage(page.id, { titleAlign: 'right' })}
                                title="Align Right"
                                style={{
                                    border: 'none', background: page.titleAlign === 'right' ? 'var(--bg-hover, #f1f5f9)' : 'transparent',
                                    borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', color: page.titleAlign === 'right' ? 'var(--accent-blue)' : '#94a3b8'
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Auto-Hiding Toolbar & Editor Wrapper */}
                <div
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                    onFocus={() => setToolbarMinimized(false)}
                    onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            setToolbarMinimized(true);
                        }
                    }}
                >
                    {/* Sticky Toolbar */}
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '10px',
                        border: toolbarMinimized ? '0 solid transparent' : '1px solid var(--border-color, #e2e8f0)',
                        boxShadow: toolbarMinimized ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
                        marginBottom: toolbarMinimized ? '0px' : '0.75rem',
                        position: 'sticky',
                        top: '1rem',
                        zIndex: 100,
                        width: '100%',
                        maxHeight: toolbarMinimized ? '0px' : '200px',
                        overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        opacity: toolbarMinimized ? 0 : 1,
                        pointerEvents: toolbarMinimized ? 'none' : 'auto',
                    }}>
                        <div style={{ 
                            width: '100%', 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            alignItems: 'center', 
                            gap: '2px', 
                            padding: '8px 10px', 
                        }}>
                            {/* Headings */}
                            <select
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === 'p') editor.chain().focus().setParagraph().run();
                                    else editor.chain().focus().setHeading({ level: parseInt(val) as 1 | 2 | 3 }).run();
                                }}
                                value={
                                    editor.isActive('heading', { level: 1 }) ? '1' :
                                    editor.isActive('heading', { level: 2 }) ? '2' :
                                    editor.isActive('heading', { level: 3 }) ? '3' : 'p'
                                }
                                style={{
                                    border: '1px solid var(--border-color, #e2e8f0)',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    height: '30px',
                                }}
                            >
                                <option value="p">Text</option>
                                <option value="1">Heading 1</option>
                                <option value="2">Heading 2</option>
                                <option value="3">Heading 3</option>
                            </select>

                            <ToolbarDivider />

                            {/* Bold, Italic, Underline, Strikethrough */}
                            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Cmd+B)">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Cmd+I)">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Cmd+U)">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
                            </ToolbarButton>
                            <ToolbarDivider />

                            {/* Text Color Picker */}
                            <div style={{ position: 'relative' }}>
                                <ToolbarButton onClick={() => setShowTextColorPicker(!showTextColorPicker)} title="Text Color" active={showTextColorPicker}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '-2px' }}>A</span>
                                        <div style={{ width: '14px', height: '2.5px', background: editor.getAttributes('textStyle').color || 'var(--text-primary)', borderRadius: '1px' }} />
                                    </div>
                                </ToolbarButton>
                                {showTextColorPicker && (
                                    <div style={{ position: 'absolute', top: '35px', left: '0', background: 'var(--bg-card)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '8px', padding: '8px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000 }}>
                                        {TEXT_COLORS.map(({ color, label }) => (
                                            <button key={color} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setColor(color.startsWith('var') ? '#37352f' : color).run(); setShowTextColorPicker(false); }} title={label} style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', background: color.startsWith('var') ? '#37352f' : color, cursor: 'pointer' }} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <ToolbarDivider />

                            {/* Highlight Color Picker */}
                            <div style={{ position: 'relative' }}>
                                <ToolbarButton onClick={() => setShowHighlightPicker(!showHighlightPicker)} title="Highlight Color" active={showHighlightPicker}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 5 5"/><path d="m5 16 1 1"/></svg>
                                        <div style={{ width: '14px', height: '2.5px', background: editor.getAttributes('highlight').color || 'transparent', border: editor.getAttributes('highlight').color ? 'none' : '1px solid #cbd5e1', borderRadius: '1px', marginTop: '1px' }} />
                                    </div>
                                </ToolbarButton>
                                {showHighlightPicker && (
                                    <div style={{ position: 'absolute', top: '35px', left: '0', background: 'var(--bg-card)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '8px', padding: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000 }}>
                                        {HIGHLIGHT_COLORS.map(({ color, label }) => (
                                            <button key={color} onMouseDown={(e) => { e.preventDefault(); if (color === 'none') editor.chain().focus().unsetHighlight().run(); else editor.chain().focus().setHighlight({ color }).run(); setShowHighlightPicker(false); }} title={label} style={{ width: '20px', height: '20px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', background: color === 'none' ? 'white' : color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                                {color === 'none' ? '✕' : ''}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <ToolbarDivider />

                            {/* Lists */}
                            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5H4v8h4c0 2-1 4-3 6"/><path d="M15 21c3 0 7-1 7-8V5h-6v8h4c0 2-1 4-3 6"/></svg>
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                            </ToolbarButton>

                            <ToolbarDivider />

                            {/* Link, Table, HR */}
                            <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Insert Link">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            </ToolbarButton>
                            <ToolbarButton onClick={insertTable} title="Insert Table">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Line">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </ToolbarButton>

                            <ToolbarDivider />

                            {/* Text Alignment */}
                            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
                            </ToolbarButton>

                            <ToolbarDivider />

                            {/* Undo / Redo */}
                            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo (Cmd+Z)">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo (Cmd+Shift+Z)">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
                            </ToolbarButton>

                            {/* Autosave status */}
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8', flexShrink: 0 }}>
                                {saveStatus === 'saved' && (<><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />Saved</>)}
                                {saveStatus === 'saving' && (<><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />Saving…</>)}
                                {saveStatus === 'unsaved' && (<><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1', display: 'inline-block' }} />Unsaved</>)}
                            </div>

                        </div>
                    </div>

                <div 
                    ref={editorContainerRef} 
                    style={{ flex: 1, overflowY: 'auto', paddingBottom: '40px', paddingRight: '40px', position: 'relative' }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget && editor) {
                            const { state } = editor;
                            const lastNode = state.doc.lastChild;
                            if (lastNode && lastNode.type.name === 'table') {
                                editor.chain().insertContentAt(state.doc.content.size, { type: 'paragraph' }).focus('end').run();
                            } else {
                                editor.commands.focus('end');
                            }
                        }
                    }}
                >
                    <style>{`
                        .ProseMirror p { margin: 0.25em 0; }
                        .ProseMirror h1 { font-size: 2em; font-weight: 800; margin: 0.75em 0 0.25em; }
                        .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin: 0.6em 0 0.2em; }
                        .ProseMirror h3 { font-size: 1.25em; font-weight: 600; margin: 0.5em 0 0.2em; }
                        .ProseMirror ul { padding-left: 1.5em; list-style: disc; }
                        .ProseMirror ol { padding-left: 1.5em; list-style: decimal; }
                        .ProseMirror li { margin: 0.25em 0; }
                        .ProseMirror blockquote {
                            border-left: 3px solid #3b82f6;
                            padding-left: 1em;
                            margin: 1em 0;
                            color: #64748b;
                            font-style: italic;
                        }
                        .ProseMirror code {
                            background: var(--bg-hover, #f1f5f9);
                            padding: 0.1em 0.3em;
                            border-radius: 4px;
                            font-family: 'JetBrains Mono', monospace;
                            font-size: 0.9em;
                        }
                        .ProseMirror pre {
                            background: var(--bg-hover, #f1f5f9);
                            border-radius: 8px;
                            padding: 1em;
                            overflow-x: auto;
                            margin: 1em 0;
                        }
                        .ProseMirror pre code {
                            background: none;
                            padding: 0;
                        }
                        .ProseMirror p.is-editor-empty:first-child::before {
                            content: attr(data-placeholder);
                            float: left;
                            color: #94a3b8;
                            pointer-events: none;
                            height: 0;
                        }
                        .ProseMirror mark {
                            border-radius: 3px;
                            padding: 0 2px;
                        }
                        .ProseMirror .editor-link {
                            color: #3b82f6;
                            text-decoration: underline;
                            cursor: pointer;
                        }
                        /* Table Styles */
                        .ProseMirror table {
                            border-collapse: collapse;
                            table-layout: fixed;
                            width: calc(100% - 8px);
                            margin: 0;
                        }
                        .ProseMirror td, .ProseMirror th {
                            min-width: 1em;
                            border: 1px solid var(--border-color, #e2e8f0);
                            padding: 8px 12px;
                            vertical-align: top;
                            box-sizing: border-box;
                            position: relative;
                            transition: background-color 0.2s;
                        }
                        .ProseMirror td:hover, .ProseMirror th:hover {
                            background-color: rgba(255,255,255,0.02);
                        }
                        .ProseMirror th {
                            font-weight: bold;
                            text-align: left;
                            background-color: var(--bg-hover, #f1f5f9);
                        }

                        /* List Styles and Nesting Animations */
                        .ProseMirror ul, .ProseMirror ol {
                            padding: 0 1rem;
                            margin: 1rem 0;
                        }
                        .ProseMirror li {
                           margin-bottom: 0.25rem;
                           transition: padding-left 0.2s ease-in-out;
                        }
                        
                        /* Level 2: Double Tab effect */
                        .ProseMirror ul ul li, .ProseMirror ol ul li {
                            list-style-type: circle;
                            color: var(--text-primary, #000);
                            padding-left: 0.5rem;
                        }

                        /* Level 3: Triple Tab effect */
                        .ProseMirror ul ul ul li, .ProseMirror ol ul ul li {
                            list-style-type: square;
                            color: var(--text-primary, #000);
                            padding-left: 0.75rem;
                        }

                        .ProseMirror .selectedCell:after {
                            z-index: 2;
                            content: "";
                            position: absolute;
                            left: 0; right: 0; top: 0; bottom: 0;
                            background: rgba(200, 200, 255, 0.4);
                            pointer-events: none;
                        }
                        
                        /* Custom Tooltips */
                        .toolbar-btn[data-tooltip] {
                            position: relative;
                        }
                        .toolbar-btn[data-tooltip]::after {
                            content: attr(data-tooltip);
                            position: absolute;
                            bottom: 125%;
                            left: 50%;
                            transform: translateX(-50%) translateY(5px);
                            background: #1e293b;
                            color: white;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 11px;
                            white-space: nowrap;
                            opacity: 0;
                            visibility: hidden;
                            transition: all 0.2s ease;
                            pointer-events: none;
                            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                            z-index: 1000;
                        }
                        .toolbar-btn[data-tooltip]:hover::after {
                            opacity: 1;
                            visibility: visible;
                            transform: translateX(-50%) translateY(0);
                        }
                        .toolbar-btn[data-tooltip]::before {
                            content: "";
                            position: absolute;
                            bottom: 110%;
                            left: 50%;
                            transform: translateX(-50%);
                            border: 5px solid transparent;
                            border-top-color: #1e293b;
                            opacity: 0;
                            visibility: hidden;
                            transition: all 0.2s ease;
                            pointer-events: none;
                            z-index: 1000;
                        }
                        .toolbar-btn[data-tooltip]:hover::before {
                            opacity: 1;
                            visibility: visible;
                        }

                        .ProseMirror .column-resize-handle {
                            position: absolute;
                            right: -2px;
                            top: 0;
                            bottom: 0;
                            width: 4px;
                            z-index: 20;
                            background-color: #adf;
                            pointer-events: none;
                        }
                        .ProseMirror:focus { outline: none; }
                    `}</style>
                    {/* Overlay '+/-' buttons for table extension/reduction */}
                    {tablePos && (
                        <>
                            {/* Row Controls — appear below the table */}
                            <div style={{
                                position: 'absolute',
                                top: `${tablePos.top + tablePos.height + 4}px`,
                                left: `${tablePos.left + tablePos.width / 2 - 26}px`,
                                display: 'flex',
                                gap: '4px',
                                zIndex: 200,
                            }}>
                                <button
                                    onMouseDown={(e) => { e.preventDefault(); addRow(); }}
                                    className="table-plus-btn"
                                    title="Add Row"
                                >
                                    +
                                </button>
                                <button
                                    onMouseDown={(e) => { e.preventDefault(); deleteRow(); }}
                                    className="table-plus-btn table-minus-btn"
                                    title="Delete Row"
                                >
                                    -
                                </button>
                            </div>

                            {/* Column Controls — appear to the right of the table */}
                            <div style={{
                                position: 'absolute',
                                top: `${tablePos.top + tablePos.height / 2 - 26}px`,
                                left: `${tablePos.left + tablePos.width + 4}px`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                zIndex: 200,
                            }}>
                                <button
                                    onMouseDown={(e) => { e.preventDefault(); addCol(); }}
                                    className="table-plus-btn"
                                    title="Add Column"
                                >
                                    +
                                </button>
                                <button
                                    onMouseDown={(e) => { e.preventDefault(); deleteCol(); }}
                                    className="table-plus-btn table-minus-btn"
                                    title="Delete Column"
                                >
                                    -
                                </button>
                            </div>
                        </>
                    )}
                    <style>{`
                        .table-plus-btn {
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            border: 2px solid rgba(59,130,246,0.4);
                            background: rgba(59,130,246,0.08);
                            color: rgba(59,130,246,0.6);
                            font-size: 16px;
                            line-height: 1;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            opacity: 0.4;
                            transition: opacity 0.15s, background 0.15s, transform 0.15s;
                            z-index: 200;
                        }
                        .table-plus-btn:hover {
                            opacity: 1;
                            background: rgba(59,130,246,0.2);
                            border-color: #3b82f6;
                            color: #3b82f6;
                            transform: scale(1.15);
                        }
                        .table-minus-btn {
                            border-color: rgba(239,68,68,0.4);
                            background: rgba(239,68,68,0.08);
                            color: rgba(239,68,68,0.6);
                        }
                        .table-minus-btn:hover {
                            background: rgba(239,68,68,0.2);
                            border-color: #ef4444;
                            color: #ef4444;
                        }
                    `}</style>
                    <EditorContent editor={editor} />
                </div>
                </div>{/* End Auto-Hiding Toolbar & Editor Wrapper */}

            </div>
        </main>
    );
};

export default PersonalPageView;
