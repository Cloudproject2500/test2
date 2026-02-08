import React from 'react';

const Inbox: React.FC = () => {
    const notifications = [
        { id: 1, type: 'urgent', title: 'CS101 Assignment Due', description: 'Due in less than 24 hours', time: '2h ago' },
        { id: 2, type: 'general', title: 'MATH202 Announcement', description: 'Midterm results are posted', time: '5h ago' },
        { id: 3, type: 'general', title: 'Lifestyle Tip', description: 'Time for your scheduled cardio!', time: '1d ago' },
    ];

    return (
        <div className="main-wrapper">
            <div className="container">
                <header style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        <span>🏠</span> / Inbox
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Notifications</h2>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <section>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Urgent</h3>
                        {notifications.filter(n => n.type === 'urgent').map(n => (
                            <div key={n.id} className="premium-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--error)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{n.title}</h4>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{n.description}</p>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.time}</span>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>General</h3>
                        {notifications.filter(n => n.type === 'general').map(n => (
                            <div key={n.id} className="workspace-block" style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{n.title}</h4>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{n.description}</p>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.time}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Inbox;
