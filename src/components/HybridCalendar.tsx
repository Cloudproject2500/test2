import React from 'react';

const HybridCalendar: React.FC = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date();
    const currentMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Mock events
    const events = [
        { day: 15, title: 'CS101 Final', type: 'academic' },
        { day: 15, title: 'Gym Session', type: 'lifestyle' },
        { day: 18, title: 'Math Quiz', type: 'academic' },
        { day: 22, title: 'Hobby: Painting', type: 'lifestyle' },
    ];

    return (
        <div className="main-wrapper">
            <div className="container" style={{ maxWidth: '1000px' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            <span>🏠</span> / Calendar
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{currentMonth}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-primary" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Today</button>
                        <button className="btn-primary">Filter</button>
                    </div>
                </header>

                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-color)' }}>
                        {days.map(day => (
                            <div key={day} style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                {day}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '120px' }}>
                        {[...Array(35)].map((_, i) => {
                            const dayNum = i - 2; // Offset for February 2026 starts on Sunday
                            const dayEvents = events.filter(e => e.day === dayNum);

                            return (
                                <div key={i} style={{ borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: dayNum > 0 && dayNum <= 28 ? 'var(--text-primary)' : '#ccc' }}>
                                        {dayNum > 0 && dayNum <= 28 ? dayNum : ''}
                                    </span>
                                    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        {dayEvents.map((e, idx) => (
                                            <div key={idx} style={{
                                                fontSize: '10px',
                                                padding: '2px 4px',
                                                borderRadius: '3px',
                                                background: e.type === 'academic' ? 'var(--accent-blue)' : 'var(--success)',
                                                color: 'white',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {e.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-blue)' }}></div>
                        Academic (Canvas)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--success)' }}></div>
                        Lifestyle (Personal)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HybridCalendar;
