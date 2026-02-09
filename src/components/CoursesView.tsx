import React, { useState, useMemo } from 'react';
import { coursesData, CATEGORIES } from '../data/coursesData';
import type { Course } from '../types';
import CourseCard from './CourseCard';


const CoursesView: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [startTimeFilter, setStartTimeFilter] = useState(8); // 8 AM
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

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

    // Group by category based on prefix mapping
    const groupedCourses = useMemo(() => {
        const groups: Record<string, Course[]> = {};
        Object.keys(CATEGORIES).forEach(cat => groups[cat] = []);

        filteredCourses.forEach(course => {
            for (const [category, prefixes] of Object.entries(CATEGORIES)) {
                if (prefixes.includes(course.prefix)) {
                    groups[category].push(course);
                    break;
                }
            }
        });
        return groups;
    }, [filteredCourses]);

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
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Course Directory</h2>
                        <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}>
                            Sync with Canvas
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Quick Search (e.g., CS 2420)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            marginBottom: '16px',
                            fontSize: '14px',
                            outline: 'none',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    />

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: selectedDays.includes(day) ? 'var(--accent-blue)' : 'white',
                                    color: selectedDays.includes(day) ? 'white' : 'var(--text-secondary)',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Starts after: {startTimeFilter}:00</span>
                        <input
                            type="range"
                            min="8"
                            max="20"
                            value={startTimeFilter}
                            onChange={(e) => setStartTimeFilter(parseInt(e.target.value))}
                            style={{ flex: 1 }}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                    {Object.entries(groupedCourses).map(([category, courses]) => (
                        <div key={category} style={{ marginBottom: '16px' }}>
                            <div
                                onClick={() => toggleCategory(category)}
                                style={{
                                    backgroundColor: '#F3F4F6',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}
                            >
                                <span style={{ fontWeight: 700, fontSize: '14px', color: '#374151' }}>{category} ({courses.length})</span>
                                <span>{expandedCategories[category] ? '−' : '+'}</span>
                            </div>

                            {expandedCategories[category] && (
                                <div style={{
                                    padding: '0 4px',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                    gap: '16px'
                                }}>
                                    {courses.length > 0 ? (
                                        courses.map(course => (
                                            <CourseCard
                                                key={course.id}
                                                course={course}
                                            />
                                        ))
                                    ) : (
                                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', padding: '12px' }}>
                                            No courses match filters in this category.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default CoursesView;
