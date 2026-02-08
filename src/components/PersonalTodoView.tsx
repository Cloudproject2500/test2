import React, { useState } from 'react';
import type { LifePage, PersonalTodo } from '../types';

interface PersonalTodoViewProps {
    page: LifePage;
    todos: PersonalTodo[];
    onAddTodo: (pageId: string, text: string, options?: Partial<PersonalTodo>) => void;
    onToggleTodo: (id: string) => void;
    onUpdateProgress: (id: string, progress: number) => void;
    onDeleteTodo: (id: string) => void;

}



const PersonalTodoView: React.FC<PersonalTodoViewProps> = ({
    page,
    todos,
    onAddTodo,
    onToggleTodo,
    onUpdateProgress,
    onDeleteTodo,

}) => {
    const [newTaskText, setNewTaskText] = useState('');

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

                </header>



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
                                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Add a task manually.</p>
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
