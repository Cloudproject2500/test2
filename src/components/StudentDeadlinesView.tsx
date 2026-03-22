import React, { useState } from 'react';
import type { ScheduledTask } from '../types';

const StudentDeadlinesView: React.FC = () => {
    // Empty tasks array for student to start fresh
    const [tasks] = useState<ScheduledTask[]>([]);

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
                    <div className="premium-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏰</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No active deadlines</h3>
                        <p style={{ fontSize: '0.875rem' }}>Enjoy your free time! Deadlines from your courses will appear here.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* We would map tasks here, but it's empty */}
                    </div>
                )}
            </div>
        </main>
    );
};

export default StudentDeadlinesView;
