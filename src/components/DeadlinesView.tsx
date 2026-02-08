import React, { useState } from 'react';

import type { ScheduledTask } from '../types';




const DeadlinesView: React.FC = () => {
    const [tasks] = useState<ScheduledTask[]>([
        {
            id: '1',
            courseName: 'CS 101',
            title: 'Algorithm Analysis',
            dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
            type: 'assignment',
            status: 'pending',
            syncedAt: new Date().toISOString(),
            priority: 1,
            remainingTime: '2 days',
            urgency: 'Critical'
        },
        {
            id: '2',
            courseName: 'MATH 202',
            title: 'Linear Algebra Quiz',
            dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
            type: 'quiz',
            status: 'pending',
            syncedAt: new Date().toISOString(),
            priority: 2,
            remainingTime: '5 days',
            urgency: 'Upcoming'
        }
    ]);


    const getRiskColor = (urgency: string) => {
        switch (urgency) {
            case 'Critical': return 'var(--error)';
            case 'Upcoming': return 'var(--warning)';
            case 'Planned': return 'var(--accent-blue)';
            case 'Finished': return 'var(--success)';
            default: return 'var(--text-secondary)';
        }
    };

    const getRiskLabel = (urgency: string) => {
        switch (urgency) {
            case 'Critical': return 'CRITICAL RISK';
            case 'Upcoming': return 'UPCOMING';
            case 'Planned': return 'PLANNED';
            case 'Finished': return 'COMPLETED';
            default: return urgency;
        }
    };

    return (
        <main className="main-wrapper">
            <div className="container">
                <header style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        <span>🏠</span> / Workspace / Deadlines
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Deadline Priority</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                        Tasks sorted by risk level and urgency.
                    </p>
                </header>

                {tasks.length === 0 ? (
                    <div className="premium-card flex-center" style={{ height: '300px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>No active deadlines found.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {tasks.map((task) => (
                            <div key={task.id} className="premium-card" style={{
                                borderLeft: `6px solid ${getRiskColor(task.urgency)}`,
                                transition: 'transform 0.2s',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                color: getRiskColor(task.urgency),
                                                letterSpacing: '0.05em',
                                                border: `1px solid ${getRiskColor(task.urgency)}`,
                                                padding: '2px 8px',
                                                borderRadius: '4px'
                                            }}>
                                                {getRiskLabel(task.urgency)}
                                            </span>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                                {task.courseName}
                                            </span>
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{task.title}</h3>
                                        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <span>📅</span> {new Date(task.dueDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <span>⏰</span> {new Date(task.dueDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: getRiskColor(task.urgency) }}>
                                            {task.remainingTime}
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Time remaining</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </main>
    );
};

export default DeadlinesView;
