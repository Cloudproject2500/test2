import React, { useState, useEffect } from 'react';

// Define the Event interface
interface CalendarEvent {
    id: string;
    title: string;
    date: string; // ISO Date string (YYYY-MM-DD)
    time: string;
    place: string;
    type: 'academic' | 'lifestyle' | 'personal';
}

const HybridCalendar: React.FC = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [currentDate, setCurrentDate] = useState(new Date());

    // State for Events
    const [events, setEvents] = useState<CalendarEvent[]>([
        // Initial mock events (using dynamic dates for current month functionality)
        { id: '1', title: 'CS101 Final', date: '', time: '10:00', place: 'Room 304', type: 'academic' },
        { id: '2', title: 'Gym Session', date: '', time: '18:00', place: 'Campus Gym', type: 'lifestyle' },
    ]);

    // Initialize mock events to the current month for demo purposes
    useEffect(() => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        setEvents([
            { id: '1', title: 'CS101 Final', date: `${year}-${month}-15`, time: '10:00', place: 'Room 304', type: 'academic' },
            { id: '2', title: 'Gym Session', date: `${year}-${month}-15`, time: '18:00', place: 'Campus Gym', type: 'lifestyle' },
            { id: '3', title: 'Math Quiz', date: `${year}-${month}-18`, time: '14:00', place: 'Room 101', type: 'academic' },
            { id: '4', title: 'Hobby: Painting', date: `${year}-${month}-22`, time: '20:00', place: 'Home', type: 'lifestyle' },
        ]);
    }, []); // Run once on mount

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        time: '',
        place: '',
    });

    // Calendar Helper Functions
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const currentMonthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Event Handlers
    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEvent.title && newEvent.date) {
            const event: CalendarEvent = {
                id: Math.random().toString(36).substr(2, 9),
                title: newEvent.title,
                date: newEvent.date,
                time: newEvent.time,
                place: newEvent.place,
                type: 'personal' // Default new events to personal
            };
            setEvents([...events, event]);
            setShowModal(false);
            setNewEvent({ title: '', date: '', time: '', place: '' });
        }
    };

    const handleInputDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEvent({ ...newEvent, date: e.target.value });
        // Optionally update calendar view to match the selected date's month
        if (e.target.value) {
            const selectedDate = new Date(e.target.value);
            if (!isNaN(selectedDate.getTime())) {
                // If we want the calendar to jump to the event date:
                // setCurrentDate(selectedDate);
            }
        }
    };

    return (
        <div className="main-wrapper" style={{ position: 'relative' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            <span>🏠</span> / Calendar
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{currentMonthName}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn-primary"
                            onClick={() => setShowModal(true)}
                            style={{ background: 'var(--accent-blue)', color: 'white', border: 'none' }}
                        >
                            + Add Event
                        </button>
                        <button
                            className="btn-primary"
                            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                            onClick={() => setCurrentDate(new Date())}
                        >
                            Today
                        </button>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(120px, auto)' }}>
                        {[...Array(42)].map((_, i) => {
                            const dayNum = i - firstDay + 1;
                            const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;

                            // Date string for this cell
                            const cellDate = isCurrentMonth
                                ? new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum)
                                : null;
                            const dateStr = cellDate ? cellDate.toISOString().split('T')[0] : '';

                            // Filter events for this day
                            const dayEvents = isCurrentMonth
                                ? events.filter(e => e.date === dateStr)
                                : [];

                            if (i >= daysInMonth + firstDay && !isCurrentMonth && dayNum > 0) return null; // Stop extra rows

                            return (
                                <div key={i} style={{
                                    borderRight: '1px solid #f0f0f0',
                                    borderBottom: '1px solid #f0f0f0',
                                    padding: '0.5rem',
                                    backgroundColor: isCurrentMonth ? 'transparent' : '#f9fafb',
                                    minHeight: '120px'
                                }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: isCurrentMonth ? 600 : 400,
                                        color: isCurrentMonth ? 'var(--text-primary)' : '#ccc'
                                    }}>
                                        {isCurrentMonth ? dayNum : ''}
                                    </span>

                                    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        {dayEvents.map((e) => (
                                            <div key={e.id} style={{
                                                fontSize: '10px',
                                                padding: '2px 4px',
                                                borderRadius: '3px',
                                                background: e.type === 'academic' ? 'var(--accent-blue)' :
                                                    e.type === 'lifestyle' ? 'var(--success)' : '#8B5CF6', // Purple for personal
                                                color: 'white',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                cursor: 'pointer'
                                            }} title={`${e.time} - ${e.title} @ ${e.place}`}>
                                                {e.time && <span style={{ opacity: 0.8, marginRight: '4px' }}>{e.time}</span>}
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
                        Academic
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--success)' }}></div>
                        Lifestyle
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#8B5CF6' }}></div>
                        Personal
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setShowModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        width: '400px',
                        maxWidth: '90%',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>Add New Event</h3>
                        <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Event Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                    placeholder="e.g., Study Group"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newEvent.date}
                                        onChange={handleInputDateChange}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Time</label>
                                    <input
                                        type="time"
                                        value={newEvent.time}
                                        onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Place</label>
                                <input
                                    type="text"
                                    value={newEvent.place}
                                    onChange={e => setNewEvent({ ...newEvent, place: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                    placeholder="e.g., Library"
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-primary"
                                    style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ background: 'var(--accent-blue)', color: 'white' }}
                                >
                                    Save Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HybridCalendar;
