import React from 'react';

const StudentInbox: React.FC = () => {
    const notifications: any[] = [];

    return (
        <div className="main-wrapper">
            <div className="container">
                <header style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        <span>🏠</span> / Inbox
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Notifications</h2>
                </header>

                {notifications.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No new notifications</h3>
                        <p style={{ fontSize: '0.875rem' }}>When you get notifications, they'll show up here.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Sections would go here */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentInbox;
