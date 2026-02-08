import React, { useState, useEffect } from 'react';
import { SmartScheduler } from '../services/smartScheduler';
import type { ScheduledTask, CanvasTask } from '../types';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface DeadlinesViewProps {
    roomId: string;
}

const DeadlinesView: React.FC<DeadlinesViewProps> = ({ roomId }) => {
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

            // SmartScheduler already sorts by priority (diffMs)
            const scheduled = SmartScheduler.calculatePriority(fetchedTasks);
            setTasks(scheduled);
            setLoading(false);
        }, (error) => {
            console.error("Firestore error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [roomId]);

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

                {!roomId ? (
                    <div className="premium-card flex-center" style={{ height: '300px', flexDirection: 'column' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Join a room to see shared deadlines.</p>
                    </div>
                ) : loading ? (
                    <div className="flex-center" style={{ height: '300px' }}>
                        <p style={{ color: 'var(--accent-blue)', fontSize: '1.125rem', fontWeight: 600 }}>Analyzing priorities...</p>
                    </div>
                ) : tasks.length === 0 ? (
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
