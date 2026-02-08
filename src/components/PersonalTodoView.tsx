import React, { useState } from 'react';
import type { LifePage, PersonalTodo, CategoryTemplate } from '../types';

interface PersonalTodoViewProps {
    page: LifePage;
    todos: PersonalTodo[];
    onAddTodo: (pageId: string, text: string, options?: Partial<PersonalTodo>) => void;
    onToggleTodo: (id: string) => void;
    onUpdateProgress: (id: string, progress: number) => void;
    onDeleteTodo: (id: string) => void;
    onApplyTemplate: (pageId: string, tasks: { text: string, icon: string, goal?: number }[]) => void;
}

const TEMPLATES: CategoryTemplate[] = [
    {
        id: 'fitness-workout',
        name: 'Full Body Workout',
        category: 'fitness',
        tasks: [
            { text: 'Squats (3x12)', icon: '🏋️' },
            { text: 'Push-ups (3x15)', icon: '💪' },
            { text: 'Water intake (L)', icon: '💧', goal: 2 },
            { text: 'Protein intake (g)', icon: '🥩', goal: 120 }
        ]
    },
    {
        id: 'hobbies-reading',
        name: 'Reading Challenge',
        category: 'hobbies',
        tasks: [
            { text: 'Current Book Progress', icon: '📖', goal: 300 }
        ]
    },
    {
        id: 'lifestyle-routine',
        name: 'Daily Routine',
        category: 'lifestyle',
        tasks: [
            { text: 'Morning Meditation', icon: '🧘' },
            { text: 'Journaling', icon: '✍️' },
            { text: 'Plan tomorrow', icon: '📅' }
        ]
    }
];

const PersonalTodoView: React.FC<PersonalTodoViewProps> = ({
    page,
    todos,
    onAddTodo,
    onToggleTodo,
    onUpdateProgress,
    onDeleteTodo,
    onApplyTemplate
}) => {
    const [newTaskText, setNewTaskText] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            onAddTodo(page.id, newTaskText.trim());
            setNewTaskText('');
        }
    };

    const brandBlue = '#3b82f6';

    const getProgressPercentage = (todo: PersonalTodo) => {
        if (!todo.goal) return 0;
        return Math.min(100, (todo.progress || 0) / todo.goal * 100);
    };

    const categoryTemplates = TEMPLATES.filter(t => t.category === page.id || (page.type === 'custom' && t.category === 'lifestyle'));

    return (
        <main className="main-wrapper">
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            <span>{page.icon}</span> / {page.name}
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{page.name}</h2>
                    </div>
                    {categoryTemplates.length > 0 && (
                        <button
                            onClick={() => setShowTemplates(!showTemplates)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: `1px solid ${brandBlue}`,
                                color: brandBlue,
                                background: 'white',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            {showTemplates ? 'Close Templates' : 'Use Template'}
                        </button>
                    )}
                </header>

                {showTemplates && (
                    <div className="premium-card" style={{ marginBottom: '2rem', background: '#f0f7ff', border: `1px dashed ${brandBlue}` }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: brandBlue }}>Category Templates</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {categoryTemplates.map(template => (
                                <div
                                    key={template.id}
                                    onClick={() => {
                                        onApplyTemplate(page.id, template.tasks);
                                        setShowTemplates(false);
                                    }}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        background: 'white',
                                        border: '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = brandBlue}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                >
                                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>{template.name}</h4>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        {template.tasks.length} tasks
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <form onSubmit={handleAddTask} style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
                        <input
                            type="text"
                            placeholder="Add a new goal or task..."
                            value={newTaskText}
                            onChange={e => setNewTaskText(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '1.25rem',
                                border: 'none',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                        <button type="submit" style={{
                            padding: '0 1.5rem',
                            background: brandBlue,
                            color: 'white',
                            border: 'none',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}>
                            Add
                        </button>
                    </form>

                    <div style={{ padding: '1rem' }}>
                        {todos.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <p style={{ margin: 0 }}>No tasks here yet.</p>
                                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Select a template or add a task manually.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {todos.map(todo => (
                                    <div key={todo.id} className="workspace-block" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={todo.completed}
                                                    onChange={() => onToggleTodo(todo.id)}
                                                    style={{ width: '18px', height: '18px', accentColor: brandBlue }}
                                                />
                                                <span style={{
                                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                                    color: todo.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                                    fontWeight: 500,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    {todo.icon && <span>{todo.icon}</span>}
                                                    {todo.text}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => onDeleteTodo(todo.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.3 }}
                                            >
                                                🗑️
                                            </button>
                                        </div>

                                        {todo.goal !== undefined && (
                                            <div style={{ marginTop: '1rem', paddingLeft: '2.25rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                                    <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                                                    <span style={{ fontWeight: 600 }}>{todo.progress || 0} / {todo.goal}</span>
                                                </div>
                                                <div style={{ position: 'relative', height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 0,
                                                        height: '100%',
                                                        width: `${getProgressPercentage(todo)}%`,
                                                        background: brandBlue,
                                                        transition: 'width 0.3s ease'
                                                    }} />
                                                </div>
                                                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                                    <input
                                                        type="number"
                                                        value={todo.progress || 0}
                                                        onChange={e => onUpdateProgress(todo.id, parseInt(e.target.value) || 0)}
                                                        style={{
                                                            width: '60px',
                                                            padding: '4px',
                                                            borderRadius: '4px',
                                                            border: '1px solid var(--border-color)',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    />
                                                    <span style={{ fontSize: '0.75rem', alignSelf: 'center', color: 'var(--text-secondary)' }}>Update progress</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PersonalTodoView;
