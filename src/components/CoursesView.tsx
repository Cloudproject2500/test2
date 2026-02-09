import React, { useState, useMemo } from 'react';
import { coursesData } from '../data/coursesData';

import CourseCard from './CourseCard';


const CoursesView: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [startTimeFilter, setStartTimeFilter] = useState(8); // 8 AM


    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };


    const filteredCourses = useMemo(() => {
        return coursesData.filter(course => {
            const matchesSearch = course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDays = selectedDays.length === 0 || course.days.some(d => selectedDays.includes(d));
            const matchesTime = parseInt(course.startTime.split(':')[0]) >= startTimeFilter;
            return matchesSearch && matchesDays && matchesTime;
        });
    }, [searchQuery, selectedDays, startTimeFilter]);



    return (
        <div className="courses-view" style={{
            display: 'flex',
            height: 'calc(100vh - 40px)',
            padding: '20px',
            gap: '24px',
            overflow: 'hidden',
            backgroundColor: '#F9FAFB'
        }}>
            {/* Left Column: Courses List */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Course Schedule</h2>

                    </div>

                    {/* Filters Toolbar */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        marginBottom: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        {/* Search */}
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
                                    backgroundColor: '#F9FAFB'
                                }}
                            />
                        </div>

                        {/* Day Toggles */}
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
                                        backgroundColor: selectedDays.includes(day) ? 'var(--accent-blue)' : 'white',
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

                        {/* Time Filter */}
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
                            filteredCourses.map(course => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                />
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', padding: '12px', gridColumn: '1 / -1' }}>
                                No courses match your filters.
                            </p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CoursesView;
