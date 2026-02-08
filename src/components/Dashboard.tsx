import React from 'react';
import type { LifePage, PersonalTodo } from '../types';

interface DashboardProps {
    roomId: string;
    lifePages: LifePage[];
    personalTodos: PersonalTodo[];
    onViewChange: (view: string) => void;
    onJoinRoom: (roomId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ lifePages, personalTodos, onViewChange }) => {





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
                {/* 
                  HEADER SECTION:
                  Contains navigation breadcrumbs, welcome message, and subtitle.
                */}
                <header style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        <span>Dashboard</span>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome back, user</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                        Manage your lifestyle and workspace in one place.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>


                    {/* 
                      SECTION 2: DYNAMIC LIFE PROGRESS SUMMARIES
                      Iterates through 'lifePages' (Lifestyle, Fitness, Hobbies) and shows a progress bar
                      based on completed todos in that category.
                    */}
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

                    {/* 
                      SECTION 3: LIFE BALANCE ANALYTICS
                      A static visual representation of the work-life balance ratio.
                      Currently hardcoded to 65% Academic and 35% Lifestyle.
                    */}
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

                {/* 
                  FOOTER SECTION:
                  Copyright and version information.
                */}
                <footer style={{ marginTop: '4rem', paddingBottom: '2rem', opacity: 0.6, fontSize: '0.8125rem' }}>
                    <p>© 2026 TaskMate OS Architect. Management Platform v1.9.0</p>
                </footer>
            </div>
        </main>
    );
};

export default Dashboard;
