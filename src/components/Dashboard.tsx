import React, { useState, useEffect } from 'react';
import { SmartScheduler } from '../services/smartScheduler';
import type { ScheduledTask, CanvasTask, LifePage, PersonalTodo } from '../types';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface DashboardProps {
    roomId: string;
    lifePages: LifePage[];
    personalTodos: PersonalTodo[];
    onViewChange: (view: string) => void;
    onJoinRoom: (roomId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ roomId, lifePages, personalTodos, onViewChange }) => {
    const [tasks, setTasks] = useState<ScheduledTask[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!roomId) {
            setTasks([]);
            return;
        }

        setLoading(true);
        const q = query(collection(db, "tasks"), where("roomId", "==", roomId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedTasks: CanvasTask[] = [];
            querySnapshot.forEach((doc) => {
                fetchedTasks.push({ id: doc.id, ...doc.data() } as CanvasTask);
            });

            const scheduled = SmartScheduler.calculatePriority(fetchedTasks);
            setTasks(scheduled);
            setLoading(false);
        }, (error) => {
            console.error("Firestore error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [roomId]);


    const getCourseBadgeClass = (courseName: string) => {
        if (courseName.includes('CS') || courseName.includes('IS')) return 'badge badge-blue';
        if (courseName.includes('MATH') || courseName.includes('QAMO')) return 'badge badge-orange';
        if (courseName.includes('COLLAB')) return 'badge badge-purple';
        if (courseName.includes('FINAN')) return 'badge badge-green';
        if (courseName.includes('MGT')) return 'badge badge-purple';
        return 'badge badge-green';
    };

    const getPageProgress = (pageId: string) => {
        const pageTodos = personalTodos.filter(t => t.pageId === pageId);
        if (pageTodos.length === 0) return null;
        const completed = pageTodos.filter(t => t.completed).length;
        return {
            completed,
            total: pageTodos.length,
            percentage: Math.round((completed / pageTodos.length) * 100)
        };
    };

    const brandBlue = '#3b82f6';

    return (
        <main className="main-wrapper">
            <div className="container">
                <header style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        <span>🏠</span> / Dashboard
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome back, TaskMate</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                        Manage your lifestyle and academic ecosystem in one place.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                    {/* Core Block: Academic Deadlines */}
                    <section className="premium-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>📚 Shared Deadlines</h3>
                        </div>

                        {!roomId ? (
                            <div className="flex-center" style={{ height: '150px', flexDirection: 'column' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Join a room to sync academic data.</p>
                            </div>
                        ) : loading ? (
                            <div className="flex-center" style={{ height: '150px' }}>
                                <p style={{ color: 'var(--accent-blue)', fontSize: '0.875rem' }}>Syncing...</p>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="flex-center" style={{ height: '150px' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No active tasks.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {tasks.slice(0, 5).map(task => (
                                    <div key={task.id} className="workspace-block" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{task.title}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--error)' }}>{task.remainingTime}</span>
                                        </div>
                                        <span className={getCourseBadgeClass(task.courseName)}>{task.courseName}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Dynamic Life Progress Summaries */}
                    {lifePages.map(page => {
                        const progress = getPageProgress(page.id);
                        return (
                            <section
                                key={page.id}
                                className="premium-card"
                                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onClick={() => onViewChange(page.id)}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                                        {page.icon} {page.name} Progress
                                    </h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>View Details →</span>
                                </div>

                                {progress ? (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Daily Tasks</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: brandBlue }}>
                                                {progress.completed} / {progress.total}
                                            </span>
                                        </div>
                                        <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${progress.percentage}%`, background: brandBlue, transition: 'width 0.5s ease' }} />
                                        </div>
                                        <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                                            {progress.percentage}% Achieved
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex-center" style={{ height: '100px', flexDirection: 'column', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>No goals set yet</p>
                                        <p style={{ color: brandBlue, fontSize: '0.625rem', fontWeight: 600, marginTop: '4px' }}>Build your todo list →</p>
                                    </div>
                                )}
                            </section>
                        );
                    })}

                    {/* Static Analytics Block (Unified Balance) */}
                    <section className="premium-card">
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>📊 Life Balance</h3>
                        <div style={{ height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                            <div style={{ width: '65%', background: brandBlue }}></div>
                            <div style={{ width: '35%', background: 'var(--success)' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem' }}>
                            <span>Academic (65%)</span>
                            <span>Lifestyle (35%)</span>
                        </div>
                    </section>
                </div>

                <footer style={{ marginTop: '4rem', paddingBottom: '2rem', opacity: 0.6, fontSize: '0.8125rem' }}>
                    <p>© 2026 TaskMate OS Architect. Management Platform v1.9.0</p>
                </footer>
            </div>
        </main>
    );
};

export default Dashboard;
