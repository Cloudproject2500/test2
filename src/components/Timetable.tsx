import React from 'react';
import type { Course } from '../types';

interface TimetableProps {
    plannedCourses: Course[];
    onRemoveCourse: (courseId: string) => void;
}

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

const Timetable: React.FC<TimetableProps> = ({ plannedCourses, onRemoveCourse }) => {

    // Helper to calculate position in the grid
    const getGridPosition = (time: string) => {
        const [hour, minute] = time.split(':').map(Number);
        const startHour = 8;
        const hourHeight = 60; // 60px per hour
        const top = (hour - startHour) * hourHeight + (minute / 60) * hourHeight;
        return top;
    };

    const getDurationHeight = (start: string, end: string) => {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        const durationMin = (endH * 60 + endM) - (startH * 60 + startM);
        return (durationMin / 60) * 60; // 60px per hour
    };

    return (
        <div className="timetable-container" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            height: 'fit-content',
            minWidth: '600px',
            overflowX: 'auto'
        }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>🗓️</span> Draft Timetable
            </h3>

            <div style={{ position: 'relative', borderLeft: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>
                {/* Header Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(5, 1fr)', backgroundColor: '#F9FAFB' }}>
                    <div style={{ padding: '8px', borderRight: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}></div>
                    {DAYS.map(day => (
                        <div key={day} style={{
                            padding: '8px',
                            textAlign: 'center',
                            fontWeight: 600,
                            fontSize: '13px',
                            borderRight: '1px solid #E5E7EB',
                            borderBottom: '1px solid #E5E7EB'
                        }}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid Content */}
                <div style={{ display: 'flex', position: 'relative' }}>
                    {/* Time Column Labels */}
                    <div style={{ width: '60px', backgroundColor: '#F9FAFB' }}>
                        {HOURS.map(hour => (
                            <div key={hour} style={{
                                height: '60px',
                                borderRight: '1px solid #E5E7EB',
                                borderBottom: '1px solid #E5E7EB',
                                fontSize: '11px',
                                color: '#6B7280',
                                padding: '4px',
                                textAlign: 'right'
                            }}>
                                {hour > 12 ? `${hour - 12} PM` : `${hour} ${hour === 12 ? 'PM' : 'AM'}`}
                            </div>
                        ))}
                    </div>

                    {/* Day Columns BG */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', flex: 1, position: 'relative' }}>
                        {DAYS.map((day) => (
                            <div key={day} style={{
                                height: `${14 * 60}px`,
                                borderRight: '1px solid #E5E7EB',
                                borderBottom: '1px solid #E5E7EB',
                                position: 'relative'
                            }}>
                                {/* Grid Lines (Horizontal) */}
                                {HOURS.map(hour => (
                                    <div key={hour} style={{
                                        position: 'absolute',
                                        top: `${(hour - 8) * 60}px`,
                                        width: '100%',
                                        borderBottom: '1px solid #F3F4F6'
                                    }} />
                                ))}

                                {/* Courses */}
                                {plannedCourses.filter(c => c.days.includes(day)).map(course => {
                                    const top = getGridPosition(course.startTime);
                                    const height = getDurationHeight(course.startTime, course.endTime);

                                    return (
                                        <div
                                            key={`${course.id}-${day}`}
                                            className="course-block"
                                            style={{
                                                position: 'absolute',
                                                top: `${top}px`,
                                                left: '4px',
                                                right: '4px',
                                                height: `${height}px`,
                                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                border: '1px solid #3B82F6',
                                                borderLeftWidth: '4px',
                                                borderRadius: '4px',
                                                padding: '4px',
                                                fontSize: '10px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                zIndex: 10
                                            }}
                                            onClick={() => onRemoveCourse(course.id)}
                                            title="Click to remove"
                                        >
                                            <div style={{ fontWeight: 700, color: '#1E40AF' }}>{course.code}</div>
                                            <div style={{ color: '#1E3A8A' }}>{course.room}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timetable;
