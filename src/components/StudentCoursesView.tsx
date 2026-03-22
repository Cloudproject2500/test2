import React, { useState, useMemo } from 'react';

const StudentCoursesView: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [startTimeFilter, setStartTimeFilter] = useState(8);

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const filteredCourses = useMemo(() => {
        // Empty array for student to start fresh
        return [];
    }, [searchQuery, selectedDays, startTimeFilter]);

    return (
        <div className="courses-view" style={{
            display: 'flex',
            height: 'calc(100vh - 40px)',
            padding: '20px',
            gap: '24px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-primary)'
        }}>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Course Schedule</h2>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        alignItems: 'center',
                        backgroundColor: 'var(--bg-card, white)',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        marginBottom: '24px',
                        boxShadow: 'var(--card-shadow)'
                    }}>
                        <div style={{ flex: '1 1 300px' }}>
                            <input
                                type="text"
                                placeholder="Search courses (e.g., CS 2420)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    backgroundColor: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }}>
                            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid',
                                        borderColor: selectedDays.includes(day) ? 'var(--accent-blue)' : 'var(--border-color)',
                                        backgroundColor: selectedDays.includes(day) ? 'var(--accent-blue)' : 'var(--bg-card, white)',
                                        color: selectedDays.includes(day) ? 'white' : 'var(--text-secondary)',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                After {startTimeFilter}:00
                            </span>
                            <input
                                type="range"
                                min="8"
                                max="20"
                                value={startTimeFilter}
                                onChange={(e) => setStartTimeFilter(parseInt(e.target.value))}
                                style={{ flex: 1, cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                    <div style={{
                        padding: '0 4px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '16px'
                    }}>
                        {filteredCourses.length > 0 ? (
                            null // We would map course cards here, but it's empty
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Courses Found</h3>
                                <p style={{ fontSize: '0.875rem' }}>Your course list is empty. Courses will appear here once added.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCoursesView;
